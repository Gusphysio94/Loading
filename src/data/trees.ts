import type { Tree } from "../types/tree";

const sharedFollowUp = {
  q_post: {
    id: "q_post",
    kind: "question" as const,
    title: "Le patient a-t-il une douleur augmentée après la séance (journée / soir) ?",
    subtitle: "Évaluation post-séance",
    recap: "Douleur après séance",
    choices: [
      { label: "OUI", next: "r_too_much", variant: "yes" as const },
      { label: "NON", next: "q_next_day", variant: "no" as const },
    ],
  },
  q_next_day: {
    id: "q_next_day",
    kind: "question" as const,
    title: "Le patient a-t-il une douleur le lendemain ?",
    subtitle: "Évaluation à 24 h",
    recap: "Douleur le lendemain",
    choices: [
      { label: "OUI", next: "r_too_much", variant: "yes" as const },
      { label: "NON", next: "r_progress", variant: "no" as const },
    ],
  },
  r_progress: {
    id: "r_progress",
    kind: "recommendation" as const,
    severity: "success" as const,
    title: "Charge tolérée",
    message:
      "La charge est bien tolérée. On peut continuer la programmation et progresser.",
    cta: "Nouvelle évaluation",
  },
  r_too_much: {
    id: "r_too_much",
    kind: "recommendation" as const,
    severity: "warning" as const,
    title: "Charge probablement trop élevée",
    message:
      "On ajuste les prochaines séances. Tu peux aussi refaire la même séance la prochaine fois et observer la réponse.",
    cta: "Nouvelle évaluation",
  },
};

export const exerciceTree: Tree = {
  id: "exercice",
  title: "Douleur lors d'un exercice",
  shortTitle: "Exercice",
  description: "Renforcement musculaire, mobilité, exercices ciblés.",
  icon: "dumbbell",
  startId: "q1",
  inputsSchema: "exercise",
  nodes: {
    q1: {
      id: "q1",
      kind: "question",
      title: "Le patient ressent-il une douleur pendant l'exercice ?",
      subtitle: "Évaluation pendant la séance",
      recap: "Douleur pendant l'exercice",
      choices: [
        { label: "OUI", next: "q1b", variant: "yes" },
        { label: "NON", next: "q_post", variant: "no" },
      ],
    },
    q1b: {
      id: "q1b",
      kind: "eva",
      title: "Quelle est l'intensité de la douleur ?",
      subtitle: "Échelle visuelle analogique (EVA) · seuil clé : 4/10",
      recap: "EVA",
      threshold: 4,
      minLabel: "Aucune douleur",
      maxLabel: "Douleur insupportable",
      belowOrEqual: { next: "q_post" },
      above: { next: "mod1" },
    },
    mod1: {
      id: "mod1",
      kind: "modulation",
      title: "On modifie l'exercice",
      subtitle: "Premier ajustement à tester immédiatement",
      recap: "Modulation niveau 1",
      bullets: [
        "Moins lourd",
        "Moins de répétitions",
        "Moins d'amplitude",
        "Plus lentement",
      ],
      computeBulletsKey: "exercise_mod1",
      followUp: "Après ces modulations, c'est mieux ?",
      choices: [
        { label: "OUI", next: "r_keep", variant: "yes" },
        { label: "NON", next: "mod2", variant: "no" },
      ],
    },
    mod2: {
      id: "mod2",
      kind: "modulation",
      title: "On va plus loin dans l'ajustement",
      subtitle: "Deuxième palier de modulations",
      recap: "Modulation niveau 2",
      bullets: [
        "On enlève 20-30 % de la charge",
        "On ajuste la technique d'exécution",
        "On enlève une série",
        "On ralentit le mouvement",
        "On réduit le nombre de répétitions",
        "Ou on refait la même séance sans changer les modalités, pour observer",
      ],
      computeBulletsKey: "exercise_mod2",
      followUp: "Après ces modulations, c'est mieux ?",
      choices: [
        { label: "OUI", next: "r_keep", variant: "yes" },
        { label: "NON", next: "r_stop_alternative", variant: "no" },
      ],
    },
    r_keep: {
      id: "r_keep",
      kind: "recommendation",
      severity: "success",
      title: "On garde ces modalités",
      message:
        "L'exercice est bien toléré sous cette forme. On poursuit la séance avec ces modalités et on reste attentif aux 24-48 h qui suivent.",
      cta: "Nouvelle évaluation",
    },
    r_stop_alternative: {
      id: "r_stop_alternative",
      kind: "recommendation",
      severity: "danger",
      title: "Stop sur cet exercice",
      message:
        "On stoppe l'exercice et on passe au suivant, ou on trouve une alternative. Si le doute persiste, il faut analyser la situation avec un kiné spécialisé.",
      cta: "Nouvelle évaluation",
      relatedContent: [
        {
          title: "Approfondir : raisonnement clinique en gestion de charge",
          url: "https://fullphysio.com",
        },
      ],
    },
    ...sharedFollowUp,
  },
};

export const courseTree: Tree = {
  id: "course",
  title: "Douleur en course à pied",
  shortTitle: "Course à pied",
  description: "Sortie longue, intervalles, dénivelé, allure fondamentale.",
  icon: "running",
  startId: "q1",
  inputsSchema: "running",
  nodes: {
    q1: {
      id: "q1",
      kind: "question",
      title: "Le patient ressent-il une douleur en courant ?",
      subtitle: "Évaluation pendant la sortie",
      recap: "Douleur en courant",
      choices: [
        { label: "OUI", next: "q1b", variant: "yes" },
        { label: "NON", next: "q_post", variant: "no" },
      ],
    },
    q1b: {
      id: "q1b",
      kind: "eva",
      title: "Quelle est l'intensité de la douleur ?",
      subtitle: "Échelle visuelle analogique (EVA) · seuil clé : 4/10",
      recap: "EVA",
      threshold: 4,
      minLabel: "Aucune douleur",
      maxLabel: "Douleur insupportable",
      belowOrEqual: { next: "q_post" },
      above: { next: "q1c" },
    },
    q1c: {
      id: "q1c",
      kind: "question",
      title: "La douleur empire-t-elle au fil des kilomètres ?",
      subtitle: "Évolution sur la sortie",
      recap: "Empire au fil des km",
      choices: [
        { label: "OUI", next: "mod1", variant: "yes" },
        { label: "NON", next: "q_post", variant: "no" },
      ],
    },
    mod1: {
      id: "mod1",
      kind: "modulation",
      title: "Pause + reprise allure fondamentale",
      subtitle: "Test in-séance",
      recap: "Pause + allure fondamentale",
      bullets: [
        "Marche 2 minutes",
        "Reprend la course à allure fondamentale",
      ],
      computeBulletsKey: "running_mod1",
      followUp: "Après cette pause, c'est mieux ?",
      choices: [
        { label: "OUI", next: "r_finish_easy", variant: "yes" },
        { label: "NON", next: "mod2", variant: "no" },
      ],
    },
    mod2: {
      id: "mod2",
      kind: "modulation",
      title: "Arrêt de la sortie + ajustements futurs",
      subtitle: "Adapter les prochaines sorties",
      recap: "Arrêt + ajustements futurs",
      bullets: [
        "Sortie longue : enlever 20 à 30 % du volume prévu",
        "Sortie intervalles : diviser le nombre d'intervalles par 2",
        "Sorties avec dénivelé : diviser la distance de dénivelé par 2 et/ou baisser l'intensité prévue en D+",
      ],
      computeBulletsKey: "running_mod2",
      temporalNote: "À évaluer sur les prochaines séances",
      followUp: "Après application sur les séances suivantes, c'est mieux ?",
      choices: [
        { label: "OUI", next: "r_rebuild", variant: "yes" },
        { label: "NON", next: "r_specialist", variant: "no" },
      ],
    },
    r_finish_easy: {
      id: "r_finish_easy",
      kind: "recommendation",
      severity: "success",
      title: "Termine la sortie en allure fondamentale",
      message:
        "Si la douleur s'estompe, le patient peut terminer la sortie à allure fondamentale. Sinon, arrêt et retour au calme.",
      cta: "Nouvelle évaluation",
    },
    r_rebuild: {
      id: "r_rebuild",
      kind: "recommendation",
      severity: "success",
      title: "Reconstruire une progression",
      message:
        "La charge ajustée est tolérée. On reconstruit une progression à partir de cette nouvelle base.",
      cta: "Nouvelle évaluation",
    },
    r_specialist: {
      id: "r_specialist",
      kind: "recommendation",
      severity: "danger",
      title: "Avis kiné spécialisé requis",
      message:
        "Il faut analyser la situation avec un kiné spécialisé pour identifier le facteur sous-jacent.",
      cta: "Nouvelle évaluation",
      relatedContent: [
        {
          title: "Approfondir : raisonnement clinique en gestion de charge",
          url: "https://fullphysio.com",
        },
      ],
    },
    ...sharedFollowUp,
  },
};

export const sportTree: Tree = {
  id: "sport",
  title: "Douleur lors du sport",
  shortTitle: "Sport",
  description: "Sports collectifs, sports de raquette, entraînements intermittents.",
  icon: "trophy",
  startId: "q1",
  inputsSchema: "sport",
  nodes: {
    q1: {
      id: "q1",
      kind: "question",
      title: "Le patient ressent-il une douleur pendant le sport ?",
      subtitle: "Évaluation pendant l'entraînement",
      recap: "Douleur lors du sport",
      choices: [
        { label: "OUI", next: "q1b", variant: "yes" },
        { label: "NON", next: "q_post", variant: "no" },
      ],
    },
    q1b: {
      id: "q1b",
      kind: "eva",
      title: "Quelle est l'intensité de la douleur ?",
      subtitle: "Échelle visuelle analogique (EVA) · seuil clé : 4/10",
      recap: "EVA",
      threshold: 4,
      minLabel: "Aucune douleur",
      maxLabel: "Douleur insupportable",
      belowOrEqual: { next: "q_post" },
      above: { next: "q1c" },
    },
    q1c: {
      id: "q1c",
      kind: "question",
      title: "La douleur empire-t-elle au fil de l'entraînement ?",
      subtitle: "Évolution sur la séance",
      recap: "Empire pendant l'entraînement",
      choices: [
        { label: "OUI", next: "mod1", variant: "yes" },
        { label: "NON", next: "q_post", variant: "no" },
      ],
    },
    mod1: {
      id: "mod1",
      kind: "modulation",
      title: "On baisse l'intensité, focus technique",
      subtitle: "Test in-séance",
      recap: "Baisse intensité + technique",
      bullets: [
        "Éviter l'intensité",
        "Se focus sur les gestes techniques contrôlés",
      ],
      computeBulletsKey: "sport_mod1",
      followUp: "Après ces modulations, c'est mieux ?",
      choices: [
        { label: "OUI", next: "r_finish_cool", variant: "yes" },
        { label: "NON", next: "mod2", variant: "no" },
      ],
    },
    mod2: {
      id: "mod2",
      kind: "modulation",
      title: "Arrêt de l'entraînement + ajustements futurs",
      subtitle: "Adapter les prochaines séances",
      recap: "Arrêt + ajustements futurs",
      bullets: [
        "Arrêter l'entraînement et/ou faire de la mobilité douce jusqu'à la fin de la séance, au bord du terrain",
        "Réduire la durée de l'entraînement",
        "Technique > intensité",
        "Éviter les matchs temporairement",
      ],
      computeBulletsKey: "sport_mod2",
      temporalNote: "À évaluer sur les prochaines séances",
      followUp: "Après application sur les séances suivantes, c'est mieux ?",
      choices: [
        { label: "OUI", next: "r_rebuild", variant: "yes" },
        { label: "NON", next: "r_specialist", variant: "no" },
      ],
    },
    r_finish_cool: {
      id: "r_finish_cool",
      kind: "recommendation",
      severity: "success",
      title: "Terminer l'entraînement cool",
      message:
        "Le patient peut terminer son entraînement à intensité réduite, en restant centré sur la technique.",
      cta: "Nouvelle évaluation",
    },
    r_rebuild: {
      id: "r_rebuild",
      kind: "recommendation",
      severity: "success",
      title: "Reconstruire une progression",
      message:
        "La charge ajustée est tolérée. On reconstruit une progression à partir de cette nouvelle base.",
      cta: "Nouvelle évaluation",
    },
    r_specialist: {
      id: "r_specialist",
      kind: "recommendation",
      severity: "danger",
      title: "Avis kiné spécialisé requis",
      message:
        "Il faut analyser la situation avec un kiné spécialisé pour identifier le facteur sous-jacent.",
      cta: "Nouvelle évaluation",
      relatedContent: [
        {
          title: "Approfondir : raisonnement clinique en gestion de charge",
          url: "https://fullphysio.com",
        },
      ],
    },
    ...sharedFollowUp,
  },
};

export const trees: Tree[] = [exerciceTree, courseTree, sportTree];

export const treesById: Record<string, Tree> = Object.fromEntries(
  trees.map((t) => [t.id, t]),
);
