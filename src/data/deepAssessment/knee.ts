import type {
  AnamnesisQuestion,
  ClinicalTest,
  DeepAssessmentModule,
  PathologyCandidate,
} from "../../types/deepAssessment";

/**
 * Module GENOU — pilote de l'évaluation approfondie.
 *
 * Périmètre : adulte, douleur de genou non traumatique récente OU
 * post-traumatique sans drapeau rouge (post-triage RF).
 *
 * Pathologies candidates couvertes (8) :
 *  - Lésion LCA
 *  - Lésion méniscale
 *  - Patellofemoral pain (PFP)
 *  - Tendinopathie rotulienne (jumper's knee)
 *  - Tendinopathie quadricipitale
 *  - Lésion ligament collatéral médial (LCM)
 *  - Arthrose fémoro-tibiale
 *  - Syndrome bandelette ilio-tibiale (TFL)
 *
 * Sources :
 *  - Décary 2017 (clinical reasoning physio)
 *  - Cook 2018 (orthopedic physical examination)
 *  - Stiell 1996 (Ottawa Knee Rules — déjà gérés au triage RF)
 *  - NICE NG226 (knee replacement) / NICE CKS knee pain
 *  - Cook & Purdam 2009, Malliaras 2015 (tendinopathies)
 *  - Lankhorst 2013 (PFP)
 *  - Crossley 2016 (PFP consensus)
 *  - Beals 2017 (meniscus tests cluster)
 *  - Décary 2017 (kiné direct access knee)
 */

const questions: AnamnesisQuestion[] = [
  {
    id: "onset",
    category: "onset",
    prompt: "Comment la douleur a-t-elle commencé ?",
    importance: 3,
    choices: [
      { id: "trauma_acute", label: "Traumatisme aigu identifié" },
      { id: "progressive", label: "Progressif (semaines)", hint: "Surcharge / répétition" },
      { id: "insidious", label: "Insidieux (sans cause claire)" },
      { id: "post_immobilization", label: "Après une période d'inactivité / immobilisation" },
    ],
  },
  {
    id: "mechanism",
    category: "mechanism",
    prompt: "Si traumatisme, quel mécanisme ?",
    importance: 3,
    showIf: { questionId: "onset", valueIn: ["trauma_acute"] },
    choices: [
      { id: "pivot_planted", label: "Pivot avec pied au sol", hint: "Tournant brusque" },
      { id: "valgus", label: "Choc en valgus (force latérale)" },
      { id: "varus", label: "Choc en varus (force médiale)" },
      { id: "hyperextension", label: "Hyperextension forcée" },
      { id: "direct_blow", label: "Choc direct (chute, coup)" },
      { id: "jump_landing", label: "Réception de saut" },
      { id: "rotation_load", label: "Rotation en charge sans pivot violent", hint: "Squat profond, accroupi" },
    ],
  },
  {
    id: "popping",
    category: "mechanism",
    prompt: "Sensation au moment de la blessure ?",
    importance: 2,
    showIf: { questionId: "onset", valueIn: ["trauma_acute"] },
    choices: [
      { id: "pop_crack", label: "Craquement audible / sensation de claquement" },
      { id: "shift", label: "Sensation que le genou « part » / déboîte" },
      { id: "tear", label: "Sensation de déchirure" },
      { id: "none_special", label: "Rien de particulier" },
    ],
  },
  {
    id: "swelling",
    category: "character",
    prompt: "Y a-t-il eu un gonflement ?",
    importance: 2,
    choices: [
      { id: "immediate", label: "Immédiat (< 2h)", hint: "Évoque hémarthrose" },
      { id: "delayed", label: "Différé (12-24h)" },
      { id: "chronic_recurring", label: "Chronique / récurrent" },
      { id: "none", label: "Aucun gonflement" },
    ],
  },
  {
    id: "location",
    category: "character",
    prompt: "Où la douleur se localise-t-elle principalement ?",
    importance: 3,
    multi: true,
    choices: [
      { id: "ant_patella", label: "Antérieure — sur la rotule" },
      { id: "ant_inf", label: "Antérieure — sous la rotule (tendon rotulien)" },
      { id: "ant_sup", label: "Antérieure — au-dessus de la rotule (tendon quadricipital)" },
      { id: "medial", label: "Médiale (intérieur)" },
      { id: "lateral", label: "Latérale (extérieur)" },
      { id: "posterior", label: "Postérieure (creux poplité)" },
      { id: "diffuse", label: "Diffuse / mal localisée" },
    ],
  },
  {
    id: "character",
    category: "character",
    prompt: "Quel est le caractère de la douleur ?",
    importance: 1,
    choices: [
      { id: "mechanical", label: "Mécanique — à l'effort, soulagée au repos" },
      { id: "mechanical_giving", label: "Mécanique avec dérobements" },
      { id: "morning_stiff", label: "Raideur matinale courte (< 30 min) puis mécanique" },
      { id: "morning_stiff_long", label: "Raideur matinale longue (> 30 min)", hint: "Évoque inflammatoire" },
      { id: "burning", label: "Brûlure / décharge / paresthésies" },
      { id: "dull_ache", label: "Sourde, vague" },
    ],
  },
  {
    id: "aggravators",
    category: "modifiers",
    prompt: "Qu'est-ce qui aggrave la douleur ?",
    importance: 3,
    multi: true,
    choices: [
      { id: "stairs_down", label: "Descente d'escaliers" },
      { id: "stairs_up", label: "Montée d'escaliers" },
      { id: "prolonged_sitting", label: "Position assise prolongée", hint: "Cinema sign — PFP" },
      { id: "running", label: "Course (impacts répétés)" },
      { id: "running_distance", label: "Course après un certain kilométrage" },
      { id: "jumping", label: "Sauts / réceptions" },
      { id: "squatting", label: "Squat / accroupissement" },
      { id: "kneeling", label: "Position à genoux" },
      { id: "loaded_walking", label: "Marche en charge prolongée" },
      { id: "pivot", label: "Mouvements de pivot / changements de direction" },
    ],
  },
  {
    id: "locking",
    category: "modifiers",
    prompt: "As-tu des blocages ou pseudo-blocages ?",
    importance: 3,
    choices: [
      { id: "true_locking", label: "Vrai blocage en flexion (impossible d'étendre)" },
      { id: "pseudo_locking", label: "Pseudo-blocage transitoire / accrochages" },
      { id: "giving_way", label: "Dérobements (genou « lâche »)" },
      { id: "no_locking", label: "Aucun blocage ni dérobement" },
    ],
  },
  {
    id: "instability",
    category: "modifiers",
    prompt: "Sensation d'instabilité ?",
    importance: 2,
    choices: [
      { id: "stable", label: "Stable — pas d'inquiétude" },
      { id: "unstable_pivot", label: "Instable lors de pivots / sport" },
      { id: "unstable_walk", label: "Instable même à la marche" },
      { id: "patellar_app", label: "Sensation que la rotule « va sortir »" },
    ],
  },
  {
    id: "activity_profile",
    category: "history",
    prompt: "Profil d'activité du patient ?",
    importance: 2,
    choices: [
      { id: "sedentary", label: "Sédentaire" },
      { id: "leisure", label: "Sportif loisir" },
      { id: "runner", label: "Coureur régulier (route / trail)" },
      { id: "pivot_contact", label: "Sport pivot/contact (foot, basket, hand, ski)" },
      { id: "jump_sport", label: "Sport explosif / sauts (volley, basket, athlétisme)" },
      { id: "cyclist", label: "Cycliste" },
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
      { id: "overweight", label: "Surpoids / IMC > 25", hint: "Facteur d'OA" },
      { id: "female", label: "Patiente femme", hint: "PFP plus fréquent" },
    ],
  },
  {
    id: "duration",
    category: "history",
    prompt: "Depuis combien de temps évolue la douleur ?",
    importance: 1,
    choices: [
      { id: "lt2w", label: "< 2 semaines (aigu)" },
      { id: "2_6w", label: "2-6 semaines" },
      { id: "6_12w", label: "6-12 semaines (subaigu)" },
      { id: "gt12w", label: "> 12 semaines (chronique)" },
      { id: "recurring", label: "Récidive d'un épisode antérieur" },
    ],
  },
  {
    id: "history_knee",
    category: "history",
    prompt: "ATCD pertinents au niveau du genou ?",
    importance: 1,
    multi: true,
    choices: [
      { id: "prev_acl", label: "Lésion LCA déjà connue (avec ou sans chirurgie)" },
      { id: "prev_meniscus", label: "Lésion ménisque connue" },
      { id: "prev_dislocation", label: "Luxation rotulienne connue" },
      { id: "prev_oa", label: "Arthrose fémoro-tibiale ou patellaire connue" },
      { id: "no_history", label: "Pas d'ATCD significatif" },
    ],
  },
];

const tests: ClinicalTest[] = [
  {
    id: "lachman",
    name: "Lachman test",
    procedure:
      "Patient en décubitus dorsal, genou à ~20-30° de flexion. Une main stabilise le fémur, l'autre tracte le tibia vers l'avant.",
    positiveMeans:
      "Translation antérieure excessive du tibia avec arrêt mou — évoque une lésion du LCA.",
    diagnosticAccuracy: "Sn ≈ 85% · Sp ≈ 94% (Cook 2018)",
  },
  {
    id: "mcmurray",
    name: "McMurray test",
    procedure:
      "Patient en décubitus dorsal. Flexion maximale + rotation externe et compression pour le ménisque médial (rotation interne pour le latéral), puis extension.",
    positiveMeans:
      "Claquement / accrochage / douleur reproduite sur l'interligne — évoque une lésion méniscale.",
    diagnosticAccuracy: "Sn 50-70% · Sp 60-95% (variable, dépendant opérateur)",
  },
  {
    id: "valgus_stress_30",
    name: "Stress en valgus 30°",
    procedure:
      "Patient en décubitus, genou fléchi à 30°. Stress en valgus — évalue le LCM isolé.",
    positiveMeans:
      "Bâillement médial + douleur — lésion LCM (grade selon ouverture).",
  },
  {
    id: "varus_stress_30",
    name: "Stress en varus 30°",
    procedure: "Genou à 30° de flexion, stress en varus.",
    positiveMeans: "Bâillement latéral + douleur — lésion LCL.",
  },
  {
    id: "patellar_apprehension",
    name: "Apprehension test rotulien",
    procedure:
      "Patient en décubitus, genou en légère flexion. Pousser doucement la rotule en latéral.",
    positiveMeans:
      "Réaction d'appréhension / contraction défensive — évoque instabilité patellaire.",
  },
  {
    id: "patellar_compression",
    name: "Compression patellaire (Clarke / Zohlen)",
    procedure:
      "Pression manuelle sur la rotule pendant que le patient contracte le quadriceps.",
    positiveMeans: "Douleur reproduite — évoque souffrance patellofémorale (faible spécificité).",
  },
  {
    id: "patellar_tendon_palpation",
    name: "Palpation pôle inférieur de la rotule",
    procedure:
      "Palpation du tendon rotulien à son insertion sur le pôle inférieur de la rotule.",
    positiveMeans:
      "Douleur localisée et reproductible — évoque une tendinopathie rotulienne.",
  },
  {
    id: "quad_tendon_palpation",
    name: "Palpation pôle supérieur de la rotule",
    procedure:
      "Palpation du tendon quadricipital à son insertion sur le pôle supérieur de la rotule.",
    positiveMeans:
      "Douleur localisée et reproductible — évoque une tendinopathie quadricipitale.",
  },
  {
    id: "ober",
    name: "Test d'Ober",
    procedure:
      "Décubitus latéral côté sain dessous, hanche en abduction puis extension. Relâcher la jambe.",
    positiveMeans:
      "La cuisse ne tombe pas en adduction — tension du TFL / bandelette IT.",
  },
];

const pathologies: PathologyCandidate[] = [
  {
    id: "acl_injury",
    name: "Lésion du ligament croisé antérieur",
    shortName: "Lésion LCA",
    prevalence: "moderate",
    summary:
      "Rupture partielle ou complète du LCA, généralement sur mécanisme pivot pied au sol avec hémarthrose immédiate. Diagnostic confirmé en imagerie (IRM) et examen clinique combiné.",
    hallmarks: [
      "Mécanisme pivot avec pied bloqué",
      "Craquement audible / sensation de déboîtement",
      "Hémarthrose immédiate (< 2h)",
      "Instabilité fonctionnelle persistante",
      "Lachman positif (test pivot)",
    ],
    questionSignatures: {
      onset: { trauma_acute: 3, progressive: -2, insidious: -2 },
      mechanism: { pivot_planted: 3, jump_landing: 2, hyperextension: 2, valgus: 1 },
      popping: { pop_crack: 3, shift: 3, tear: 2, none_special: -1 },
      swelling: { immediate: 3, delayed: 0, chronic_recurring: -1, none: -2 },
      locking: { giving_way: 2, pseudo_locking: 0, no_locking: 0, true_locking: 0 },
      instability: { unstable_pivot: 3, unstable_walk: 2, stable: -2 },
      activity_profile: { pivot_contact: 1, jump_sport: 1, runner: 0 },
      character: { mechanical_giving: 2, mechanical: 0 },
      duration: { lt2w: 1, "2_6w": 0, recurring: 1 },
      history_knee: { prev_acl: 2, no_history: 0 },
    },
    testSignatures: {
      lachman: { positive: 3, negative: -2 },
      patellar_apprehension: { positive: -1 },
    },
    management: {
      conservative: [
        "Phase aiguë : RICE, mobilité, marche en charge selon douleur",
        "Récupération progressive de l'amplitude (extension complète prioritaire)",
        "Rééducation neuromusculaire (proprioception, contrôle dynamique)",
        "Programme préopératoire si chirurgie envisagée",
      ],
      referral:
        "Orientation vers chirurgien orthopédiste si suspicion clinique forte (Lachman+ avec instabilité fonctionnelle), surtout chez le sportif jeune.",
      imaging: {
        modality: "IRM du genou",
        urgency: "soonish",
        rationale:
          "Confirmation du diagnostic, évaluation des lésions associées (méniscales, chondrales). À demander si suspicion clinique forte ou décision chirurgicale envisagée.",
      },
      followUp:
        "Réévaluation à 7-10 jours après la phase aiguë pour confirmer le tableau.",
    },
    patientScript:
      "« D'après ce que vous me décrivez et ce que je teste, plusieurs signes orientent vers une atteinte du ligament croisé antérieur. Ce n'est pas un diagnostic — il faut un avis médical et probablement une IRM pour confirmer. En attendant, on travaille sur la mobilité, l'œdème et le contrôle musculaire pour préparer la suite, quelle qu'elle soit. »",
  },
  {
    id: "meniscus_tear",
    name: "Lésion méniscale",
    shortName: "Ménisque",
    prevalence: "common",
    summary:
      "Lésion d'un ménisque (médial > latéral). Soit traumatique chez le sujet jeune (rotation en charge), soit dégénérative chez le sujet > 40 ans (apparition insidieuse ou trauma minime).",
    hallmarks: [
      "Trauma rotation en charge OU âge > 40 ans avec apparition insidieuse",
      "Douleur sur l'interligne articulaire",
      "Pseudo-blocages, accrochages, voire vrai blocage en flexion",
      "McMurray positif, palpation interligne sensible",
    ],
    questionSignatures: {
      onset: { trauma_acute: 2, progressive: 1, insidious: 1, post_immobilization: 0 },
      mechanism: { pivot_planted: 2, rotation_load: 3, jump_landing: 1, varus: 0, valgus: 0 },
      popping: { pop_crack: 1, tear: 2, none_special: 0 },
      swelling: { delayed: 2, chronic_recurring: 2, immediate: 0, none: -1 },
      location: { medial: 2, lateral: 2, ant_patella: -1, posterior: 1 },
      locking: { true_locking: 3, pseudo_locking: 3, giving_way: 1, no_locking: -1 },
      aggravators: {
        squatting: 2,
        kneeling: 2,
        pivot: 2,
        stairs_down: 1,
        stairs_up: 0,
        loaded_walking: 1,
      },
      character: { mechanical: 1, mechanical_giving: 1 },
      demographics: { age_over50: 1, age_30_50: 1, age_under30: 0 },
      duration: { "2_6w": 1, "6_12w": 1, gt12w: 1 },
    },
    testSignatures: {
      mcmurray: { positive: 3, negative: -1 },
      lachman: { positive: -1 },
    },
    management: {
      conservative: [
        "Programme kiné de 6-12 semaines en première intention pour les lésions dégénératives",
        "Renforcement quadriceps + chaîne postérieure",
        "Charge progressive, éviter les positions provoquantes initialement",
        "Reprise des activités fonctionnelles graduée",
      ],
      referral:
        "Orientation chirurgicale si vrai blocage irréductible OU échec d'un programme kiné bien conduit (≥ 12 semaines) chez le patient symptomatique.",
      imaging: {
        modality: "IRM du genou",
        urgency: "rare",
        rationale:
          "Pas systématique : la prise en charge initiale est conservatrice. À envisager si suspicion d'anse de seau (vrai blocage) ou si décision chirurgicale est sur la table.",
      },
      followUp: "Réévaluation à 4-6 semaines pour ajuster le programme.",
    },
    patientScript:
      "« Plusieurs éléments orientent vers une souffrance méniscale. La majorité des cas se gèrent très bien en kiné — on prendra 6 à 12 semaines pour réduire la douleur et restaurer la fonction. L'imagerie n'est pas indispensable d'emblée ; on l'envisagera seulement si on a besoin de prendre une décision chirurgicale. »",
  },
  {
    id: "pfp",
    name: "Syndrome fémoro-patellaire (PFP)",
    shortName: "PFP",
    prevalence: "common",
    summary:
      "Douleur antérieure de genou liée à un trouble de la coordination du complexe fémoro-patellaire et/ou de la chaîne. Très fréquent chez le sportif jeune et la population féminine.",
    hallmarks: [
      "Douleur antérieure mal localisée, sur ou autour de la rotule",
      "Aggravation en descente d'escaliers, position assise prolongée (cinema sign)",
      "Pas de trauma, apparition insidieuse",
      "Compression patellaire reproduit la douleur",
    ],
    questionSignatures: {
      onset: { progressive: 2, insidious: 3, trauma_acute: -2 },
      location: {
        ant_patella: 3,
        diffuse: 2,
        ant_inf: -1,
        ant_sup: -1,
        medial: -1,
        lateral: -1,
        posterior: -1,
      },
      character: { mechanical: 1, mechanical_giving: 0, dull_ache: 1 },
      aggravators: {
        stairs_down: 3,
        prolonged_sitting: 3,
        squatting: 2,
        running: 1,
        kneeling: 1,
        stairs_up: 1,
      },
      activity_profile: { runner: 1, leisure: 1, jump_sport: 1, sedentary: 0 },
      demographics: { age_under30: 1, female: 2, age_over50: -1 },
      locking: { no_locking: 1, true_locking: -2, giving_way: -1 },
      instability: { stable: 1, unstable_pivot: -1, unstable_walk: -2 },
      duration: { "2_6w": 1, "6_12w": 1, gt12w: 1, recurring: 1 },
    },
    testSignatures: {
      patellar_compression: { positive: 2, negative: -1 },
      patellar_apprehension: { positive: -1 },
      lachman: { positive: -2 },
      mcmurray: { positive: -2 },
    },
    management: {
      conservative: [
        "Renforcement progressif quadriceps + abducteurs / rotateurs externes de hanche",
        "Travail du contrôle moteur (descente, squat, atterrissage)",
        "Gestion de charge : réduction temporaire des activités provoquantes puis exposition graduée",
        "Étirements ischio-quadriceps si rétractions, semelles à discuter au cas par cas",
      ],
      followUp: "Réévaluation à 6 semaines — un programme bien conduit améliore 70-80% des cas.",
      imaging: {
        modality: "Aucune imagerie de routine",
        urgency: "rare",
        rationale:
          "Le diagnostic est clinique. Imagerie réservée aux cas atypiques ou résistants après ≥ 3 mois de PEC bien conduite.",
      },
    },
    patientScript:
      "« Ce que vous décrivez ressemble à un syndrome fémoro-patellaire — c'est l'une des douleurs de genou les plus fréquentes et l'une des plus accessibles à la kiné. Pas besoin d'imagerie d'emblée. On va travailler sur la force des quadriceps et de la hanche, sur le contrôle de vos mouvements, et sur la gestion de la charge. C'est un programme progressif, mais les résultats sont au rendez-vous dans la majorité des cas. »",
  },
  {
    id: "patellar_tendinopathy",
    name: "Tendinopathie rotulienne",
    shortName: "Tendinopathie rotulienne",
    prevalence: "common",
    summary:
      "Tendinopathie du tendon patellaire (jumper's knee), classiquement sur le pôle inférieur de la rotule, chez le sportif explosif (sauts, accélérations).",
    hallmarks: [
      "Douleur localisée pôle inférieur rotule, palpable",
      "Sportif jump (volley, basket, athlétisme) ou augmentation de charge récente",
      "Mécanique, à l'effort, de mieux à l'échauffement",
      "Apparition progressive",
    ],
    questionSignatures: {
      onset: { progressive: 3, insidious: 1, trauma_acute: -2 },
      location: { ant_inf: 3, ant_patella: 0, ant_sup: -2, medial: -2, lateral: -2 },
      character: { mechanical: 2 },
      aggravators: { jumping: 3, squatting: 2, stairs_up: 1, stairs_down: 1, running: 1 },
      activity_profile: { jump_sport: 3, pivot_contact: 1, runner: 1 },
      demographics: { age_under30: 1, age_30_50: 1, age_over50: -1 },
      duration: { "2_6w": 1, "6_12w": 1, gt12w: 1 },
    },
    testSignatures: {
      patellar_tendon_palpation: { positive: 3, negative: -2 },
      quad_tendon_palpation: { positive: -1 },
      patellar_compression: { positive: 0 },
    },
    management: {
      conservative: [
        "Modification temporaire de la charge sportive (réduction des sauts, pas de stop)",
        "Isométriques en phase irritable (ex : Spanish squat 5×45 s)",
        "Progression vers HSR (Heavy Slow Resistance) ou excentrique selon Cook/Malliaras",
        "Retour au saut graduel selon douleur (échelle Silbernagel ≤ 3-5/10)",
      ],
      followUp: "Réévaluation à 6 semaines — pathologie qui demande de la patience (3-6 mois).",
      imaging: {
        modality: "Échographie (si doute)",
        urgency: "rare",
        rationale:
          "Le diagnostic est clinique. L'écho peut confirmer la tendinopathie mais ne change pas la PEC.",
      },
    },
    patientScript:
      "« Ce que vous décrivez ressemble à une tendinopathie du tendon rotulien — fréquent dans votre type de sport. Il ne faut pas l'arrêter complètement mais l'adapter, et on va recharger progressivement le tendon avec un programme de force progressif. C'est une pathologie qui demande 3 à 6 mois de patience, mais qui répond bien si on s'y tient. »",
  },
  {
    id: "quadriceps_tendinopathy",
    name: "Tendinopathie quadricipitale",
    shortName: "Tendinopathie quadricipitale",
    prevalence: "moderate",
    summary:
      "Tendinopathie du tendon quadricipital, à son insertion sur le pôle supérieur de la rotule. Plus fréquente chez l'adulte de 30-50 ans, sportif ou actif.",
    hallmarks: [
      "Douleur localisée pôle supérieur rotule, palpable",
      "Apparition progressive",
      "Mécanique, à l'effort",
      "Peut s'associer à une tendinopathie rotulienne",
    ],
    questionSignatures: {
      onset: { progressive: 3, insidious: 1, trauma_acute: -2 },
      location: { ant_sup: 3, ant_patella: 0, ant_inf: -2 },
      character: { mechanical: 2 },
      aggravators: { stairs_up: 1, jumping: 1, squatting: 1, running: 1 },
      activity_profile: { runner: 1, leisure: 1, jump_sport: 1 },
      demographics: { age_30_50: 2, age_over50: 1, age_under30: 0 },
    },
    testSignatures: {
      quad_tendon_palpation: { positive: 3, negative: -2 },
      patellar_tendon_palpation: { positive: -1 },
    },
    management: {
      conservative: [
        "Gestion de charge similaire à la tendinopathie rotulienne",
        "Renforcement quadriceps progressif (isométriques → HSR)",
        "Étirements / mobilité fémoro-rotulienne au besoin",
        "Réintégration sportive progressive selon douleur",
      ],
      followUp: "Réévaluation à 6 semaines.",
      imaging: {
        modality: "Échographie (si doute)",
        urgency: "rare",
        rationale: "Diagnostic clinique. Écho confirme mais ne change pas la PEC.",
      },
    },
  },
  {
    id: "mcl_sprain",
    name: "Entorse du ligament collatéral médial",
    shortName: "Entorse LCM",
    prevalence: "moderate",
    summary:
      "Lésion du LCM, secondaire à un mécanisme valgus (choc latéral). Cicatrise généralement bien en conservateur.",
    hallmarks: [
      "Mécanisme valgus identifié",
      "Douleur médiale, parfois œdème localisé",
      "Stress en valgus 30° reproduit la douleur ± bâillement",
      "Stabilité globale conservée à la marche",
    ],
    questionSignatures: {
      onset: { trauma_acute: 3, progressive: -2, insidious: -2 },
      mechanism: { valgus: 3, pivot_planted: 1, direct_blow: 1, varus: -2 },
      location: { medial: 3, lateral: -2, ant_patella: -1 },
      swelling: { delayed: 1, immediate: 1, none: 0 },
      instability: { stable: 1, unstable_pivot: 0, unstable_walk: -1 },
      activity_profile: { pivot_contact: 1 },
    },
    testSignatures: {
      valgus_stress_30: { positive: 3, negative: -2 },
      varus_stress_30: { positive: -1 },
      lachman: { positive: 0 },
    },
    management: {
      conservative: [
        "Phase aiguë : RICE, attelle articulée si grade II",
        "Mobilité progressive, charge selon douleur",
        "Renforcement quadriceps + ischios + chaîne postérieure",
        "Réintégration sportive avec exercices de pivot graduels",
      ],
      followUp: "Grade I : 2-3 sem · Grade II : 4-6 sem · Grade III : avis chir si laxité majeure.",
      imaging: {
        modality: "IRM (rare)",
        urgency: "rare",
        rationale:
          "Pour grades I-II, la clinique suffit. IRM uniquement si suspicion de lésion combinée (LCA, ménisque) ou laxité importante.",
      },
    },
  },
  {
    id: "knee_oa",
    name: "Arthrose fémoro-tibiale",
    shortName: "Arthrose",
    prevalence: "common",
    summary:
      "Arthrose fémoro-tibiale (médiale > latérale) chez l'adulte > 50 ans, parfois plus tôt en cas de trauma antérieur. Diagnostic clinique selon NICE / EULAR (pas besoin de radio pour la PEC initiale).",
    hallmarks: [
      "Patient > 50 ans (ou ATCD trauma)",
      "Apparition insidieuse, douleur mécanique d'effort",
      "Raideur matinale courte (< 30 min)",
      "Limitation progressive d'amplitude",
    ],
    questionSignatures: {
      onset: { insidious: 3, progressive: 2, trauma_acute: -1 },
      character: { mechanical: 2, morning_stiff: 3, dull_ache: 1, mechanical_giving: 0 },
      aggravators: { loaded_walking: 2, stairs_up: 1, stairs_down: 1, kneeling: 1, squatting: 1 },
      demographics: { age_over50: 3, age_30_50: 0, age_under30: -2, overweight: 2 },
      duration: { gt12w: 2, "6_12w": 1, recurring: 1 },
      history_knee: { prev_oa: 2, prev_acl: 1, prev_meniscus: 1 },
    },
    testSignatures: {
      mcmurray: { positive: 0 },
      lachman: { positive: -1 },
      patellar_compression: { positive: 0 },
    },
    management: {
      conservative: [
        "Programme kiné prolongé : renforcement quadriceps + abducteurs hanche, mobilité, équilibre",
        "Activité physique adaptée (vélo, natation, marche progressive)",
        "Éducation : continuer à bouger, charge tolérable, gestion poids si surpoids",
        "Réadaptation cardio-respiratoire si déconditionnement",
      ],
      referral:
        "MG pour discussion AINS / antalgiques au cas par cas. Avis chir si échec conservateur > 6 mois ET retentissement majeur.",
      imaging: {
        modality: "Radiographie de genou en charge debout (incidences AP + Schuss + axiale)",
        urgency: "rare",
        rationale:
          "Pas systématique en première intention selon NICE — la clinique suffit. À envisager si décision chirurgicale envisagée ou tableau atypique.",
      },
      followUp:
        "Réévaluation 6-12 semaines. PEC pluriannuelle, focus sur la fonction plus que sur la douleur.",
    },
    patientScript:
      "« Le tableau clinique fait évoquer une arthrose du genou, ce qui n'est pas une fatalité : la kiné est le traitement de première intention recommandé par les guidelines internationales. On va travailler la force, la mobilité et l'activité physique adaptée — c'est ce qui marche le mieux à moyen terme. La radio n'est pas indispensable pour démarrer. »",
  },
  {
    id: "itbs",
    name: "Syndrome de la bandelette ilio-tibiale",
    shortName: "TFL / Bandelette IT",
    prevalence: "moderate",
    summary:
      "Syndrome de friction de la bandelette ilio-tibiale sur le condyle fémoral latéral, classiquement chez le coureur après un certain kilométrage.",
    hallmarks: [
      "Coureur (route / trail)",
      "Douleur latérale du genou apparaissant à un certain kilométrage",
      "Soulagement au repos puis récidive à la course suivante",
      "Test d'Ober souvent positif",
    ],
    questionSignatures: {
      onset: { progressive: 3, insidious: 1, trauma_acute: -2 },
      location: { lateral: 3, medial: -2, ant_patella: -1 },
      character: { mechanical: 2, dull_ache: 1 },
      aggravators: {
        running_distance: 3,
        running: 2,
        stairs_down: 1,
        stairs_up: 0,
        kneeling: 0,
      },
      activity_profile: { runner: 3, cyclist: 1, jump_sport: 0 },
    },
    testSignatures: {
      ober: { positive: 2, negative: -1 },
      mcmurray: { positive: -1 },
      patellar_compression: { positive: -1 },
    },
    management: {
      conservative: [
        "Modification temporaire de la course : réduction kilométrage, surfaces planes",
        "Renforcement abducteurs / rotateurs externes de hanche",
        "Travail biomécanique (cadence, foulée), ré-éducation course",
        "Étirement bandelette IT à discuter (efficacité débattue)",
      ],
      followUp: "Réévaluation à 6 semaines. Reprise de course très progressive (10% / semaine).",
      imaging: {
        modality: "Aucune imagerie de routine",
        urgency: "rare",
        rationale: "Diagnostic clinique. Pas d'indication d'imagerie en première intention.",
      },
    },
  },
];

export const kneeModule: DeepAssessmentModule = {
  zone: "knee_thigh",
  title: "Évaluation approfondie — genou",
  scope:
    "Adulte, douleur de genou non-traumatique récente OU post-traumatique sans drapeau rouge. Couvre 8 hypothèses cliniques fréquentes en accès direct kiné.",
  questions,
  tests,
  pathologies,
};
