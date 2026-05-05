/**
 * Yellow flags — psychosocial factors influencing pain chronicization.
 * - TSK-7 : Tampa Scale of Kinesiophobia, short form (Woby & Roach 2005,
 *   *Eur J Pain*). Threshold ≥ 17/28 = high kinesiophobia.
 * - PCS-4 : Pain Catastrophizing Scale, 4-item short form (McWilliams
 *   2015, validated by Patel et al. 2020, *Pain*). Threshold ≥ 8/16
 *   = high catastrophizing.
 *
 * Both are *modulators* of pain chronicization — Adams 2023, Nijs 2021.
 * High scores augmentent la probabilité a posteriori d'un profil
 * nociplastique et orientent vers une approche pain neuroscience
 * education + exposition graduée (Louw 2021, JOSPT).
 */

export type YellowFlagType = "tsk" | "pcs";

export type YellowFlagItem = {
  id: string;
  type: YellowFlagType;
  question: string;
};

export type YellowFlagAnswers = Record<string, number>;

export type YellowFlagAssessment = {
  answers: YellowFlagAnswers;
  date: string;
};

export type YellowFlagScore = {
  /** TSK-7 raw score, 7-28. */
  tskScore: number;
  tskMax: 28;
  tskHigh: boolean;
  /** PCS-4 raw score, 0-16. */
  pcsScore: number;
  pcsMax: 16;
  pcsHigh: boolean;
  /** True when both TSK and PCS are above threshold. */
  bothHigh: boolean;
  /** Number of items answered (out of 11). */
  answeredCount: number;
};

export const TSK_THRESHOLD = 17;
export const PCS_THRESHOLD = 8;

/** TSK-7 Likert options (1-4). Lower = less kinesiophobia. */
export const tskOptions: { value: number; label: string }[] = [
  { value: 1, label: "Pas du tout d'accord" },
  { value: 2, label: "Pas d'accord" },
  { value: 3, label: "D'accord" },
  { value: 4, label: "Tout à fait d'accord" },
];

/** PCS-4 Likert options (0-4). 0 = jamais, 4 = toujours. */
export const pcsOptions: { value: number; label: string }[] = [
  { value: 0, label: "Jamais" },
  { value: 1, label: "Rarement" },
  { value: 2, label: "Parfois" },
  { value: 3, label: "Souvent" },
  { value: 4, label: "Toujours" },
];

export const yellowFlagItems: YellowFlagItem[] = [
  // TSK-7 — kinésiophobie / peur du mouvement
  {
    id: "tsk1",
    type: "tsk",
    question: "J'ai peur de me blesser si je fais de l'exercice.",
  },
  {
    id: "tsk2",
    type: "tsk",
    question: "La douleur me fait toujours penser que je me suis blessé(e).",
  },
  {
    id: "tsk3",
    type: "tsk",
    question: "Mon corps me dit que quelque chose ne va vraiment pas.",
  },
  {
    id: "tsk4",
    type: "tsk",
    question: "Si la douleur s'aggrave, c'est que ma blessure s'aggrave.",
  },
  {
    id: "tsk5",
    type: "tsk",
    question: "Le simple fait d'avoir mal me fait peur.",
  },
  {
    id: "tsk6",
    type: "tsk",
    question:
      "Faire de l'exercice avec cette douleur risque d'aggraver les choses.",
  },
  {
    id: "tsk7",
    type: "tsk",
    question:
      "Personne ne devrait avoir à faire de l'exercice quand il a mal.",
  },
  // PCS-4 — catastrophisme face à la douleur
  {
    id: "pcs1",
    type: "pcs",
    question: "Je n'arrête pas de penser à combien j'ai mal.",
  },
  {
    id: "pcs2",
    type: "pcs",
    question: "J'ai peur que la douleur s'aggrave.",
  },
  {
    id: "pcs3",
    type: "pcs",
    question: "Je sens que je ne peux plus continuer.",
  },
  {
    id: "pcs4",
    type: "pcs",
    question: "C'est terrible, j'ai peur que ça ne s'améliore jamais.",
  },
];

export function scoreYellowFlags(
  answers: YellowFlagAnswers,
): YellowFlagScore {
  let tskScore = 0;
  let pcsScore = 0;
  let answered = 0;

  for (const item of yellowFlagItems) {
    const v = answers[item.id];
    if (typeof v !== "number") continue;
    answered++;
    if (item.type === "tsk") tskScore += v;
    else pcsScore += v;
  }

  const tskHigh = tskScore >= TSK_THRESHOLD;
  const pcsHigh = pcsScore >= PCS_THRESHOLD;

  return {
    tskScore,
    tskMax: 28,
    tskHigh,
    pcsScore,
    pcsMax: 16,
    pcsHigh,
    bothHigh: tskHigh && pcsHigh,
    answeredCount: answered,
  };
}

export function yellowFlagsOrientation(score: YellowFlagScore): {
  title: string;
  message: string;
} {
  if (score.bothHigh) {
    return {
      title: "Drapeaux jaunes marqués (TSK + PCS)",
      message:
        "Kinésiophobie et catastrophisme élevés. Privilégier pain neuroscience education (Louw 2021) + exposition graduée. Probabilité augmentée d'un profil nociplastique. Éviter les explications structuralistes anxiogènes.",
    };
  }
  if (score.tskHigh) {
    return {
      title: "Kinésiophobie élevée",
      message:
        "Peur du mouvement marquée. Reformuler la douleur comme signal modulable, exposition graduée, validation des sensations.",
    };
  }
  if (score.pcsHigh) {
    return {
      title: "Catastrophisme élevé",
      message:
        "Tendance à amplifier la menace. Réassurance, recadrage cognitif, approche centrée sur les capacités présentes plutôt que sur la limitation.",
    };
  }
  return {
    title: "Drapeaux jaunes faibles",
    message:
      "Pas de signal psychosocial marquant à l'instant T. Continuer à surveiller au fil du suivi.",
  };
}
