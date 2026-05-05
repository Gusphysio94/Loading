import type {
  Confidence,
  DeepAssessmentAnswers,
  DeepAssessmentModule,
  DeepAssessmentResult,
  PathologyCandidate,
  Ranking,
} from "../types/deepAssessment";

/**
 * Moteur de scoring — somme pondérée des signaux (anamnèse + tests) par
 * pathologie candidate. Approche heuristique inspirée d'un raisonnement
 * Bayes-like simplifié, à confronter au jugement clinique.
 *
 * NOTE : ce score N'EST PAS une probabilité diagnostique. C'est un classement
 * ordinal qui aide le kiné à structurer ses hypothèses.
 */

/** Prior log-weight per prevalence band — léger ajustement contextuel. */
const prevalencePrior: Record<PathologyCandidate["prevalence"], number> = {
  common: 0.5,
  moderate: 0,
  rare: -0.5,
};

function rawScoreFor(
  pathology: PathologyCandidate,
  answers: DeepAssessmentAnswers,
): { raw: number; contributors: { label: string; weight: number }[] } {
  let raw = prevalencePrior[pathology.prevalence];
  const contributors: { label: string; weight: number }[] = [];

  // Anamnèse
  for (const [questionId, choices] of Object.entries(answers.questions)) {
    const sig = pathology.questionSignatures[questionId];
    if (!sig) continue;
    for (const choiceId of choices) {
      const w = sig[choiceId];
      if (w === undefined || w === 0) continue;
      raw += w;
      contributors.push({ label: `${questionId}:${choiceId}`, weight: w });
    }
  }

  // Tests cliniques
  for (const [testId, result] of Object.entries(answers.tests)) {
    if (result === "untested") continue;
    const sig = pathology.testSignatures[testId];
    if (!sig) continue;
    const w = sig[result];
    if (w === undefined || w === 0) continue;
    raw += w;
    contributors.push({ label: `test:${testId}:${result}`, weight: w });
  }

  return { raw, contributors };
}

function answersAreEmpty(answers: DeepAssessmentAnswers): boolean {
  const totalAnswers = Object.values(answers.questions).reduce(
    (s, arr) => s + arr.length,
    0,
  );
  const totalTests = Object.values(answers.tests).filter(
    (r) => r !== "untested",
  ).length;
  return totalAnswers === 0 && totalTests === 0;
}

function clamp01(x: number): number {
  if (Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

/**
 * Compute rankings for the module.
 *
 * Score normalization :
 *  - Soustrait le score min, divise par (max - min) pour un mapping [0, 1].
 *  - Si tous les scores sont identiques (cas dégénéré), tous = 0.
 *
 * Confidence :
 *  - "high" si top > 1.5 × second (et top raw ≥ 4)
 *  - "moderate" si top > 1.15 × second (et top raw ≥ 2)
 *  - "low" sinon
 */
export function scoreDeepAssessment(
  module: DeepAssessmentModule,
  answers: DeepAssessmentAnswers,
): DeepAssessmentResult {
  const insufficientData = answersAreEmpty(answers);

  const enriched = module.pathologies.map((p) => {
    const { raw, contributors } = rawScoreFor(p, answers);
    return { p, raw, contributors };
  });

  const rawValues = enriched.map((e) => e.raw);
  const min = Math.min(...rawValues);
  const max = Math.max(...rawValues);
  const range = max - min;

  const rankings: Ranking[] = enriched
    .map(({ p, raw, contributors }) => {
      const normalized = range > 0.001 ? clamp01((raw - min) / range) : 0;
      // Top contributors : positifs, triés desc, top 3
      const topContribs = contributors
        .filter((c) => c.weight > 0)
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 3)
        .map((c) => formatContributorLabel(c.label, module));
      return {
        pathologyId: p.id,
        score: normalized,
        rawScore: raw,
        contributors: topContribs,
      };
    })
    .sort((a, b) => b.rawScore - a.rawScore);

  const top = rankings[0];
  const second = rankings[1];

  let topConfidence: Confidence = "low";
  if (top && second && !insufficientData) {
    const ratio = second.rawScore > 0 ? top.rawScore / second.rawScore : Infinity;
    if (top.rawScore >= 4 && ratio > 1.5) topConfidence = "high";
    else if (top.rawScore >= 2 && ratio > 1.15) topConfidence = "moderate";
  }

  const ambiguous =
    !!second &&
    top.rawScore > 0 &&
    second.rawScore > 0 &&
    second.rawScore / top.rawScore > 0.85;

  return {
    rankings,
    topConfidence,
    insufficientData,
    ambiguous,
  };
}

/**
 * Friendly label for a (questionId:choiceId) or (test:testId:result)
 * raw key. Looks up the question/choice/test in the module to produce
 * a short human-readable string.
 */
function formatContributorLabel(
  rawLabel: string,
  module: DeepAssessmentModule,
): string {
  if (rawLabel.startsWith("test:")) {
    const [, testId, result] = rawLabel.split(":");
    const test = module.tests.find((t) => t.id === testId);
    if (!test) return rawLabel;
    return `${test.name} ${result === "positive" ? "positif" : "négatif"}`;
  }
  const [questionId, choiceId] = rawLabel.split(":");
  const q = module.questions.find((qq) => qq.id === questionId);
  if (!q) return rawLabel;
  const c = q.choices.find((cc) => cc.id === choiceId);
  if (!c) return q.prompt;
  return c.label;
}
