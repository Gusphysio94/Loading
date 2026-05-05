import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  AnamnesisQuestion,
  ClinicalTest,
  ClinicalTestResult,
  DeepAssessmentAnswers,
  DeepAssessmentModule,
  DeepAssessmentResult,
  PathologyCandidate,
} from "../types/deepAssessment";
import {
  anamnesisCategoryLabels,
  confidenceLabels,
  prevalenceLabels,
} from "../types/deepAssessment";
import { scoreDeepAssessment } from "../lib/deepAssessmentScoring";
import { cn } from "../lib/cn";
import {
  CheckIcon,
  AlertIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
} from "./icons";

type Step = "intro" | "anamnesis" | "tests" | "results";

type DeepAssessmentScreenProps = {
  module: DeepAssessmentModule;
  initial?: DeepAssessmentAnswers;
  onComplete: (answers: DeepAssessmentAnswers) => void;
  onExit: () => void;
};

export function DeepAssessmentScreen({
  module,
  initial,
  onComplete,
  onExit,
}: DeepAssessmentScreenProps) {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<DeepAssessmentAnswers>(
    initial ?? { questions: {}, tests: {} },
  );

  const visibleQuestions = useMemo(
    () => module.questions.filter((q) => isQuestionVisible(q, answers)),
    [module.questions, answers],
  );

  const result = useMemo<DeepAssessmentResult | null>(() => {
    if (step !== "results") return null;
    return scoreDeepAssessment(module, answers);
  }, [module, answers, step]);

  function setQuestionAnswer(questionId: string, choiceIds: string[]) {
    setAnswers((prev) => ({
      ...prev,
      questions: { ...prev.questions, [questionId]: choiceIds },
    }));
  }

  function setTestResult(testId: string, result: ClinicalTestResult) {
    setAnswers((prev) => ({
      ...prev,
      tests: { ...prev.tests, [testId]: result },
    }));
  }

  function handleNext() {
    if (step === "intro") setStep("anamnesis");
    else if (step === "anamnesis") setStep("tests");
    else if (step === "tests") {
      onComplete(answers);
      setStep("results");
    }
  }

  function handleBack() {
    if (step === "intro") onExit();
    else if (step === "anamnesis") setStep("intro");
    else if (step === "tests") setStep("anamnesis");
    else if (step === "results") setStep("tests");
  }

  return (
    <motion.div
      key="deep-assessment"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-12 pt-8 sm:pt-10"
    >
      <ProgressBar step={step} />

      <AnimatePresence mode="wait">
        {step === "intro" && (
          <IntroStep
            key="intro"
            module={module}
            onAccept={handleNext}
            onCancel={onExit}
          />
        )}
        {step === "anamnesis" && (
          <AnamnesisStep
            key="anamnesis"
            questions={visibleQuestions}
            answers={answers.questions}
            onChange={setQuestionAnswer}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}
        {step === "tests" && (
          <TestsStep
            key="tests"
            tests={module.tests}
            results={answers.tests}
            onChange={setTestResult}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}
        {step === "results" && result && (
          <ResultsStep
            key="results"
            module={module}
            result={result}
            onBack={handleBack}
            onExit={onExit}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function isQuestionVisible(
  q: AnamnesisQuestion,
  answers: DeepAssessmentAnswers,
): boolean {
  if (!q.showIf) return true;
  const dep = answers.questions[q.showIf.questionId] ?? [];
  return dep.some((v) => q.showIf!.valueIn.includes(v));
}

function ProgressBar({ step }: { step: Step }) {
  const stepIndex = { intro: 0, anamnesis: 1, tests: 2, results: 3 }[step];
  const labels = ["Cadre", "Anamnèse", "Tests", "Hypothèses"];
  return (
    <div className="mb-6 flex items-center gap-2">
      {labels.map((label, i) => {
        const isActive = i === stepIndex;
        const isDone = i < stepIndex;
        return (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition-colors",
                isActive
                  ? "border-brand-pink bg-brand-pink/20 text-white"
                  : isDone
                    ? "border-brand-pink/60 bg-brand-pink/10 text-brand-pink"
                    : "border-white/15 bg-white/[0.03] text-white/45",
              )}
            >
              {isDone ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <div
              className={cn(
                "hidden text-[11px] font-semibold uppercase tracking-wider sm:block",
                isActive
                  ? "text-white"
                  : isDone
                    ? "text-brand-pink/80"
                    : "text-white/35",
              )}
            >
              {label}
            </div>
            {i < labels.length - 1 && (
              <div className="h-px flex-1 bg-white/10" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* -------------------- INTRO STEP -------------------- */

function IntroStep({
  module,
  onAccept,
  onCancel,
}: {
  module: DeepAssessmentModule;
  onAccept: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-pink/80">
        Aide au raisonnement clinique
      </span>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        {module.title}
      </h2>
      <p className="mt-2 text-sm text-white/55">{module.scope}</p>

      <div className="mt-6 rounded-2xl border border-accent-warning/30 bg-accent-warning/[0.05] p-5">
        <div className="flex items-center gap-2">
          <AlertIcon className="h-4 w-4 text-accent-warning" />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent-warning">
            À lire avant de continuer
          </span>
        </div>
        <h3 className="mt-3 text-base font-semibold text-white">
          Outil d'aide — pas un outil de diagnostic médical
        </h3>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/75">
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-warning" />
            <span>
              Cet outil propose un classement d'<strong>hypothèses cliniques</strong> à
              partir de l'anamnèse et des tests. Il <strong>ne pose pas de
              diagnostic</strong>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-warning" />
            <span>
              Les hypothèses sont à <strong>confronter à votre examen clinique
              complet</strong> et à votre raisonnement.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-warning" />
            <span>
              Le <strong>diagnostic médical reste de la responsabilité du
              médecin</strong>. Les recommandations d'imagerie sont des{" "}
              <em>suggestions à discuter</em> si vous estimez nécessaire d'orienter
              votre patient.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-warning" />
            <span>
              Cette évaluation s'utilise <strong>après le triage drapeaux
              rouges</strong> — elle ne le remplace en aucun cas.
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
        >
          Annuler
        </motion.button>
        <motion.button
          type="button"
          onClick={onAccept}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="gradient-bg flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
        >
          Compris, démarrer l'évaluation
          <ChevronRightIcon className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* -------------------- ANAMNESIS STEP -------------------- */

function AnamnesisStep({
  questions,
  answers,
  onChange,
  onBack,
  onNext,
}: {
  questions: AnamnesisQuestion[];
  answers: Record<string, string[]>;
  onChange: (questionId: string, choiceIds: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const answeredCount = questions.filter(
    (q) => (answers[q.id]?.length ?? 0) > 0,
  ).length;

  // Group by category for visual structure
  const grouped = useMemo(() => {
    const acc: Record<string, AnamnesisQuestion[]> = {};
    for (const q of questions) {
      if (!acc[q.category]) acc[q.category] = [];
      acc[q.category].push(q);
    }
    return acc;
  }, [questions]);

  return (
    <motion.div
      key="anamnesis"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-pink/80">
        Étape 2 · Anamnèse
      </span>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        Recueil clinique structuré
      </h2>
      <p className="mt-2 text-sm text-white/55">
        Choisis les réponses qui correspondent au tableau du patient. Les
        questions à choix multiples acceptent plusieurs réponses.
      </p>

      <div className="mt-2 text-[11px] text-white/35">
        {answeredCount}/{questions.length} questions renseignées
      </div>

      <div className="mt-6 space-y-7">
        {(["onset", "mechanism", "character", "modifiers", "history"] as const).map(
          (cat) => {
            const qs = grouped[cat];
            if (!qs || qs.length === 0) return null;
            return (
              <section key={cat}>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-violet/80">
                  {anamnesisCategoryLabels[cat]}
                </div>
                <div className="mt-3 space-y-4">
                  {qs.map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      selected={answers[q.id] ?? []}
                      onChange={(ids) => onChange(q.id, ids)}
                    />
                  ))}
                </div>
              </section>
            );
          },
        )}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Retour
        </motion.button>
        <motion.button
          type="button"
          onClick={onNext}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="gradient-bg flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
        >
          Continuer vers les tests
          <ChevronRightIcon className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

function QuestionCard({
  question,
  selected,
  onChange,
}: {
  question: AnamnesisQuestion;
  selected: string[];
  onChange: (choiceIds: string[]) => void;
}) {
  function toggle(choiceId: string) {
    if (question.multi) {
      const next = selected.includes(choiceId)
        ? selected.filter((id) => id !== choiceId)
        : [...selected, choiceId];
      onChange(next);
    } else {
      onChange(selected.includes(choiceId) ? [] : [choiceId]);
    }
  }

  return (
    <div className="surface rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex items-start gap-2">
        <h3 className="flex-1 text-sm font-semibold text-white sm:text-base">
          {question.prompt}
        </h3>
        {question.multi && (
          <span className="rounded-full border border-brand-violet/35 bg-brand-violet/[0.10] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-violet">
            Multi
          </span>
        )}
      </div>
      <div className="mt-3 grid gap-2">
        {question.choices.map((c) => {
          const isOn = selected.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              className={cn(
                "group flex w-full items-start gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors",
                isOn
                  ? "border-brand-pink/55 bg-brand-pink/[0.08]"
                  : "border-white/10 bg-white/[0.025] hover:border-white/25 hover:bg-white/[0.05]",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                  question.multi ? "rounded" : "rounded-full",
                  isOn
                    ? "border-brand-pink bg-brand-pink text-night-500"
                    : "border-white/25 bg-white/[0.03] text-transparent",
                )}
                aria-hidden
              >
                {isOn && <CheckIcon className="h-3 w-3" />}
              </div>
              <div className="flex-1">
                <div
                  className={cn(
                    "text-sm font-medium",
                    isOn ? "text-white" : "text-white/85",
                  )}
                >
                  {c.label}
                </div>
                {c.hint && (
                  <div className="mt-0.5 text-[11px] text-white/45">
                    {c.hint}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------- TESTS STEP -------------------- */

function TestsStep({
  tests,
  results,
  onChange,
  onBack,
  onNext,
}: {
  tests: ClinicalTest[];
  results: Record<string, ClinicalTestResult>;
  onChange: (testId: string, result: ClinicalTestResult) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const testedCount = Object.values(results).filter(
    (r) => r === "positive" || r === "negative",
  ).length;

  return (
    <motion.div
      key="tests"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-pink/80">
        Étape 3 · Tests cliniques
      </span>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        Coche les tests réalisés
      </h2>
      <p className="mt-2 text-sm text-white/55">
        Pour chaque test, indique son résultat (positif / négatif) ou laisse
        « non testé » si tu ne l'as pas réalisé. Un test peut faire bouger les
        hypothèses, mais le scoring tolère l'absence d'information.
      </p>

      <div className="mt-2 text-[11px] text-white/35">
        {testedCount}/{tests.length} tests renseignés
      </div>

      <div className="mt-6 space-y-3">
        {tests.map((t) => (
          <TestCard
            key={t.id}
            test={t}
            result={results[t.id] ?? "untested"}
            onChange={(r) => onChange(t.id, r)}
          />
        ))}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Retour anamnèse
        </motion.button>
        <motion.button
          type="button"
          onClick={onNext}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="gradient-bg flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
        >
          Voir les hypothèses
          <ChevronRightIcon className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

function TestCard({
  test,
  result,
  onChange,
}: {
  test: ClinicalTest;
  result: ClinicalTestResult;
  onChange: (r: ClinicalTestResult) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const choices: { value: ClinicalTestResult; label: string; tone: string }[] = [
    {
      value: "positive",
      label: "Positif",
      tone: "border-accent-danger/50 bg-accent-danger/[0.10] text-accent-danger",
    },
    {
      value: "negative",
      label: "Négatif",
      tone: "border-accent-success/45 bg-accent-success/[0.08] text-accent-success",
    },
    {
      value: "untested",
      label: "Non testé",
      tone: "border-white/15 bg-white/[0.03] text-white/55",
    },
  ];

  return (
    <div className="surface rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-white sm:text-base">
            {test.name}
          </h3>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-[11px] font-medium text-brand-violet/85 hover:text-brand-violet hover:underline"
          >
            {expanded ? "Masquer la procédure" : "Voir la procédure"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 rounded-xl border border-white/10 bg-white/[0.025] px-3.5 py-3 text-xs leading-relaxed text-white/65">
          <div>
            <span className="font-semibold text-white/80">Procédure :</span>{" "}
            {test.procedure}
          </div>
          <div>
            <span className="font-semibold text-white/80">Positif si :</span>{" "}
            {test.positiveMeans}
          </div>
          {test.diagnosticAccuracy && (
            <div className="text-[11px] text-white/45">
              {test.diagnosticAccuracy}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 grid grid-cols-3 gap-2">
        {choices.map((c) => {
          const isOn = result === c.value;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => onChange(c.value)}
              className={cn(
                "rounded-xl border px-3 py-2 text-xs font-semibold transition-colors",
                isOn
                  ? c.tone
                  : "border-white/10 bg-white/[0.025] text-white/55 hover:border-white/25 hover:text-white",
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------- RESULTS STEP -------------------- */

function ResultsStep({
  module,
  result,
  onBack,
  onExit,
}: {
  module: DeepAssessmentModule;
  result: DeepAssessmentResult;
  onBack: () => void;
  onExit: () => void;
}) {
  const top3 = result.rankings.slice(0, 3);

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-pink/80">
        Étape 4 · Hypothèses cliniques
      </span>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        Hypothèses à confronter à ton examen
      </h2>
      <p className="mt-2 text-sm text-white/55">
        Classement <strong>ordinal</strong> basé sur les signaux recueillis. Ce
        n'est pas une probabilité diagnostique. À pondérer avec ton raisonnement
        et le tableau global.
      </p>

      {result.insufficientData && (
        <div className="mt-4 rounded-xl border border-accent-warning/30 bg-accent-warning/[0.06] px-4 py-3 text-xs text-white/75">
          <strong className="text-accent-warning">Données insuffisantes.</strong>{" "}
          Aucune réponse n'a été saisie — le classement n'a pas de valeur. Reviens
          en arrière pour renseigner l'anamnèse.
        </div>
      )}

      {!result.insufficientData && result.ambiguous && (
        <div className="mt-4 rounded-xl border border-brand-violet/30 bg-brand-violet/[0.06] px-4 py-3 text-xs text-white/75">
          <strong className="text-brand-violet">Tableau ambigu.</strong> Les deux
          premières hypothèses sont proches en score — pense à la possibilité
          d'une <em>coexistence</em> ou affine ton anamnèse / tests.
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 text-xs">
        <span className="text-white/55">Confiance globale :</span>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
            result.topConfidence === "high"
              ? "border-accent-success/45 bg-accent-success/[0.10] text-accent-success"
              : result.topConfidence === "moderate"
                ? "border-brand-violet/45 bg-brand-violet/[0.10] text-brand-violet"
                : "border-white/15 bg-white/[0.04] text-white/55",
          )}
        >
          {confidenceLabels[result.topConfidence]}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {top3.map((r, i) => {
          const p = module.pathologies.find((x) => x.id === r.pathologyId);
          if (!p) return null;
          return (
            <RankingCard
              key={r.pathologyId}
              rank={i + 1}
              pathology={p}
              score={r.score}
              contributors={r.contributors}
              isTop={i === 0 && !result.insufficientData}
            />
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.025] px-5 py-4 text-xs leading-relaxed text-white/55">
        <strong className="font-semibold text-white/75">Rappel.</strong> Ce
        classement est une <em>aide au raisonnement</em> — pas un diagnostic. Il
        ne remplace ni ton examen clinique, ni l'avis d'un médecin si tu estimes
        nécessaire d'orienter le patient. Les recommandations d'imagerie sont
        des suggestions à discuter avec le médecin.
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Ajuster les tests
        </motion.button>
        <motion.button
          type="button"
          onClick={onExit}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="gradient-bg flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
        >
          Retour à l'accueil
        </motion.button>
      </div>
    </motion.div>
  );
}

function RankingCard({
  rank,
  pathology,
  score,
  contributors,
  isTop,
}: {
  rank: number;
  pathology: PathologyCandidate;
  score: number;
  contributors: string[];
  isTop: boolean;
}) {
  const [expanded, setExpanded] = useState(isTop);
  const scorePct = Math.round(score * 100);

  return (
    <div
      className={cn(
        "surface-strong overflow-hidden rounded-2xl",
        isTop ? "border-brand-pink/40" : "border-white/10",
      )}
    >
      {isTop && (
        <div className="gradient-bg h-[3px] w-full opacity-70" />
      )}
      <div className="px-5 py-5">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-black",
              isTop
                ? "gradient-bg text-white"
                : "border border-white/15 bg-white/[0.04] text-white/65",
            )}
          >
            {rank}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.18em]",
                  isTop ? "text-brand-pink" : "text-white/40",
                )}
              >
                {isTop ? "Hypothèse principale" : `Alternative #${rank}`}
              </span>
              <span className="rounded-full border border-white/12 bg-white/[0.03] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/55">
                {prevalenceLabels[pathology.prevalence]}
              </span>
            </div>
            <h3 className="mt-1 text-base font-bold text-white sm:text-lg">
              {pathology.name}
            </h3>
            <div className="mt-1 text-[11px] text-white/45">
              Score relatif {scorePct} / 100
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-white/70">
          {pathology.summary}
        </p>

        {contributors.length > 0 && (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
              Signaux contributeurs principaux
            </div>
            <ul className="mt-1 space-y-0.5 text-[11px] text-white/65">
              {contributors.map((c, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-brand-pink">→</span> {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-[12px] font-semibold text-brand-violet hover:underline"
        >
          {expanded ? "Masquer" : "Voir"} le plan de prise en charge
        </button>

        {expanded && <ManagementPlanView pathology={pathology} />}
      </div>
    </div>
  );
}

function ManagementPlanView({ pathology }: { pathology: PathologyCandidate }) {
  const m = pathology.management;
  return (
    <div className="mt-3 space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4">
      {pathology.hallmarks.length > 0 && (
        <Section title="Signes d'appel">
          <ul className="space-y-1 text-sm text-white/75">
            {pathology.hallmarks.map((h, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink" />
                {h}
              </li>
            ))}
          </ul>
        </Section>
      )}
      <Section title="PEC kiné — première intention">
        <ul className="space-y-1 text-sm text-white/75">
          {m.conservative.map((c, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/40" />
              {c}
            </li>
          ))}
        </ul>
      </Section>
      {m.imaging && (
        <Section title="Imagerie — suggestion à discuter">
          <div className="rounded-xl border border-white/12 bg-white/[0.03] px-3.5 py-3 text-sm text-white/75">
            <div className="font-semibold text-white">{m.imaging.modality}</div>
            <div className="mt-0.5 text-[11px] uppercase tracking-wider text-white/45">
              {urgencyLabel(m.imaging.urgency)}
            </div>
            <div className="mt-1.5 text-[12px] leading-relaxed text-white/65">
              {m.imaging.rationale}
            </div>
          </div>
        </Section>
      )}
      {m.referral && (
        <Section title="Orientation médicale">
          <p className="text-sm leading-relaxed text-white/75">{m.referral}</p>
        </Section>
      )}
      {m.followUp && (
        <Section title="Revoyure / suivi">
          <p className="text-sm leading-relaxed text-white/75">{m.followUp}</p>
        </Section>
      )}
      {pathology.patientScript && (
        <Section title="À dire au patient">
          <p className="rounded-xl border border-brand-violet/25 bg-brand-violet/[0.05] px-3.5 py-3 text-[13px] italic leading-relaxed text-white/80">
            {pathology.patientScript}
          </p>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-violet/80">
        {title}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function urgencyLabel(u: "routine" | "soonish" | "urgent" | "rare"): string {
  switch (u) {
    case "urgent":
      return "Urgence";
    case "soonish":
      return "À organiser sans délai";
    case "routine":
      return "Programmable";
    case "rare":
      return "Rarement nécessaire";
  }
}
