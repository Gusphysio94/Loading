import type {
  AnamnesisQuestion,
  ClinicalTest,
  DeepAssessmentModule,
  PathologyCandidate,
} from "../../types/deepAssessment";

/**
 * Module CHEVILLE / PIED
 *
 * Périmètre : adulte, douleur de cheville ou de pied non-traumatique récente
 * OU post-traumatique sans drapeau rouge (post-triage RF, hors fracture
 * Ottawa positive, hors rupture d'Achille suspectée, hors DVT/ischémie).
 *
 * 8 hypothèses cliniques fréquentes en accès direct kiné :
 *  - Entorse latérale de cheville aiguë (LAS)
 *  - Instabilité chronique de cheville (CAI)
 *  - Tendinopathie d'Achille (corps OU insertionnelle)
 *  - Aponévrosite plantaire
 *  - Entorse de syndesmose ("high ankle sprain")
 *  - Tendinopathie tibial postérieur (PTTD — stade I-II)
 *  - Fracture de fatigue (tibiale ou métatarsienne)
 *  - Métatarsalgie de Morton
 *
 * Sources :
 *  - Vuurberg 2018 (ESSKA-AFAS — entorse latérale CPG)
 *  - Doherty 2017 / Gribble 2014 (CAI consensus IAFOC)
 *  - Silbernagel 2020 (Achilles tendinopathy CPG, JOSPT)
 *  - Cook & Purdam 2009, Malliaras 2015 (HSR / continuum tendinopathique)
 *  - Martin 2014 / Riel 2017 / Koc 2023 (plantar heel pain CPG)
 *  - Sman 2013 (syndesmosis sprain — squeeze test)
 *  - Bowring 2010 / Gluck 2014 (PTTD staging Johnson-Strom)
 *  - Warden 2014, Patel 2011 (bone stress injuries — stress fracture)
 *  - Bencardino 2018 (Morton's neuroma diagnostic imaging)
 *  - Décary 2017 (raisonnement diagnostique kiné, accès direct)
 */

const questions: AnamnesisQuestion[] = [
  {
    id: "onset",
    category: "onset",
    prompt: "Comment la douleur a-t-elle commencé ?",
    importance: 3,
    choices: [
      { id: "trauma_acute", label: "Trauma aigu identifié (entorse, choc)" },
      {
        id: "progressive",
        label: "Progressif (semaines)",
        hint: "Surcharge / répétition",
      },
      { id: "insidious", label: "Insidieux (sans cause claire)" },
      {
        id: "post_increase_load",
        label: "Après une augmentation de charge / kilométrage",
      },
    ],
  },
  {
    id: "mechanism",
    category: "mechanism",
    prompt: "Si trauma, quel mécanisme ?",
    showIf: { questionId: "onset", valueIn: ["trauma_acute"] },
    importance: 3,
    choices: [
      {
        id: "inversion",
        label: "Inversion (cheville se tord vers l'intérieur)",
      },
      { id: "eversion", label: "Éversion (vers l'extérieur)" },
      {
        id: "external_rotation",
        label: "Rotation externe / pivot pied bloqué",
        hint: "Évoque syndesmose",
      },
      {
        id: "axial_compression",
        label: "Compression axiale / chute hauteur",
      },
      { id: "direct_blow", label: "Choc direct" },
    ],
  },
  {
    id: "swelling",
    category: "character",
    prompt: "Y a-t-il eu un gonflement ?",
    importance: 2,
    choices: [
      { id: "immediate", label: "Immédiat (< 2h)" },
      { id: "delayed", label: "Différé (12-24h)" },
      { id: "chronic_recurring", label: "Chronique / récurrent" },
      { id: "none", label: "Aucun" },
    ],
  },
  {
    id: "location",
    category: "character",
    prompt: "Localisation principale de la douleur ?",
    importance: 3,
    multi: true,
    choices: [
      {
        id: "lateral_ankle",
        label: "Latérale — sous la malléole externe",
        hint: "Trajet LFTA / LCF",
      },
      {
        id: "medial_ankle",
        label: "Médiale — sous la malléole interne / arche",
      },
      {
        id: "anterior_ankle",
        label: "Antérieure de la cheville (cou-de-pied / dôme talus)",
      },
      {
        id: "posterior_achilles_mid",
        label: "Tendon d'Achille — corps (2-6 cm au-dessus du calcanéum)",
      },
      {
        id: "posterior_achilles_insertion",
        label: "Tendon d'Achille — insertion calcanéenne",
      },
      {
        id: "plantar_heel",
        label: "Plantaire — talon (insertion fascia)",
      },
      { id: "plantar_arch", label: "Plantaire — arche médiale" },
      {
        id: "forefoot",
        label: "Avant-pied — tête métatarsienne",
      },
      {
        id: "third_web",
        label: "Avant-pied — entre 3e et 4e orteil",
        hint: "Zone Morton",
      },
      {
        id: "tibia_shin",
        label: "Tibia — face antéro-médiale",
        hint: "Zone fracture de fatigue",
      },
    ],
  },
  {
    id: "character",
    category: "character",
    prompt: "Caractère de la douleur ?",
    importance: 2,
    choices: [
      { id: "mechanical", label: "Mécanique — à l'effort" },
      {
        id: "first_steps",
        label: "Premiers pas le matin (puis amélioration)",
        hint: "Évoque aponévrosite",
      },
      {
        id: "after_running",
        label: "S'aggrave en cours de course (kilométrage)",
      },
      {
        id: "warm_up_better",
        label: "Mieux à l'échauffement, douloureux à froid",
        hint: "Tendinopathie",
      },
      { id: "burning", label: "Brûlure / décharge / paresthésies" },
      { id: "night", label: "Nocturne / au repos" },
    ],
  },
  {
    id: "aggravators",
    category: "modifiers",
    prompt: "Qu'est-ce qui aggrave ?",
    importance: 3,
    multi: true,
    choices: [
      { id: "running", label: "Course (impacts répétés)" },
      {
        id: "running_distance",
        label: "Course après un certain kilométrage",
      },
      { id: "first_steps_morning", label: "Premiers pas du matin" },
      { id: "stairs", label: "Escaliers" },
      { id: "jumping", label: "Sauts / réceptions" },
      { id: "uneven_ground", label: "Terrain accidenté / dévers" },
      { id: "narrow_shoes", label: "Chaussures étroites / talons" },
      {
        id: "prolonged_standing",
        label: "Station debout prolongée",
      },
      {
        id: "walking_barefoot",
        label: "Marche pieds nus / surfaces dures",
      },
      { id: "calf_raise", label: "Montée sur la pointe des pieds" },
    ],
  },
  {
    id: "weight_bearing",
    category: "modifiers",
    prompt: "Mise en charge possible ?",
    importance: 2,
    choices: [
      { id: "full_weight", label: "Charge complète possible" },
      {
        id: "limited_weight",
        label: "Charge possible mais limitée par douleur",
      },
      { id: "very_limited", label: "Très limitée, antalgique" },
    ],
  },
  {
    id: "instability",
    category: "modifiers",
    prompt: "Instabilité / dérobements ?",
    importance: 2,
    choices: [
      { id: "no_instability", label: "Stable" },
      { id: "occasional_giveway", label: "Dérobements occasionnels" },
      {
        id: "recurrent_giveway",
        label: "Dérobements fréquents / récurrents",
      },
      {
        id: "fear_movement",
        label: "Sensation d'instabilité sans dérobement franc",
      },
    ],
  },
  {
    id: "activity_profile",
    category: "history",
    prompt: "Profil d'activité ?",
    importance: 2,
    choices: [
      { id: "sedentary", label: "Sédentaire" },
      { id: "leisure", label: "Sportif loisir" },
      { id: "runner", label: "Coureur (route / trail)" },
      {
        id: "court_sport",
        label: "Sport pivot/court (basket, foot, hand, volley)",
      },
      { id: "jump_sport", label: "Sport explosif / sauts" },
      {
        id: "walker",
        label: "Marcheur (randonnée / métier debout)",
      },
    ],
  },
  {
    id: "demographics",
    category: "history",
    prompt: "Profil démographique ?",
    importance: 2,
    multi: true,
    choices: [
      { id: "age_under30", label: "Adulte jeune (< 30 ans)" },
      { id: "age_30_50", label: "30-50 ans" },
      { id: "age_over50", label: "> 50 ans" },
      { id: "female", label: "Femme" },
      { id: "overweight", label: "IMC > 25" },
      {
        id: "diabetic",
        label: "Diabète / autre comorbidité métabolique",
      },
    ],
  },
  {
    id: "foot_arch",
    category: "history",
    prompt: "Architecture du pied (à l'œil ou rapporté) ?",
    importance: 1,
    choices: [
      { id: "flat", label: "Plat (affaissement médial)" },
      { id: "high_arch", label: "Creux (arche haute)" },
      { id: "neutral", label: "Neutre / inconnu" },
    ],
  },
  {
    id: "load_change",
    category: "history",
    prompt: "Changement récent de charge ou d'équipement ?",
    importance: 1,
    multi: true,
    choices: [
      {
        id: "increase_volume",
        label: "Augmentation rapide du volume / kilométrage",
      },
      { id: "new_shoes", label: "Changement récent de chaussures" },
      {
        id: "new_terrain",
        label: "Changement de terrain (route → trail, etc.)",
      },
      { id: "return_after_pause", label: "Reprise après pause" },
      { id: "no_change", label: "Pas de changement" },
    ],
  },
  {
    id: "duration",
    category: "history",
    prompt: "Durée d'évolution ?",
    importance: 1,
    choices: [
      { id: "lt2w", label: "< 2 semaines (aigu)" },
      { id: "2_6w", label: "2-6 semaines" },
      { id: "6_12w", label: "6-12 semaines (subaigu)" },
      { id: "gt12w", label: "> 12 semaines (chronique)" },
      { id: "recurring", label: "Récidive (épisode connu)" },
    ],
  },
  {
    id: "history_ankle",
    category: "history",
    prompt: "ATCD pertinents ?",
    importance: 1,
    multi: true,
    choices: [
      {
        id: "previous_sprain",
        label: "Au moins 1 entorse de cheville antérieure",
      },
      {
        id: "multiple_sprains",
        label: "Plusieurs entorses (≥ 2-3)",
      },
      {
        id: "fracture_history",
        label: "Fracture cheville / pied antérieure",
      },
      { id: "achilles_history", label: "Tendinopathie d'Achille connue" },
      { id: "plantar_history", label: "Aponévrosite plantaire connue" },
      { id: "no_history", label: "Pas d'ATCD significatif" },
    ],
  },
];

const tests: ClinicalTest[] = [
  {
    id: "anterior_drawer",
    name: "Tiroir antérieur de la cheville",
    procedure:
      "Patient assis, cheville à 10° de flexion plantaire. Stabiliser le tibia ; tracter le calcanéum vers l'avant.",
    positiveMeans:
      "Translation antérieure excessive avec arrêt mou — évoque une lésion du LFTA.",
    diagnosticAccuracy:
      "Sn ≈ 75% · Sp ≈ 75% (Vuurberg 2018) — meilleure précision 4-5 jours après le trauma.",
  },
  {
    id: "talar_tilt",
    name: "Talar tilt (varus forcé)",
    procedure:
      "Cheville en position neutre. Stress en inversion, comparer au côté sain.",
    positiveMeans:
      "Bâillement latéral excessif — suggère lésion combinée LFTA + LCF.",
  },
  {
    id: "syndesmosis_squeeze",
    name: "Squeeze test (syndesmose)",
    procedure:
      "Compression du tibia et du péroné à mi-mollet, à distance de la cheville.",
    positiveMeans:
      "Reproduction de la douleur à la cheville — évoque une lésion de syndesmose.",
    diagnosticAccuracy:
      "Sp ≈ 88% · Sn modérée (Sman 2013) — combiner avec Kleiger.",
  },
  {
    id: "kleiger_external_rotation",
    name: "Kleiger / Test rotation externe",
    procedure:
      "Patient assis, genou à 90°. Stabiliser le tibia, faire rotation externe du pied.",
    positiveMeans:
      "Douleur sur la syndesmose / ligaments latéraux — lésion syndesmotique probable.",
  },
  {
    id: "achilles_palpation_mid",
    name: "Palpation tendon d'Achille — corps",
    procedure:
      "Palper le corps du tendon (2-6 cm au-dessus du calcanéum), pincement transverse.",
    positiveMeans:
      "Douleur localisée + parfois épaississement — tendinopathie corporéale d'Achille.",
  },
  {
    id: "achilles_palpation_insertion",
    name: "Palpation tendon d'Achille — insertion",
    procedure: "Palper l'insertion calcanéenne et la zone rétro-calcanéenne.",
    positiveMeans:
      "Douleur localisée à l'insertion — tendinopathie insertionnelle.",
  },
  {
    id: "single_heel_raise",
    name: "Single leg heel raise",
    procedure:
      "Patient debout sur une jambe, monter sur la pointe du pied. Observer hauteur, qualité, douleur, capacité à répéter.",
    positiveMeans:
      "Douleur reproduite ou faiblesse / amplitude réduite — évoque tendinopathie d'Achille (corps) OU dysfonction du tibial postérieur (PTTD).",
  },
  {
    id: "windlass",
    name: "Windlass test",
    procedure:
      "Patient assis ou en charge. Dorsiflexion passive de l'hallux, pied au sol ou en suspension.",
    positiveMeans:
      "Reproduction de la douleur plantaire — évoque aponévrosite plantaire.",
    diagnosticAccuracy: "Sp élevée mais Sn modeste (Martin 2014).",
  },
  {
    id: "mulder_click",
    name: "Mulder click test",
    procedure:
      "Compression latérale + médiale de l'avant-pied avec pression dorso-plantaire entre les têtes métatarsiennes.",
    positiveMeans:
      "Cliquement reproductible + douleur entre les têtes métatarsiennes — évoque névrome de Morton.",
  },
  {
    id: "tibial_palpation",
    name: "Palpation tibia + percussion / fulcrum test",
    procedure:
      "Palpation point par point sur la face antéro-médiale du tibia ; percussion à distance ou fulcrum.",
    positiveMeans:
      "Point douloureux focal sur l'os, percussion à distance reproduit la douleur — évoque une fracture de fatigue.",
  },
];

const pathologies: PathologyCandidate[] = [
  {
    id: "lateral_ankle_sprain",
    name: "Entorse latérale de cheville (aiguë)",
    shortName: "Entorse latérale",
    prevalence: "common",
    summary:
      "Lésion ligamentaire latérale (LFTA ± LCF) sur mécanisme d'inversion. Pathologie MSK la plus fréquente en accès direct. La plupart des cas se gèrent en kiné avec un retour fonctionnel structuré (ESSKA-AFAS 2018).",
    hallmarks: [
      "Mécanisme inversion identifié",
      "Douleur latérale + œdème pré- et sub-malléolaire externe",
      "Mise en charge initialement difficile, qui s'améliore",
      "Tiroir antérieur ± Talar tilt positifs (à 4-5 j)",
    ],
    questionSignatures: {
      onset: { trauma_acute: 3, progressive: -2, insidious: -2 },
      mechanism: {
        inversion: 3,
        external_rotation: -1,
        eversion: -1,
        axial_compression: 0,
        direct_blow: 1,
      },
      swelling: { immediate: 2, delayed: 2, none: -1, chronic_recurring: 0 },
      location: {
        lateral_ankle: 3,
        medial_ankle: -1,
        anterior_ankle: 0,
        posterior_achilles_mid: -2,
        posterior_achilles_insertion: -2,
        plantar_heel: -2,
        forefoot: -2,
        third_web: -2,
        tibia_shin: -2,
      },
      character: { mechanical: 1 },
      weight_bearing: {
        limited_weight: 2,
        very_limited: 1,
        full_weight: 0,
      },
      instability: {
        no_instability: 0,
        occasional_giveway: 1,
        recurrent_giveway: -1,
      },
      activity_profile: { court_sport: 1, jump_sport: 1, runner: 0 },
      duration: { lt2w: 2, "2_6w": 1, gt12w: -2 },
      history_ankle: {
        previous_sprain: 1,
        multiple_sprains: 0,
        no_history: 0,
      },
    },
    testSignatures: {
      anterior_drawer: { positive: 3, negative: -1 },
      talar_tilt: { positive: 2 },
      syndesmosis_squeeze: { positive: -1 },
      kleiger_external_rotation: { positive: -1 },
    },
    management: {
      conservative: [
        "Phase aiguë (J0-J5) : protection (taping/orthèse), charge selon douleur, glace, élévation, mobilité précoce dès tolérance",
        "Récupération de la dorsiflexion (mobilisations talocrurales)",
        "Renforcement péroniers + intrinsèques + chaîne postérieure",
        "Travail proprioceptif progressif (statique → dynamique → sport-spécifique)",
        "Critères de retour au sport : symétrie de force, hop tests, confiance — pas seulement absence de douleur",
      ],
      followUp:
        "Réévaluation à 1-2 semaines puis 4-6 semaines. Programme de prévention secondaire systématique (Vuurberg 2018) — risque de récidive 70% à 1 an si non rééduqué.",
      imaging: {
        modality: "Aucune imagerie de routine",
        urgency: "rare",
        rationale:
          "Si Ottawa Ankle Rules positives → radio (déjà screené au triage). IRM réservée aux échecs > 6 sem ou suspicion de lésion ostéochondrale (OCD du dôme talien).",
      },
    },
    patientScript:
      "« D'après ce que je vois, vous avez fait une entorse latérale de cheville — la blessure la plus fréquente en kiné, qui se gère très bien avec un programme structuré. On va remettre la cheville en mouvement rapidement, récupérer la force et l'équilibre, et préparer le retour à vos activités. Les 70% de récidive après une entorse non rééduquée descendent fortement avec une prise en charge bien menée. »",
  },
  {
    id: "chronic_ankle_instability",
    name: "Instabilité chronique de cheville (CAI)",
    shortName: "CAI",
    prevalence: "common",
    summary:
      "Tableau post-entorse mal réhabilitée : dérobements répétés, sensation d'instabilité, parfois douleur résiduelle. Définition consensus IAFOC (Gribble 2014) : ≥ 1 dérobement, sensation d'instabilité, ≥ 2 entorses, > 12 mois.",
    hallmarks: [
      "ATCD d'entorses multiples mal rééduquées",
      "Dérobements / sensation d'instabilité fonctionnelle",
      "Évolution > 12 mois",
      "Tiroir antérieur ± Talar tilt positifs",
    ],
    questionSignatures: {
      onset: { insidious: 1, trauma_acute: -1, progressive: 1 },
      instability: {
        recurrent_giveway: 3,
        occasional_giveway: 2,
        fear_movement: 2,
        no_instability: -3,
      },
      location: { lateral_ankle: 2, medial_ankle: -1 },
      duration: { gt12w: 2, recurring: 2, lt2w: -2 },
      history_ankle: {
        multiple_sprains: 3,
        previous_sprain: 1,
        no_history: -2,
      },
      activity_profile: { court_sport: 1, jump_sport: 1, runner: 0 },
    },
    testSignatures: {
      anterior_drawer: { positive: 2 },
      talar_tilt: { positive: 1 },
    },
    management: {
      conservative: [
        "Programme de réhabilitation neuromusculaire 6-12 semaines (Doherty 2017) : balance, perturbation, sport-spécifique",
        "Renforcement péroniers + chaîne stabilisatrice",
        "Mobilisation talocrurale (souvent restriction de dorsiflexion)",
        "Réintégration sportive progressive avec critères de force / hop tests",
      ],
      referral:
        "Si échec d'un programme bien conduit ≥ 12 sem ou laxité importante → avis chir ortho (reconstruction Broström-Gould à discuter).",
      imaging: {
        modality: "IRM (rare)",
        urgency: "rare",
        rationale:
          "À envisager seulement avant décision chirurgicale ou si suspicion de lésion ostéochondrale du dôme talien associée.",
      },
      followUp: "Réévaluation à 6 et 12 semaines.",
    },
  },
  {
    id: "achilles_tendinopathy",
    name: "Tendinopathie d'Achille (corps OU insertion)",
    shortName: "Tendinopathie d'Achille",
    prevalence: "common",
    summary:
      "Tendinopathie continuum (Cook & Purdam 2009) du tendon d'Achille — corps moyen (mid-portion) plus fréquent chez le coureur, insertionnelle plus fréquente chez l'adulte sédentaire ou en surpoids. Réponse forte à la prise en charge active progressive (Silbernagel 2020).",
    hallmarks: [
      "Apparition progressive sur surcharge",
      "Douleur localisée corps OU insertion d'Achille",
      "Raideur + douleur premiers pas matin (puis amélioration)",
      "Mieux à l'échauffement, douloureux à froid",
      "Single leg heel raise reproduit / faiblesse",
    ],
    questionSignatures: {
      onset: {
        progressive: 3,
        post_increase_load: 2,
        insidious: 1,
        trauma_acute: -2,
      },
      location: {
        posterior_achilles_mid: 3,
        posterior_achilles_insertion: 3,
        lateral_ankle: -2,
        medial_ankle: -2,
        plantar_heel: -1,
      },
      character: {
        warm_up_better: 2,
        first_steps: 2,
        mechanical: 1,
        burning: -2,
      },
      aggravators: {
        running: 2,
        running_distance: 2,
        calf_raise: 3,
        jumping: 2,
        stairs: 1,
        first_steps_morning: 2,
      },
      activity_profile: {
        runner: 2,
        jump_sport: 1,
        court_sport: 1,
        leisure: 0,
      },
      demographics: { age_30_50: 1, age_over50: 1, overweight: 1 },
      load_change: {
        increase_volume: 2,
        new_shoes: 1,
        new_terrain: 1,
        return_after_pause: 1,
      },
      duration: { "2_6w": 1, "6_12w": 1, gt12w: 1 },
      history_ankle: { achilles_history: 2 },
    },
    testSignatures: {
      achilles_palpation_mid: { positive: 3 },
      achilles_palpation_insertion: { positive: 3 },
      single_heel_raise: { positive: 2 },
      windlass: { positive: -1 },
      anterior_drawer: { positive: -1 },
    },
    management: {
      conservative: [
        "Réduire (sans arrêter) les pics de charge tendineuse — adapter le volume de course / sauts",
        "Phase irritable : isométriques (5 × 45 s, 70% MVC) à coude tolérable",
        "Progression vers HSR (Heavy Slow Resistance) ou Alfredson excentrique sur 12 sem (Silbernagel 2020 — équivalence HSR vs excentrique)",
        "Variante INSERTIONNELLE : éviter la dorsiflexion forcée (heel-drop hors marche) — travailler dans une amplitude tolérée",
        "Critères de progression : douleur ≤ 3-5/10 pendant et < 24h après (échelle Silbernagel)",
        "Reprise course/saut graduée (10% / semaine)",
      ],
      followUp:
        "Réévaluation à 6 semaines. Pathologie qui demande 3-6 mois de patience.",
      imaging: {
        modality: "Échographie (si doute)",
        urgency: "rare",
        rationale:
          "Diagnostic essentiellement clinique. L'écho confirme la tendinopathie / écarte une rupture partielle, mais ne change pas la PEC initiale.",
      },
    },
    patientScript:
      "« Le tableau évoque une tendinopathie d'Achille — l'une des pathologies les mieux étudiées en kiné. Pas d'arrêt total : on adapte la charge et on reconstruit progressivement la résistance du tendon avec un programme de force. Comptez 3 à 6 mois pour une récupération solide, mais les résultats sont au rendez-vous quand on s'y tient. »",
  },
  {
    id: "plantar_fasciitis",
    name: "Aponévrosite plantaire (plantar heel pain)",
    shortName: "Aponévrosite plantaire",
    prevalence: "common",
    summary:
      "Douleur plantaire du talon liée à un trouble du fascia plantaire — l'une des causes les plus fréquentes de douleur du pied chez l'adulte (1/10). Réponse forte aux exercices d'étirement / renforcement et à la gestion de charge (Riel 2017, Koc 2023).",
    hallmarks: [
      "Douleur plantaire localisée à l'insertion calcanéenne médiale",
      "Premiers pas du matin très douloureux, amélioration progressive",
      "Aggravation en station debout prolongée / marche pieds nus",
      "Windlass test positif",
      "Souvent IMC > 25 ou changement récent d'activité",
    ],
    questionSignatures: {
      onset: {
        insidious: 2,
        progressive: 2,
        post_increase_load: 2,
        trauma_acute: -2,
      },
      location: {
        plantar_heel: 3,
        plantar_arch: 1,
        posterior_achilles_insertion: 0,
        lateral_ankle: -2,
        anterior_ankle: -2,
      },
      character: {
        first_steps: 3,
        mechanical: 1,
        warm_up_better: 1,
      },
      aggravators: {
        first_steps_morning: 3,
        prolonged_standing: 2,
        walking_barefoot: 2,
        running: 1,
      },
      demographics: {
        age_30_50: 1,
        age_over50: 1,
        overweight: 2,
        female: 1,
      },
      activity_profile: { runner: 1, walker: 1, sedentary: 0 },
      foot_arch: { flat: 1, high_arch: 1, neutral: 0 },
      duration: { "2_6w": 1, "6_12w": 1, gt12w: 1 },
      history_ankle: { plantar_history: 2 },
    },
    testSignatures: {
      windlass: { positive: 3 },
      achilles_palpation_mid: { positive: -1 },
      anterior_drawer: { positive: -2 },
    },
    management: {
      conservative: [
        "Étirements gastrocnémiens + soléaire + fascia plantaire 3×/jour",
        "Plantar-specific high-load strengthening (Rathleff 2015) : montée talon avec serviette sous orteils, 12 sem",
        "Gestion de charge : adapter le volume de marche / course transitoirement, semelle avec soutien d'arche / talonnette si symptômes ++",
        "Éducation : pathologie qui demande 6-12 mois pour 80% de résolution, pronostic favorable",
      ],
      followUp:
        "Réévaluation à 6 semaines. Si plateau à 12 semaines, discuter ESWT ou injection (orientation MG / spé).",
      imaging: {
        modality: "Aucune imagerie de routine",
        urgency: "rare",
        rationale:
          "Diagnostic clinique. Échographie ou IRM seulement en cas d'atypie ou d'échec > 6 mois (recherche de rupture partielle, fasciopathie chronique, fracture de fatigue calcanéenne).",
      },
    },
    patientScript:
      "« Ce que vous décrivez évoque très fortement une aponévrosite plantaire — fréquent et bénin, mais qui demande de la patience. On va combiner étirements quotidiens et renforcement progressif du pied. La majorité des patients vont mieux à 3-6 mois, et 80% sont rétablis à 1 an. Pas besoin d'imagerie d'emblée. »",
  },
  {
    id: "syndesmosis_sprain",
    name: "Entorse de syndesmose (high ankle sprain)",
    shortName: "Syndesmose",
    prevalence: "moderate",
    summary:
      "Lésion du complexe syndesmotique tibio-péronier inférieur, sur mécanisme de rotation externe ou dorsiflexion forcée. Récupération plus longue que l'entorse latérale (souvent 6-12 sem).",
    hallmarks: [
      "Mécanisme rotation externe / pivot pied bloqué",
      "Douleur antéro-latérale juste au-dessus de la cheville",
      "Mise en charge difficile",
      "Squeeze test + Kleiger positifs",
    ],
    questionSignatures: {
      onset: { trauma_acute: 3, progressive: -2 },
      mechanism: {
        external_rotation: 3,
        inversion: -1,
        eversion: 1,
        axial_compression: 1,
        direct_blow: 0,
      },
      location: {
        anterior_ankle: 2,
        lateral_ankle: 1,
        medial_ankle: 1,
      },
      swelling: { immediate: 1, delayed: 1, none: -1 },
      weight_bearing: {
        limited_weight: 2,
        very_limited: 2,
        full_weight: -1,
      },
      activity_profile: {
        court_sport: 2,
        jump_sport: 1,
        runner: 0,
      },
      duration: { lt2w: 2, "2_6w": 1, gt12w: -1 },
    },
    testSignatures: {
      syndesmosis_squeeze: { positive: 3, negative: -1 },
      kleiger_external_rotation: { positive: 3 },
      anterior_drawer: { positive: 0 },
      talar_tilt: { positive: 0 },
    },
    management: {
      conservative: [
        "Phase aiguë : protection (botte ou orthèse rigide selon stabilité), charge selon douleur",
        "Récupération de dorsiflexion progressive (sans douleur)",
        "Renforcement chaîne postérieure + péroniers + tibial postérieur",
        "Réintégration sportive prudente — durée typique 2× plus longue qu'une entorse latérale (6-12 sem grade I-II)",
      ],
      referral:
        "Avis chir si lésion grade III (diastasis) ou suspicion de fracture de Maisonneuve associée.",
      imaging: {
        modality: "Radiographie tibia + cheville (en charge si possible)",
        urgency: "soonish",
        rationale:
          "Recherche de diastasis tibio-péronier et fracture associée (Maisonneuve). IRM si suspicion clinique forte avec radio normale.",
      },
      followUp: "Réévaluation à 2-3 semaines puis toutes les 3-4 semaines.",
    },
  },
  {
    id: "ptt_dysfunction",
    name: "Dysfonction du tibial postérieur (PTTD)",
    shortName: "PTTD",
    prevalence: "moderate",
    summary:
      "Tendinopathie / insuffisance du tibial postérieur, fréquente chez la femme > 40 ans, en surpoids, avec affaissement progressif de l'arche médiale. Stadification Johnson-Strom (stade I-IV) — la kiné est efficace en stade I-II.",
    hallmarks: [
      "Douleur médiale rétro-malléolaire / arche médiale",
      "Femme > 40 ans, IMC élevé fréquent",
      "Pied plat acquis progressif",
      "Single leg heel raise faible / douloureux",
    ],
    questionSignatures: {
      onset: {
        insidious: 2,
        progressive: 2,
        trauma_acute: -2,
      },
      location: {
        medial_ankle: 3,
        plantar_arch: 2,
        lateral_ankle: -2,
        anterior_ankle: -1,
      },
      character: { mechanical: 2, after_running: 1 },
      aggravators: {
        prolonged_standing: 2,
        running: 1,
        calf_raise: 2,
        stairs: 1,
      },
      demographics: {
        female: 2,
        age_over50: 2,
        age_30_50: 1,
        overweight: 2,
        diabetic: 1,
      },
      foot_arch: { flat: 3, neutral: 0, high_arch: -2 },
      duration: { gt12w: 2, "6_12w": 1, recurring: 1 },
    },
    testSignatures: {
      single_heel_raise: { positive: 3 },
      achilles_palpation_mid: { positive: -1 },
      windlass: { positive: 0 },
    },
    management: {
      conservative: [
        "Renforcement progressif du tibial postérieur (élévations talon en inversion, contre-résistance)",
        "Renforcement intrinsèques + péroniers (équilibre tendineux médio-latéral)",
        "Soutien orthotique avec coin médial (notamment stade II) — discussion semelles posturologue / podologue",
        "Gestion de charge : limiter station debout prolongée, marche en charge progressive",
      ],
      referral:
        "Avis chir orthopédique si stade III-IV (déformation rigide, échec conservateur ≥ 6 mois).",
      imaging: {
        modality: "IRM ou échographie",
        urgency: "rare",
        rationale:
          "À envisager si suspicion de rupture tendineuse ou avant décision chirurgicale (staging précis).",
      },
      followUp: "Réévaluation à 6-8 semaines.",
    },
  },
  {
    id: "stress_fracture",
    name: "Fracture de fatigue (tibiale ou métatarsienne)",
    shortName: "Fracture de fatigue",
    prevalence: "moderate",
    summary:
      "Lésion osseuse de surcharge (bone stress injury, Warden 2014), classiquement chez le coureur ou militaire après augmentation rapide du volume. Diagnostic ESSENTIELLEMENT à éliminer face à toute douleur progressive d'effort persistante chez le sportif d'endurance.",
    hallmarks: [
      "Augmentation récente du volume / kilométrage",
      "Coureur, militaire, danseur, athlète d'endurance",
      "Douleur osseuse focale qui s'aggrave en charge",
      "Douleur nocturne ou de repos possible",
      "Palpation osseuse focale + percussion à distance reproduisant",
    ],
    questionSignatures: {
      onset: {
        progressive: 2,
        post_increase_load: 3,
        insidious: 1,
        trauma_acute: -2,
      },
      location: {
        tibia_shin: 3,
        forefoot: 2,
        anterior_ankle: 0,
        medial_ankle: 1,
      },
      character: { mechanical: 1, night: 2, burning: -1 },
      aggravators: {
        running: 3,
        running_distance: 1,
        jumping: 2,
        prolonged_standing: 1,
      },
      activity_profile: {
        runner: 3,
        jump_sport: 1,
        walker: 0,
        sedentary: -1,
      },
      demographics: { female: 1, age_under30: 1 },
      load_change: {
        increase_volume: 3,
        new_shoes: 1,
        new_terrain: 1,
        return_after_pause: 2,
      },
      duration: { "2_6w": 1, "6_12w": 1, lt2w: 0 },
    },
    testSignatures: {
      tibial_palpation: { positive: 3, negative: -1 },
      windlass: { positive: -1 },
      anterior_drawer: { positive: -2 },
    },
    management: {
      conservative: [
        "Décharge / réduction de charge IMMÉDIATE — arrêt des activités à impact",
        "Maintien cardio sans impact (vélo, natation, aquajogging) si non douloureux",
        "Évaluation des facteurs contributifs : volume d'entraînement, statut nutritionnel (RED-S), densité osseuse, cycle menstruel",
        "Reprise progressive en course après 4-8 sem selon localisation et résolution clinique",
      ],
      referral:
        "Avis MG pour bilan systémique (RED-S, vitamine D, densité osseuse), surtout si récidives. Avis chir si fracture à haut risque (sésamoïde, naviculaire, base du 5e méta diaphyse, col fémoral).",
      imaging: {
        modality: "IRM (gold standard)",
        urgency: "soonish",
        rationale:
          "Radiographie souvent NORMALE en phase précoce (jusqu'à 3 sem). IRM = examen de choix pour confirmer une bone stress injury et grader (Fredericson). Scintigraphie ou TDM en seconde intention.",
      },
      followUp: "Suivi à 4-6 semaines avec adaptation de charge.",
    },
    patientScript:
      "« Le tableau ressemble à une fracture de fatigue — une lésion osseuse liée à une surcharge, qui demande une mise au repos des activités à impact. La radio peut être normale en début, donc on demandera plutôt une IRM si on a besoin de confirmer. La bonne nouvelle : avec une décharge bien menée, la récupération est complète en 6 à 12 semaines. »",
  },
  {
    id: "morton_neuroma",
    name: "Métatarsalgie de Morton",
    shortName: "Morton",
    prevalence: "moderate",
    summary:
      "Compression / fibrose du nerf interdigital (3e espace > 2e espace) provoquant des douleurs en éclair, brûlures et paresthésies de l'avant-pied, classiquement chez la femme adulte portant des chaussures étroites.",
    hallmarks: [
      "Douleur entre 3e et 4e orteil, brûlure / décharge",
      "Aggravation par chaussures étroites / talons",
      "Soulagement immédiat à la décharge / pieds nus",
      "Mulder click positif",
    ],
    questionSignatures: {
      onset: { insidious: 2, progressive: 2, trauma_acute: -2 },
      location: {
        third_web: 3,
        forefoot: 2,
        plantar_heel: -2,
        lateral_ankle: -2,
      },
      character: {
        burning: 3,
        mechanical: 1,
        first_steps: -1,
        warm_up_better: -1,
      },
      aggravators: {
        narrow_shoes: 3,
        prolonged_standing: 1,
        walking_barefoot: -1,
        running: 1,
      },
      demographics: { female: 2, age_30_50: 1, age_over50: 1 },
      foot_arch: { high_arch: 1, neutral: 0, flat: 0 },
    },
    testSignatures: {
      mulder_click: { positive: 3, negative: -1 },
      windlass: { positive: -1 },
    },
    management: {
      conservative: [
        "Modification des chaussures : éviter étroitesse + talons, privilégier toe-box large",
        "Insertion d'une barre rétro-capitale (métatarsal pad) — soulage en redistribuant la charge",
        "Mobilité + renforcement intrinsèques du pied",
        "Éducation : pathologie chronique mais souvent contrôlable par adaptation",
      ],
      referral:
        "Avis spécialisé (rhumato/podologue/chir) si échec à 3-6 mois — discussion infiltration cortisone ou ablation chirurgicale.",
      imaging: {
        modality: "Échographie (si doute)",
        urgency: "rare",
        rationale:
          "Diagnostic clinique. Échographie peut confirmer la masse (≥ 5 mm) si décision thérapeutique difficile (Bencardino 2018).",
      },
      followUp: "Réévaluation à 6 semaines.",
    },
  },
];

export const ankleModule: DeepAssessmentModule = {
  zone: "ankle_foot",
  title: "Évaluation approfondie — cheville / pied",
  scope:
    "Adulte, douleur de cheville ou de pied non-traumatique récente OU post-traumatique sans drapeau rouge. Couvre 8 hypothèses cliniques fréquentes en accès direct kiné.",
  questions,
  tests,
  pathologies,
};
