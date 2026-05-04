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
    behavior: {
      toDo: [
        "Continuer la programmation prévue",
        "Maintenir une activité quotidienne normale",
        "Mobilité douce si raideur résiduelle",
      ],
      toAvoid: [
        "Sauter des étapes (rester sur +5-10 % par semaine maximum)",
        "Antalgique préventif",
      ],
      alertSigns: [
        "Apparition d'une douleur > 4/10 sur la prochaine séance",
        "Douleur qui ne revient pas à la baseline le lendemain",
      ],
    },
    patientScript:
      "La charge est bien tolérée. On peut maintenir la progression telle qu'elle est. Tu continues comme prévu, et si quelque chose change on adapte.",
  },
  r_too_much: {
    id: "r_too_much",
    kind: "recommendation" as const,
    severity: "warning" as const,
    title: "Charge probablement trop élevée",
    message:
      "On ajuste les prochaines séances. Tu peux aussi refaire la même séance la prochaine fois et observer la réponse.",
    cta: "Nouvelle évaluation",
    behavior: {
      toDo: [
        "Mobilité légère le soir / le lendemain",
        "Glace 15 min si chaleur locale ou gonflement discret",
        "Sommeil de qualité (récupération)",
      ],
      toAvoid: [
        "Reproduire la même charge à l'identique au prochain RDV",
        "Antalgique préventif en routine",
      ],
      alertSigns: [
        "Douleur > 24-48 h",
        "Apparition de signes nouveaux (paresthésies, gonflement net)",
      ],
      selfCare:
        "Antalgique standard ponctuel si la douleur perturbe le sommeil — pas en routine.",
    },
    patientScript:
      "On est passé un peu au-dessus du seuil aujourd'hui. C'est pas grave, ça arrive. On adapte la prochaine séance — un peu moins de charge ou de volume. Tu observes les 24-48 h. Si tu as une question, tu m'écris.",
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
      behavior: {
        toDo: [
          "Continuer la séance avec ces nouvelles modalités",
          "Hydratation",
        ],
        toAvoid: [
          "Augmenter la charge ou l'amplitude jusqu'à la prochaine séance",
        ],
        alertSigns: [
          "Douleur qui persiste > 24 h ou s'aggrave nettement le lendemain",
          "Gonflement, chaleur locale, perte de force",
        ],
        selfCare:
          "Mobilité douce si raideur. Pas d'antalgique préventif.",
      },
      patientScript:
        "Cette douleur, dans ces limites et avec ces ajustements, c'est OK. C'est ton corps qui apprend à supporter cet effort. On garde ces nouvelles modalités aujourd'hui et on observe les 24-48 h. Si demain la douleur a quasi disparu, on est sur la bonne voie.",
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
      behavior: {
        toDo: [
          "Passer à un exercice alternatif sur la même zone (chaîne / muscle)",
          "Glace 15 min si chaleur locale",
          "Activité quotidienne normale",
        ],
        toAvoid: [
          "Insister sur l'exercice qui déclenche aujourd'hui",
          "Repos complet prolongé",
        ],
        alertSigns: [
          "Apparition de paresthésies, faiblesse motrice, douleur nocturne",
          "Aggravation au repos",
        ],
      },
      patientScript:
        "L'exercice qu'on essayait là, ton corps n'est pas prêt aujourd'hui. On le met de côté, on travaille autrement la même zone. Ce n'est pas un échec, c'est un signal qu'on ajuste. Si tu doutes ou si ça empire, on en reparle avant le prochain RDV.",
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
      behavior: {
        toDo: [
          "Terminer la sortie à allure fondamentale (zone 1-2, conversation possible)",
          "Retour au calme : 5 min de marche en fin de sortie",
          "Étirements légers post-sortie",
        ],
        toAvoid: [
          "Reprendre l'allure / l'intensité initiale aujourd'hui",
          "Faire une 2ᵉ sortie dans la journée",
        ],
        alertSigns: [
          "Douleur qui réapparaît malgré l'allure réduite",
          "Boiterie ou modification du pattern de course",
        ],
      },
      patientScript:
        "On finit cette sortie tranquille. Tu vas à allure fondamentale — celle où tu peux parler facilement. Si la douleur s'estompe, super. Sinon tu t'arrêtes et on en reparle.",
    },
    r_rebuild: {
      id: "r_rebuild",
      kind: "recommendation",
      severity: "success",
      title: "Reconstruire une progression",
      message:
        "La charge ajustée est tolérée. On reconstruit une progression à partir de cette nouvelle base.",
      cta: "Nouvelle évaluation",
      behavior: {
        toDo: [
          "Reprendre l'activité à un niveau réduit (~70-80 % du précédent)",
          "Progression de +5-10 % par semaine maximum",
          "Maintenir une charge baseline régulière",
        ],
        toAvoid: [
          "Sauter directement au niveau pré-douleur",
          "Enchaîner deux séances dures consécutives",
        ],
        alertSigns: [
          "Récidive de la douleur > 4/10 dans les mêmes conditions",
          "Apparition de douleur sur une nouvelle zone",
        ],
      },
      patientScript:
        "On a une bonne base maintenant. On reconstruit progressivement la charge — un peu plus chaque semaine. Pas de précipitation. Si une douleur réapparaît dans les mêmes conditions, on adapte tout de suite.",
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
      behavior: {
        toDo: [
          "Prendre RDV avec un kiné spécialisé (ou médecin selon contexte)",
          "Limiter la sollicitation qui déclenche jusqu'au RDV",
          "Maintenir une activité quotidienne légère et indolore",
        ],
        toAvoid: [
          "Insister sur l'activité qui déclenche",
          "Auto-traitement par antalgiques au long cours",
        ],
        alertSigns: [
          "Paresthésies, faiblesse motrice, anesthésie",
          "Douleur nocturne réveillant",
          "Fièvre, sueurs nocturnes, perte de poids",
        ],
      },
      patientScript:
        "Ce que tu ressens dépasse ce qu'on peut gérer juste en ajustant la charge. Je veux qu'on regarde ça en détail avec quelqu'un de spécialisé. En attendant, on lève le pied sur ce qui déclenche, et si tu as des signes nouveaux (fourmillements, faiblesse, douleur la nuit, fièvre), tu consultes plus vite.",
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
      behavior: {
        toDo: [
          "Terminer la séance à intensité réduite, focus technique",
          "Étirements légers en fin de séance",
          "Hydratation, récupération",
        ],
        toAvoid: [
          "Sprints, contacts forts, smashs / frappes max",
          "Match dans les 24-48 h",
        ],
        alertSigns: [
          "Douleur qui s'aggrave malgré la baisse d'intensité",
          "Boiterie ou perte d'appui",
        ],
      },
      patientScript:
        "On finit la séance cool. Tu restes sur du technique, pas de sprint, pas de contact dur. Demain tu observes — si c'est pareil ou mieux, on adapte la suite. Si c'est pire, on fait le point.",
    },
    r_rebuild: {
      id: "r_rebuild",
      kind: "recommendation",
      severity: "success",
      title: "Reconstruire une progression",
      message:
        "La charge ajustée est tolérée. On reconstruit une progression à partir de cette nouvelle base.",
      cta: "Nouvelle évaluation",
      behavior: {
        toDo: [
          "Reprendre l'activité à un niveau réduit (~70-80 % du précédent)",
          "Progression de +5-10 % par semaine maximum",
          "Maintenir une charge baseline régulière",
        ],
        toAvoid: [
          "Sauter directement au niveau pré-douleur",
          "Enchaîner deux séances dures consécutives",
        ],
        alertSigns: [
          "Récidive de la douleur > 4/10 dans les mêmes conditions",
          "Apparition de douleur sur une nouvelle zone",
        ],
      },
      patientScript:
        "On a une bonne base maintenant. On reconstruit progressivement la charge — un peu plus chaque semaine. Pas de précipitation. Si une douleur réapparaît dans les mêmes conditions, on adapte tout de suite.",
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
      behavior: {
        toDo: [
          "Prendre RDV avec un kiné spécialisé (ou médecin selon contexte)",
          "Limiter la sollicitation qui déclenche jusqu'au RDV",
          "Maintenir une activité quotidienne légère et indolore",
        ],
        toAvoid: [
          "Insister sur l'activité qui déclenche",
          "Auto-traitement par antalgiques au long cours",
        ],
        alertSigns: [
          "Paresthésies, faiblesse motrice, anesthésie",
          "Douleur nocturne réveillant",
          "Fièvre, sueurs nocturnes, perte de poids",
        ],
      },
      patientScript:
        "Ce que tu ressens dépasse ce qu'on peut gérer juste en ajustant la charge. Je veux qu'on regarde ça en détail avec quelqu'un de spécialisé. En attendant, on lève le pied sur ce qui déclenche, et si tu as des signes nouveaux (fourmillements, faiblesse, douleur la nuit, fièvre), tu consultes plus vite.",
    },
    ...sharedFollowUp,
  },
};

export const interSeanceTree: Tree = {
  id: "inter_seances",
  title: "Douleur entre 2 séances",
  shortTitle: "Inter-séances",
  description:
    "Le patient signale une douleur entre deux RDV (texte, appel, à distance).",
  icon: "messageSquare",
  startId: "q_signs",
  nodes: {
    q_signs: {
      id: "q_signs",
      kind: "question",
      title: "Y a-t-il des signes nouveaux ou inhabituels ?",
      subtitle:
        "Chaleur intense / gonflement franc / paresthésies / douleur nocturne réveillant / fièvre",
      recap: "Signes inhabituels",
      choices: [
        { label: "OUI", next: "r_medical_urgent", variant: "yes" },
        { label: "NON", next: "q_eva", variant: "no" },
      ],
    },
    q_eva: {
      id: "q_eva",
      kind: "eva",
      title: "Quelle est l'intensité actuelle de la douleur ?",
      subtitle: "Échelle visuelle analogique (EVA) · seuil clé : 4/10",
      recap: "EVA",
      threshold: 4,
      minLabel: "Aucune douleur",
      maxLabel: "Douleur insupportable",
      belowOrEqual: { next: "q_trend" },
      above: { next: "q_daily" },
    },
    q_trend: {
      id: "q_trend",
      kind: "question",
      title: "La douleur s'estompe-t-elle progressivement depuis la séance ?",
      subtitle: "Évolution sur 24-48 h",
      recap: "Tendance depuis séance",
      choices: [
        { label: "OUI", next: "r_normal", variant: "no" },
        { label: "NON", next: "r_observe", variant: "yes" },
      ],
    },
    q_daily: {
      id: "q_daily",
      kind: "question",
      title: "La douleur perturbe-t-elle ton quotidien ?",
      subtitle: "Sommeil, marche, AVQ, position assise prolongée",
      recap: "Impact sur quotidien",
      choices: [
        { label: "OUI", next: "r_evaluate", variant: "yes" },
        { label: "NON", next: "r_adjust_inter", variant: "no" },
      ],
    },
    r_medical_urgent: {
      id: "r_medical_urgent",
      kind: "recommendation",
      severity: "danger",
      title: "Avis médical recommandé",
      message:
        "Les signes décrits sortent du cadre de la gestion de charge. Orienter vers un médecin pour examen — ou les urgences si l'intensité est forte.",
      cta: "Nouvelle évaluation",
      behavior: {
        toDo: [
          "Consulter un médecin rapidement (généraliste ou urgences selon intensité)",
          "Repos relatif jusqu'à l'avis médical",
        ],
        toAvoid: [
          "Insister sur l'activité qui déclenche",
          "Auto-médication prolongée",
        ],
        alertSigns: [
          "Paralysie, anesthésie en selle, douleur thoracique → urgences",
          "Fièvre élevée, signes infectieux",
        ],
      },
      patientScript:
        "Là, il y a des signes qui méritent qu'on ait un avis médical avant de continuer. Tu prends RDV avec ton médecin (ou les urgences si c'est intense). On reprendra ensemble une fois que c'est clarifié.",
    },
    r_normal: {
      id: "r_normal",
      kind: "recommendation",
      severity: "success",
      title: "Réponse normale post-séance",
      message:
        "Cette douleur, modérée et qui s'estompe, est attendue après une séance qui sollicite. Maintenir la programmation et continuer à bouger normalement.",
      cta: "Nouvelle évaluation",
      behavior: {
        toDo: [
          "Activité quotidienne normale",
          "Mobilité douce si raideur résiduelle",
          "Sommeil de qualité",
        ],
        toAvoid: [
          "Repos strict (contre-productif)",
          "Antalgique préventif",
        ],
        alertSigns: [
          "Douleur qui ré-augmente dans les 24 h",
          "Apparition de signes nouveaux (gonflement, paresthésies)",
        ],
      },
      patientScript:
        "Ce que tu ressens, c'est attendu après une séance qui demande du travail. C'est ton corps qui s'adapte. Tu continues à bouger normalement, et on en reparle au prochain RDV.",
    },
    r_observe: {
      id: "r_observe",
      kind: "recommendation",
      severity: "warning",
      title: "Surveiller sur 24-48 h",
      message:
        "La douleur ne s'estompe pas comme attendu. On lève un peu le pied, on observe, et on adapte si nécessaire avant le prochain RDV.",
      cta: "Nouvelle évaluation",
      behavior: {
        toDo: [
          "Repos relatif (activités quotidiennes OK, pas de pic de charge)",
          "Glace 15 min 2-3×/jour si chaleur locale",
          "Mobilité douce indolore",
        ],
        toAvoid: [
          "Reproduire le geste / l'effort qui a déclenché",
          "Effort de force / d'intensité dans les 48 h",
        ],
        alertSigns: [
          "Pas d'amélioration sous 48 h",
          "Aggravation, signes neuro nouveaux",
        ],
      },
      patientScript:
        "On observe sur 24-48 h. Tu lèves un peu le pied sans tomber dans le repos complet. Si demain c'est pareil ou pire, on se voit avant le RDV prévu.",
    },
    r_adjust_inter: {
      id: "r_adjust_inter",
      kind: "recommendation",
      severity: "warning",
      title: "Ajuster la prochaine séance",
      message:
        "L'intensité dépasse la zone de tolérance attendue. On adapte la prochaine séance — on observe l'évolution d'ici là.",
      cta: "Nouvelle évaluation",
      behavior: {
        toDo: [
          "Maintenir une activité quotidienne légère et indolore",
          "Glace si chaleur locale",
          "Mobilité douce, pas de stretch agressif",
        ],
        toAvoid: [
          "Effort similaire à celui qui a déclenché",
          "Antalgique préventif au long cours",
        ],
        alertSigns: [
          "Aggravation",
          "Signes neuro, douleur nocturne",
        ],
        selfCare:
          "Antalgique ponctuel si gêne pour le sommeil, pas en routine.",
      },
      patientScript:
        "Tu as une douleur un peu plus marquée que prévu. On va ajuster la prochaine séance — moins intense ou un peu plus tard. En attendant tu lèves le pied, et tu m'écris si ça change.",
    },
    r_evaluate: {
      id: "r_evaluate",
      kind: "recommendation",
      severity: "danger",
      title: "Re-évaluer en séance",
      message:
        "L'intensité et l'impact sur le quotidien justifient de se voir avant le prochain RDV prévu pour ajuster correctement.",
      cta: "Nouvelle évaluation",
      relatedContent: [
        {
          title: "Approfondir : raisonnement clinique en gestion de charge",
          url: "https://fullphysio.com",
        },
      ],
      behavior: {
        toDo: [
          "Avancer le RDV si possible",
          "Repos relatif jusqu'à la consult",
          "Glace si chaleur locale",
        ],
        toAvoid: [
          "Activité qui déclenche",
          "Auto-traitement médicamenteux prolongé",
        ],
        alertSigns: [
          "Signes neuro évolutifs, paralysie, fièvre → urgences",
          "Douleur > 7/10 persistante, nuit blanche",
        ],
      },
      patientScript:
        "Ce que tu décris, je préfère qu'on regarde ensemble pour ajuster correctement. Tu peux passer plus tôt ? D'ici là, on lève le pied et tu m'alertes si ça empire.",
    },
  },
};

export const trees: Tree[] = [
  exerciceTree,
  courseTree,
  sportTree,
  interSeanceTree,
];

export const treesById: Record<string, Tree> = Object.fromEntries(
  trees.map((t) => [t.id, t]),
);
