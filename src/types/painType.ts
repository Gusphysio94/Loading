/**
 * Pain mechanism classification — 3 IASP categories
 * (Kosek et al. 2016/2021; Smart et al. 2012; Nijs et al. 2014/2021)
 */

export type PainMechanism = "nociceptive" | "neuropathic" | "nociplastic";

export type PainItem = {
  id: string;
  /** Mechanism this item primarily indicates. */
  mechanism: PainMechanism;
  /** Question text (in "tu" — patient-facing or kiné-asking-patient). */
  question: string;
  /** Optional helper hint. */
  hint?: string;
  /** Items flagged as "pivot" double their weight (Smart 2012, Nijs 2021). */
  pivot?: boolean;
};

export type PainAnswer = "yes" | "no";

export type PainAssessment = {
  /** Map of item id → answer */
  answers: Record<string, PainAnswer>;
  /** ISO timestamp */
  date: string;
};

export type PainScore = {
  nociceptive: number; // 0-100 (% of max for that mechanism)
  neuropathic: number;
  nociplastic: number;
  /** Mechanism with the highest score, if dominance is clear (gap > 20). */
  dominant?: PainMechanism;
  /** True when no single mechanism stands out (mixed profile). */
  mixed: boolean;
  /** Total raw points scored (across all 3 mechanisms). */
  rawTotal: number;
  /** Maximum possible raw points (for confidence assessment). */
  rawMax: number;
};

export const mechanismLabels: Record<PainMechanism, string> = {
  nociceptive: "Nociceptif",
  neuropathic: "Neuropathique",
  nociplastic: "Nociplastique",
};

export const mechanismColors: Record<PainMechanism, string> = {
  nociceptive: "#34d399", // success green
  neuropathic: "#fbbf24", // warning amber
  nociplastic: "#a64bff", // brand violet
};

export const mechanismShortDescriptions: Record<PainMechanism, string> = {
  nociceptive: "Mécanique, locale, reproductible — tissu en cause.",
  neuropathic:
    "Atteinte du nerf — brûlures, décharges, fourmillements, trajet.",
  nociplastic:
    "Sensibilisation centrale — douleur disproportionnée, diffuse, hypersensibilité.",
};

/**
 * 9 items — 3 par mécanisme, avec un item pivot (×2) par mécanisme.
 * Sources : Smart 2012, Nijs 2014/2021, Bouhassira 2005 (DN4),
 * Freynhagen 2006 (painDETECT), Shraim 2021, Kosek 2021.
 */
export const painItems: PainItem[] = [
  // === Nociceptif ===
  {
    id: "noc_movement",
    mechanism: "nociceptive",
    question:
      "La douleur est clairement liée à un mouvement, une posture ou une activité précise ?",
    hint: "Reproductible à la mise en tension / sollicitation",
    pivot: true, // Smart 2012, plus haute valeur discriminante
  },
  {
    id: "noc_rest",
    mechanism: "nociceptive",
    question:
      "Elle diminue nettement au repos ou en position antalgique ?",
  },
  {
    id: "noc_local",
    mechanism: "nociceptive",
    question:
      "Elle est localisée et reproductible par palpation / mise en tension ?",
  },

  // === Neuropathique ===
  {
    id: "neu_burn",
    mechanism: "neuropathic",
    question:
      "Sensations de brûlure, décharge électrique ou courant ?",
    hint: "Item pivot du DN4 et du painDETECT",
    pivot: true,
  },
  {
    id: "neu_paresthesia",
    mechanism: "neuropathic",
    question:
      "Fourmillements, picotements ou engourdissements dans la zone ?",
  },
  {
    id: "neu_dermatome",
    mechanism: "neuropathic",
    question:
      "La douleur suit un trajet de nerf ou un dermatome (territoire précis) ?",
  },

  // === Nociplastique ===
  {
    id: "ncp_disprop",
    mechanism: "nociplastic",
    question:
      "Disproportionnée par rapport à ce qu'on attendrait (intensité, étendue, durée) ?",
    hint: "Critère pivot Nijs 2014 / Kosek 2021",
    pivot: true,
  },
  {
    id: "ncp_widespread",
    mechanism: "nociplastic",
    question:
      "Plusieurs zones du corps douloureuses simultanément (≥ 2 quadrants) ?",
  },
  {
    id: "ncp_hypersensitivity",
    mechanism: "nociplastic",
    question:
      "Hypersensibilité au bruit, à la lumière, au stress, ou sommeil/fatigue altérés ?",
    hint: "Items du CSI (Mayer 2012, Neblett 2017)",
  },
];

/**
 * Score the assessment.
 * - Each "yes" = 1 point on its mechanism. Pivot items = 2 points.
 * - Per-mechanism % = score / max possible for that mechanism × 100.
 * - Dominance: top mechanism with > 20% gap on the second one.
 */
export function scorePainAssessment(
  answers: Record<string, PainAnswer>,
): PainScore {
  const tally: Record<PainMechanism, { score: number; max: number }> = {
    nociceptive: { score: 0, max: 0 },
    neuropathic: { score: 0, max: 0 },
    nociplastic: { score: 0, max: 0 },
  };

  for (const item of painItems) {
    const w = item.pivot ? 2 : 1;
    tally[item.mechanism].max += w;
    if (answers[item.id] === "yes") {
      tally[item.mechanism].score += w;
    }
  }

  const noc = (tally.nociceptive.score / tally.nociceptive.max) * 100;
  const neu = (tally.neuropathic.score / tally.neuropathic.max) * 100;
  const ncp = (tally.nociplastic.score / tally.nociplastic.max) * 100;

  const sorted = (
    [
      ["nociceptive", noc],
      ["neuropathic", neu],
      ["nociplastic", ncp],
    ] as [PainMechanism, number][]
  ).sort((a, b) => b[1] - a[1]);

  const [topMech, topScore] = sorted[0];
  const [, secondScore] = sorted[1];
  const gap = topScore - secondScore;
  const mixed = gap < 20 || topScore < 40;

  const rawTotal =
    tally.nociceptive.score +
    tally.neuropathic.score +
    tally.nociplastic.score;
  const rawMax =
    tally.nociceptive.max + tally.neuropathic.max + tally.nociplastic.max;

  return {
    nociceptive: Math.round(noc),
    neuropathic: Math.round(neu),
    nociplastic: Math.round(ncp),
    dominant: mixed ? undefined : topMech,
    mixed,
    rawTotal,
    rawMax,
  };
}

/**
 * Therapeutic orientation hint per dominance, evidence-based.
 * Sources: Nijs 2021 Lancet Rheumatol, Louw 2021 JOSPT (PNE), Smart 2012.
 */
export function orientationFor(score: PainScore): {
  title: string;
  message: string;
} {
  if (score.rawTotal < 2) {
    return {
      title: "Profil indéterminé",
      message:
        "Trop peu d'éléments pour conclure. Compléter l'examen clinique et réinterroger.",
    };
  }
  if (score.mixed) {
    return {
      title: "Profil mixte",
      message:
        "Les mécanismes coexistent (cas le plus fréquent en MSK chronique — Chimenti et al. 2018). Adapter l'approche aux signaux dominants observés en clinique.",
    };
  }
  switch (score.dominant) {
    case "nociceptive":
      return {
        title: "Dominance nociceptive",
        message:
          "Approche classique : gestion de charge, exposition graduée au mouvement provocateur, normalisation tissulaire.",
      };
    case "neuropathic":
      return {
        title: "Dominance neuropathique",
        message:
          "Avis médical recommandé pour caractériser l'atteinte (DN4 complet, examen neurologique). La gestion de charge seule n'est pas adaptée — possible pharmaco + neurodynamique.",
      };
    case "nociplastic":
      return {
        title: "Dominance nociplastique",
        message:
          "Privilégier pain neuroscience education (Louw 2021), exposition graduée, gestion du stress / sommeil. Éviter les explications structuralistes anxiogènes (Nijs 2023).",
      };
    default:
      return { title: "Profil indéterminé", message: "" };
  }
}
