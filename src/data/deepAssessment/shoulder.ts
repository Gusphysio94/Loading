import type {
  AnamnesisQuestion,
  ClinicalTest,
  DeepAssessmentModule,
  PathologyCandidate,
} from "../../types/deepAssessment";

/**
 * Module ÉPAULE
 *
 * Périmètre : adulte, douleur d'épaule non-traumatique récente OU
 * post-traumatique sans drapeau rouge (post-triage RF).
 *
 * Cadre conceptuel moderne (Lewis 2018, Diercks 2014) : éviter le
 * sur-diagnostic structurel. Le terme "Rotator Cuff Related Shoulder Pain"
 * (RCRSP) regroupe tendinopathie de coiffe, conflit sub-acromial, bursite
 * et ruptures partielles, dont la prise en charge initiale est commune.
 *
 * 8 hypothèses cliniques fréquentes en accès direct kiné :
 *  - Rotator Cuff Related Shoulder Pain (RCRSP)
 *  - Capsulite rétractile (frozen shoulder)
 *  - Instabilité gléno-humérale antérieure
 *  - Pathologie acromio-claviculaire
 *  - SLAP / lésion biceps
 *  - Arthrose gléno-humérale
 *  - Tendinopathie calcifiante
 *  - Cervico-brachialgie (origine cervicale)
 *
 * Sources :
 *  - Lewis 2018 (RCRSP framework)
 *  - Diercks 2014 (Subacromial Pain Syndrome — guideline)
 *  - Hopman 2013 / Page 2014 (RCRSP exercise therapy)
 *  - Kelley 2013 (frozen shoulder CPG, JOSPT)
 *  - Hanchard 2011 (frozen shoulder UK guideline)
 *  - Cools 2014 / Cuff 2018 (instabilité gléno-humérale)
 *  - Mall 2013 / van Bergen 2017 (AC joint disorders)
 *  - Patzer 2012 (SLAP — apport limité des tests cliniques)
 *  - Ansok 2018 (arthrose gléno-humérale)
 *  - de Witte 2015, Cardoso 2019 (tendinopathie calcifiante)
 *  - Bot 2005, Cleland 2006 (cluster diagnostic radiculopathie cervicale)
 *  - Décary 2017 (raisonnement diagnostique kiné, accès direct épaule)
 */

const questions: AnamnesisQuestion[] = [
  {
    id: "onset",
    category: "onset",
    prompt: "Comment la douleur a-t-elle commencé ?",
    importance: 3,
    choices: [
      {
        id: "trauma_acute",
        label: "Trauma aigu identifié",
        hint: "Chute, choc, traction",
      },
      {
        id: "progressive",
        label: "Progressif (semaines)",
        hint: "Surcharge / répétition",
      },
      {
        id: "insidious",
        label: "Insidieux (sans cause claire)",
      },
      {
        id: "post_immobilization",
        label: "Après une période d'immobilisation / chir",
        hint: "Évoque capsulite",
      },
      {
        id: "post_overhead",
        label: "Suite à un effort répété en élévation",
        hint: "Travail bras au-dessus de la tête",
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
        id: "fall_on_arm",
        label: "Chute sur le bras tendu / main au sol",
      },
      {
        id: "fall_on_shoulder",
        label: "Chute directe sur l'épaule",
        hint: "Évoque AC ou luxation",
      },
      {
        id: "throwing",
        label: "Lancer violent / mouvement explosif",
      },
      {
        id: "traction",
        label: "Traction sur le bras",
        hint: "Évoque luxation antérieure",
      },
      {
        id: "abduction_external_rotation",
        label: "Abduction + rotation externe forcée",
        hint: "Mécanisme classique de luxation antérieure",
      },
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
        id: "lateral_deltoid",
        label: "Face latérale du deltoïde / V deltoïdien",
        hint: "RCRSP typique",
      },
      {
        id: "anterior_shoulder",
        label: "Antérieure (face avant de l'épaule)",
      },
      {
        id: "ac_joint",
        label: "Sur l'articulation acromio-claviculaire",
        hint: "Pointage du doigt sur l'AC",
      },
      {
        id: "posterior_shoulder",
        label: "Postérieure (sous l'omoplate, scapula)",
      },
      {
        id: "neck_radiation",
        label: "Irradiation depuis la nuque",
      },
      {
        id: "below_elbow_radiation",
        label: "Irradiation au-delà du coude (avant-bras / main)",
        hint: "Évoque cervicale",
      },
      {
        id: "biceps_anterior",
        label: "Antérieure — sillon biceps long",
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
        id: "night_side_lying",
        label: "Nocturne en couchant sur l'épaule",
        hint: "Très évocatrice de RCRSP / capsulite",
      },
      {
        id: "constant_pain",
        label: "Constante, présente même au repos",
      },
      {
        id: "burning_radiating",
        label: "Brûlure / décharge irradiant dans le bras",
      },
      {
        id: "stiff_severe_loss",
        label: "Sensation que l'épaule « ne bouge plus »",
        hint: "Capsulite",
      },
    ],
  },
  {
    id: "rom_pattern",
    category: "character",
    prompt: "Comportement à la mobilité ?",
    importance: 3,
    choices: [
      {
        id: "active_painful_passive_ok",
        label: "Active douloureuse / limitée, passive plutôt conservée",
        hint: "RCRSP / tendinite",
      },
      {
        id: "global_restriction",
        label: "Restriction GLOBALE active ET passive (capsular pattern)",
        hint: "Capsulite probable",
      },
      {
        id: "painful_arc",
        label: "Arc douloureux entre 60° et 120° d'abduction",
      },
      {
        id: "weakness_dominant",
        label: "Faiblesse dominante (douleur secondaire)",
        hint: "Évoque rupture coiffe",
      },
      { id: "no_significant", label: "Pas de pattern marqué" },
    ],
  },
  {
    id: "aggravators",
    category: "modifiers",
    prompt: "Mouvements / situations aggravantes ?",
    importance: 3,
    multi: true,
    choices: [
      { id: "elevation_overhead", label: "Élévation / au-dessus de la tête" },
      { id: "abduction", label: "Abduction (écarter du corps)" },
      {
        id: "behind_back",
        label: "Main derrière le dos (rotation interne)",
      },
      {
        id: "sleeping_on_shoulder",
        label: "Dormir sur l'épaule",
      },
      { id: "throwing_hand_position", label: "Lancer / armer le bras" },
      { id: "carrying_load", label: "Porter une charge" },
      { id: "neck_movement", label: "Mouvements du cou" },
      {
        id: "cross_body",
        label: "Bras croisé devant la poitrine",
        hint: "Cible AC",
      },
    ],
  },
  {
    id: "instability_apprehension",
    category: "modifiers",
    prompt: "Sensation d'instabilité / appréhension ?",
    importance: 2,
    choices: [
      {
        id: "no_apprehension",
        label: "Aucune sensation d'instabilité",
      },
      {
        id: "occasional_apprehension",
        label: "Appréhension dans certaines positions",
      },
      {
        id: "recurrent_dislocations",
        label: "Luxations / sub-luxations répétées",
      },
      {
        id: "clicks_clunks",
        label: "Cliquements / accrochages internes",
      },
    ],
  },
  {
    id: "perceived_strength",
    category: "modifiers",
    prompt: "Perception de la force du bras ?",
    importance: 2,
    choices: [
      { id: "strength_normal", label: "Normale" },
      {
        id: "strength_reduced",
        label: "Diminuée mais fonctionnelle",
      },
      {
        id: "strength_severely_reduced",
        label: "Très diminuée (impossible de soulever)",
      },
    ],
  },
  {
    id: "neck_aggravation",
    category: "modifiers",
    prompt: "La douleur est-elle modifiée par les mouvements de la nuque ?",
    importance: 2,
    choices: [
      {
        id: "neck_aggravates",
        label: "Oui — la nuque déclenche / aggrave la douleur du bras",
      },
      {
        id: "neck_neutral",
        label: "Non — pas de lien avec la nuque",
      },
      { id: "unsure", label: "Pas sûr / pas testé" },
    ],
  },
  {
    id: "activity_profile",
    category: "history",
    prompt: "Profil d'activité ?",
    importance: 2,
    choices: [
      { id: "sedentary", label: "Sédentaire" },
      {
        id: "overhead_work",
        label: "Travail bras au-dessus de la tête",
      },
      {
        id: "manual_labor",
        label: "Travail manuel avec charges",
      },
      {
        id: "overhead_sport",
        label: "Sport overhead (volley, tennis, lancer, escalade)",
      },
      {
        id: "contact_sport",
        label: "Sport de contact (rugby, foot, hand)",
      },
      { id: "leisure", label: "Sportif loisir / général" },
    ],
  },
  {
    id: "demographics",
    category: "history",
    prompt: "Profil démographique / médical ?",
    importance: 2,
    multi: true,
    choices: [
      { id: "age_under30", label: "Adulte jeune (< 30 ans)" },
      { id: "age_30_50", label: "30-50 ans" },
      { id: "age_50_70", label: "50-70 ans" },
      { id: "age_over70", label: "> 70 ans" },
      { id: "female", label: "Femme" },
      {
        id: "diabetic",
        label: "Diabète",
        hint: "FDR majeur capsulite",
      },
      {
        id: "thyroid_disorder",
        label: "Pathologie thyroïdienne / dyslipidémie",
      },
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
    id: "history_shoulder",
    category: "history",
    prompt: "ATCD pertinents ?",
    importance: 1,
    multi: true,
    choices: [
      {
        id: "anterior_dislocation",
        label: "Luxation antérieure(s) connue(s)",
      },
      {
        id: "previous_capsulitis",
        label: "Capsulite controlatérale antérieure",
      },
      { id: "shoulder_surgery", label: "Chirurgie d'épaule antérieure" },
      {
        id: "cervical_radiculopathy",
        label: "Cervicalgie / radiculopathie connue",
      },
      {
        id: "rotator_cuff_tear",
        label: "Rupture coiffe connue",
      },
      { id: "no_history", label: "Pas d'ATCD significatif" },
    ],
  },
];

const tests: ClinicalTest[] = [
  {
    id: "hawkins_kennedy",
    name: "Hawkins-Kennedy",
    procedure:
      "Bras en élévation 90° dans le plan scapulaire, coude à 90°. Rotation interne passive forcée.",
    positiveMeans:
      "Reproduction de la douleur — évoque RCRSP / conflit sub-acromial.",
    diagnosticAccuracy:
      "Sn ≈ 75% · Sp ≈ 50% (Hegedus 2012) — sensible mais peu spécifique.",
  },
  {
    id: "neer",
    name: "Test de Neer",
    procedure:
      "Bras en élévation passive maximale dans le plan scapulaire, scapula stabilisée.",
    positiveMeans:
      "Reproduction de la douleur en fin d'amplitude — évoque RCRSP.",
    diagnosticAccuracy: "Sn ≈ 75% · Sp ≈ 50% (Hegedus 2012).",
  },
  {
    id: "empty_can",
    name: "Empty can / Jobe",
    procedure:
      "Bras à 90° d'abduction dans le plan scapulaire, pouce vers le bas. Résistance à l'élévation.",
    positiveMeans:
      "Faiblesse et/ou douleur — évoque atteinte du sus-épineux.",
    diagnosticAccuracy: "Sn ≈ 70% pour pathologie sus-épineuse.",
  },
  {
    id: "external_rotation_lag",
    name: "External rotation lag sign",
    procedure:
      "Coude à 90°, le kiné amène passivement le bras en rotation externe maximale puis lâche. Le patient doit maintenir.",
    positiveMeans:
      "Le bras tombe en rotation interne (lag) — évoque rupture transfixiante du sus / sous-épineux.",
    diagnosticAccuracy:
      "Sp ≈ 95% pour rupture full-thickness (Hertel 1996).",
  },
  {
    id: "lift_off_belly_press",
    name: "Lift-off / Belly-press (sub-scapulaire)",
    procedure:
      "Lift-off : main lombaire, le patient décolle la main du dos. Belly-press : main sur le ventre, coude poussé en avant.",
    positiveMeans:
      "Faiblesse / impossibilité de maintenir — évoque atteinte du sub-scapulaire.",
  },
  {
    id: "anterior_apprehension",
    name: "Apprehension test antérieur",
    procedure:
      "Patient en décubitus dorsal, bras en abduction 90° + rotation externe progressive.",
    positiveMeans:
      "Sensation d'appréhension / déboîtement (≠ douleur seule) — évoque instabilité antérieure.",
    diagnosticAccuracy:
      "Sp > 95% si associé au relocation test (Lo 2004).",
  },
  {
    id: "obriens",
    name: "Test d'O'Brien (active compression)",
    procedure:
      "Bras à 90° de flexion, coude étendu, adduction de 10°. Test 1 : pouce vers le bas, résistance contre poussée vers le bas. Test 2 : paume vers le haut, même résistance.",
    positiveMeans:
      "Douleur PROFONDE en pronation, soulagée en supination — évoque lésion SLAP. Douleur sur le dessus de l'épaule = AC.",
    diagnosticAccuracy:
      "Apport modeste isolé (Patzer 2012) — à interpréter en cluster.",
  },
  {
    id: "cross_body_adduction",
    name: "Cross-body adduction (AC)",
    procedure:
      "Bras à 90° de flexion, adduction passive horizontale maximale.",
    positiveMeans:
      "Douleur localisée sur l'AC (le patient pointe du doigt) — évoque pathologie acromio-claviculaire.",
  },
  {
    id: "global_passive_er_restriction",
    name: "Restriction passive de rotation externe (test capsulite)",
    procedure:
      "Patient en décubitus dorsal, bras le long du corps, coude à 90°. Rotation externe passive comparée au côté sain.",
    positiveMeans:
      "Restriction passive (≥ 50% par rapport au côté sain) avec sensation de butée capsulaire — évoque très fortement une capsulite (capsular pattern).",
    diagnosticAccuracy:
      "Critère diagnostique majeur (Kelley 2013, Hanchard 2011).",
  },
  {
    id: "spurling",
    name: "Test de Spurling (cervical)",
    procedure:
      "Inclinaison cervicale homolatérale + extension légère + compression axiale.",
    positiveMeans:
      "Reproduction d'une douleur radiculaire dans le bras — évoque radiculopathie cervicale.",
    diagnosticAccuracy:
      "Sp ≈ 90-93% (Wainner 2003) — combiner avec distraction et ULTT.",
  },
];

const pathologies: PathologyCandidate[] = [
  {
    id: "rcrsp",
    name: "Rotator Cuff Related Shoulder Pain (RCRSP)",
    shortName: "RCRSP / coiffe",
    prevalence: "common",
    summary:
      "Cadre conceptuel moderne (Lewis 2018) regroupant tendinopathie de coiffe, conflit sub-acromial, bursite et rupture partielle. La PEC initiale est commune : exercice progressif est le pilier (Diercks 2014, Page 2014). Diagnostic structurel précis non nécessaire pour démarrer la PEC.",
    hallmarks: [
      "Douleur latérale du deltoïde, mécanique à l'effort",
      "Aggravation en élévation / abduction et derrière le dos",
      "Douleur nocturne en se couchant sur l'épaule",
      "Active limitée et douloureuse, passive plus libre",
      "Hawkins / Neer / Empty can positifs (en cluster, pas isolés)",
    ],
    questionSignatures: {
      onset: {
        progressive: 3,
        insidious: 2,
        post_overhead: 2,
        trauma_acute: -1,
        post_immobilization: -2,
      },
      location: {
        lateral_deltoid: 3,
        anterior_shoulder: 1,
        ac_joint: -2,
        biceps_anterior: 1,
        below_elbow_radiation: -2,
        neck_radiation: -1,
      },
      character: {
        mechanical: 2,
        night_side_lying: 2,
        stiff_severe_loss: -2,
      },
      rom_pattern: {
        active_painful_passive_ok: 3,
        painful_arc: 2,
        global_restriction: -3,
        weakness_dominant: 1,
      },
      aggravators: {
        elevation_overhead: 3,
        abduction: 2,
        behind_back: 2,
        sleeping_on_shoulder: 2,
        throwing_hand_position: 1,
      },
      activity_profile: {
        overhead_work: 2,
        overhead_sport: 2,
        manual_labor: 1,
        sedentary: 0,
      },
      demographics: { age_30_50: 1, age_50_70: 1 },
      duration: { "2_6w": 1, "6_12w": 2, gt12w: 1 },
    },
    testSignatures: {
      hawkins_kennedy: { positive: 2 },
      neer: { positive: 2 },
      empty_can: { positive: 2 },
      external_rotation_lag: { positive: -1 },
      global_passive_er_restriction: { positive: -3 },
      anterior_apprehension: { positive: -2 },
      spurling: { positive: -2 },
    },
    management: {
      conservative: [
        "Programme d'exercice progressif sur 12 sem en 1ère intention (Diercks 2014, Page 2014) — niveau de preuve élevé",
        "Renforcement coiffe + stabilisateurs scapulaires (séries de 3×10-15, charge progressive)",
        "Mobilité gléno-humérale + travail postural",
        "Éducation : pathologie qui répond à la charge, pas besoin d'arrêter",
        "Gestion temporaire des activités provoquantes — reprise graduée",
      ],
      followUp:
        "Réévaluation à 6-12 semaines. 70-80% d'amélioration significative à 12 sem.",
      imaging: {
        modality: "Échographie (rare, après 6-12 sem d'échec)",
        urgency: "rare",
        rationale:
          "Pas d'imagerie en 1ère intention selon Diercks 2014 — l'image structurelle ne change pas la PEC initiale (les anomalies de coiffe sont fréquentes chez l'asymptomatique). À envisager si plateau et discussion d'orientation.",
      },
    },
    patientScript:
      "« Ce que vous décrivez correspond à une douleur de l'épaule en lien avec la coiffe des rotateurs. C'est très bien étudié en kiné — la majorité des patients vont mieux avec un programme d'exercice progressif sur 3 mois, sans avoir besoin d'imagerie au départ. On va commencer par redonner de la charge progressive aux muscles, c'est ce qui marche le mieux. »",
  },
  {
    id: "frozen_shoulder",
    name: "Capsulite rétractile (frozen shoulder)",
    shortName: "Capsulite",
    prevalence: "common",
    summary:
      "Inflammation puis fibrose de la capsule gléno-humérale, avec restriction GLOBALE active ET passive. Évolution typique en 3 phases (douleur → raideur → résolution) sur 1-3 ans. Diagnostic clinique avant tout (Kelley 2013, Hanchard 2011).",
    hallmarks: [
      "Restriction GLOBALE passive (capsular pattern : ER > Abd > IR)",
      "Douleur diffuse, nocturne, aggravée en fin d'amplitude",
      "Évolution insidieuse parfois post-immobilisation",
      "Plus fréquent chez femme 40-60 ans, diabétique, thyroïdien",
      "Restriction passive de RE > 50% par rapport au côté sain",
    ],
    questionSignatures: {
      onset: {
        insidious: 3,
        progressive: 1,
        post_immobilization: 3,
        trauma_acute: -1,
      },
      location: {
        lateral_deltoid: 1,
        anterior_shoulder: 1,
        ac_joint: -2,
        below_elbow_radiation: -2,
      },
      character: {
        stiff_severe_loss: 3,
        night_side_lying: 2,
        constant_pain: 2,
      },
      rom_pattern: {
        global_restriction: 3,
        active_painful_passive_ok: -3,
        painful_arc: -1,
      },
      aggravators: {
        elevation_overhead: 2,
        abduction: 2,
        behind_back: 3,
        sleeping_on_shoulder: 2,
      },
      demographics: {
        age_30_50: 1,
        age_50_70: 2,
        female: 2,
        diabetic: 3,
        thyroid_disorder: 2,
      },
      duration: { "6_12w": 1, gt12w: 2 },
      history_shoulder: {
        previous_capsulitis: 2,
        shoulder_surgery: 1,
      },
    },
    testSignatures: {
      global_passive_er_restriction: { positive: 3, negative: -3 },
      hawkins_kennedy: { positive: 0 },
      neer: { positive: 0 },
      empty_can: { positive: 0 },
      anterior_apprehension: { positive: -2 },
      spurling: { positive: -2 },
    },
    management: {
      conservative: [
        "Éducation : pathologie auto-résolutive en 1-3 ans, mais bénéfique d'accompagner",
        "Phase douloureuse : antalgie, mobilité douce sans douleur (« short-stretch »)",
        "Phase de raideur : étirements progressifs prolongés + mobilisations actives-assistées (Kelley 2013)",
        "Renforcement progressif dès que la mobilité revient",
        "Pas de mobilisation forcée agressive en phase douloureuse",
      ],
      referral:
        "Si plateau / douleur ingérable → discussion infiltration intra-articulaire (orientation MG / rhumato), parfois mobilisation sous AG ou capsulodistension.",
      imaging: {
        modality: "Aucune imagerie de routine",
        urgency: "rare",
        rationale:
          "Diagnostic clinique. Imagerie réservée aux atypies (suspicion d'arthrose ou rupture coiffe associée).",
      },
      followUp:
        "Réévaluation à 6-12 semaines. PEC longue, gestion d'attentes essentielle.",
    },
    patientScript:
      "« Le tableau évoque une capsulite rétractile — la « épaule gelée ». C'est une pathologie longue mais qui se résout : la majorité des patients récupèrent en 1 à 3 ans. La kiné aide à mieux vivre cette période, notamment à maintenir la mobilité. On évite les forçages en phase douloureuse, on travaille progressivement. »",
  },
  {
    id: "anterior_instability",
    name: "Instabilité gléno-humérale antérieure",
    shortName: "Instabilité antérieure",
    prevalence: "moderate",
    summary:
      "Laxité ou véritable instabilité antérieure souvent post-luxation chez le sportif jeune, ou multidirectionnelle chez l'hyperlaxe. La PEC kiné est l'option de 1ère intention non chirurgicale (Cools 2014).",
    hallmarks: [
      "Sportif jeune (< 30 ans), sport de contact ou overhead",
      "ATCD de luxation antérieure",
      "Appréhension en abduction + rotation externe",
      "Apprehension test positif (vraie sensation de déboîtement)",
    ],
    questionSignatures: {
      onset: {
        trauma_acute: 2,
        progressive: 0,
        insidious: 0,
      },
      mechanism: {
        traction: 1,
        abduction_external_rotation: 3,
        fall_on_arm: 2,
        fall_on_shoulder: 1,
        throwing: 1,
      },
      location: {
        anterior_shoulder: 2,
        lateral_deltoid: 1,
      },
      instability_apprehension: {
        recurrent_dislocations: 3,
        occasional_apprehension: 3,
        clicks_clunks: 1,
        no_apprehension: -3,
      },
      aggravators: {
        throwing_hand_position: 2,
        abduction: 1,
      },
      activity_profile: {
        contact_sport: 2,
        overhead_sport: 2,
        leisure: 0,
      },
      demographics: { age_under30: 2, age_30_50: 0 },
      history_shoulder: {
        anterior_dislocation: 3,
        no_history: -1,
      },
    },
    testSignatures: {
      anterior_apprehension: { positive: 3, negative: -2 },
      hawkins_kennedy: { positive: -1 },
      global_passive_er_restriction: { positive: -3 },
    },
    management: {
      conservative: [
        "Renforcement coiffe (notamment sub-scapulaire et infra-épineux)",
        "Renforcement stabilisateurs scapulaires (rhomboïdes, dentelé antérieur, trapèze inférieur)",
        "Travail proprioceptif progressif + contrôle moteur en abduction-RE",
        "Réintégration sportive avec critères fonctionnels",
        "Éducation à éviter les positions provocatrices initialement",
      ],
      referral:
        "Avis chir orthopédique si luxations récurrentes, sportif jeune avec atteinte structurelle (Bankart, Hill-Sachs significatifs) ou échec conservateur.",
      imaging: {
        modality: "IRM ± arthro-IRM",
        urgency: "soonish",
        rationale:
          "Si ≥ 1 luxation : recherche de lésion de Bankart (labrum) ou Hill-Sachs. Influence le choix kiné vs chirurgie.",
      },
      followUp: "Réévaluation à 6-12 semaines.",
    },
  },
  {
    id: "ac_pathology",
    name: "Pathologie acromio-claviculaire",
    shortName: "AC",
    prevalence: "moderate",
    summary:
      "Atteinte de l'articulation acromio-claviculaire : entorse aiguë (post-trauma), arthrose chronique ou ostéolyse de la clavicule distale chez le sportif de force. Localisation très précise (le patient pointe du doigt l'AC).",
    hallmarks: [
      "Douleur localisée sur l'AC (pointage du doigt)",
      "ATCD de chute directe sur l'épaule",
      "OU sport de force répétée (haltérophilie, push-up)",
      "Cross-body adduction reproduit la douleur",
    ],
    questionSignatures: {
      onset: {
        trauma_acute: 2,
        progressive: 1,
        insidious: 1,
      },
      mechanism: {
        fall_on_shoulder: 3,
        fall_on_arm: 1,
        throwing: 0,
      },
      location: {
        ac_joint: 3,
        lateral_deltoid: -1,
        anterior_shoulder: 0,
        below_elbow_radiation: -2,
      },
      aggravators: {
        cross_body: 3,
        carrying_load: 2,
        sleeping_on_shoulder: 1,
        elevation_overhead: 1,
      },
      activity_profile: { manual_labor: 1, contact_sport: 1 },
      demographics: { age_30_50: 1, age_50_70: 1 },
    },
    testSignatures: {
      cross_body_adduction: { positive: 3, negative: -1 },
      hawkins_kennedy: { positive: 0 },
      neer: { positive: 0 },
      anterior_apprehension: { positive: -2 },
      global_passive_er_restriction: { positive: -2 },
    },
    management: {
      conservative: [
        "Phase aiguë : protection (écharpe), antalgie, mobilité douce",
        "Renforcement progressif coiffe + stabilisateurs scapulaires",
        "Adaptation des charges et mouvements provoquants (cross-body, push)",
        "Réintégration des activités progressivement",
      ],
      referral:
        "Avis chir si entorse aiguë grade IV-V (Rockwood) ou échec conservateur.",
      imaging: {
        modality: "Radiographie standard ± stress",
        urgency: "rare",
        rationale:
          "Si trauma aigu, radio pour grader (Rockwood). Pas systématique pour la PEC kiné des arthropathies AC chroniques (clinique suffit).",
      },
    },
  },
  {
    id: "slap_biceps",
    name: "SLAP / lésion biceps long",
    shortName: "SLAP / biceps",
    prevalence: "rare",
    summary:
      "Lésion de l'ancrage labrum-biceps (SLAP, Snyder) ou du tendon du biceps long. Classiquement chez le sportif overhead (lanceur, volley). Diagnostic clinique difficile — le test isolé est peu fiable (Patzer 2012), à interpréter en cluster.",
    hallmarks: [
      "Sportif overhead (lanceur, volley, tennis, escalade)",
      "Douleur antérieure profonde, parfois cliquements",
      "Aggravée par l'armer + accélération (lancer)",
      "O'Brien positif (en cluster avec d'autres tests)",
    ],
    questionSignatures: {
      onset: {
        progressive: 2,
        trauma_acute: 1,
        post_overhead: 2,
        insidious: 1,
      },
      mechanism: {
        throwing: 2,
        traction: 1,
        fall_on_arm: 1,
      },
      location: {
        anterior_shoulder: 2,
        biceps_anterior: 3,
        ac_joint: -1,
        below_elbow_radiation: -2,
      },
      character: { mechanical: 1 },
      aggravators: {
        throwing_hand_position: 3,
        elevation_overhead: 1,
      },
      instability_apprehension: { clicks_clunks: 2 },
      activity_profile: {
        overhead_sport: 2,
        contact_sport: 1,
      },
      demographics: { age_under30: 1, age_30_50: 1 },
    },
    testSignatures: {
      obriens: { positive: 2 },
      hawkins_kennedy: { positive: 0 },
      anterior_apprehension: { positive: 0 },
      global_passive_er_restriction: { positive: -2 },
      cross_body_adduction: { positive: 0 },
    },
    management: {
      conservative: [
        "Programme de réhabilitation orienté sportif overhead : coiffe, stabilisateurs scapulaires, contrôle moteur",
        "Adaptation gestuelle (technique de lancer, charge progressive)",
        "Patience — diagnostic et PEC kiné peuvent suffire pour de nombreux cas",
      ],
      referral:
        "Avis chir orthopédique si échec ≥ 3-6 mois OU lésion confirmée chez le jeune sportif compétitif.",
      imaging: {
        modality: "IRM ± arthro-IRM",
        urgency: "rare",
        rationale:
          "Réservée aux cas atypiques ou avant décision chirurgicale. Le test clinique seul est peu fiable, l'IRM aide à confirmer la lésion structurelle.",
      },
    },
  },
  {
    id: "gh_oa",
    name: "Arthrose gléno-humérale",
    shortName: "Arthrose GH",
    prevalence: "moderate",
    summary:
      "Arthrose primaire ou secondaire (post-trauma, post-instabilité) chez l'adulte > 60 ans. Présentation similaire à RCRSP avec une composante de raideur progressive et une douleur plus diffuse, parfois avec crépitations.",
    hallmarks: [
      "Patient > 60 ans typiquement",
      "Apparition insidieuse, progression sur années",
      "Raideur GLOBALE progressive",
      "Crépitations possibles à la mobilisation",
    ],
    questionSignatures: {
      onset: { insidious: 3, progressive: 2, trauma_acute: -1 },
      location: {
        lateral_deltoid: 1,
        anterior_shoulder: 1,
        posterior_shoulder: 1,
      },
      character: {
        mechanical: 2,
        stiff_severe_loss: 2,
        constant_pain: 1,
      },
      rom_pattern: {
        global_restriction: 2,
        active_painful_passive_ok: 0,
        weakness_dominant: 0,
      },
      aggravators: {
        elevation_overhead: 1,
        carrying_load: 1,
        sleeping_on_shoulder: 1,
      },
      demographics: {
        age_50_70: 2,
        age_over70: 3,
        age_under30: -2,
      },
      duration: { gt12w: 2, "6_12w": 1, recurring: 1 },
      history_shoulder: {
        anterior_dislocation: 1,
        rotator_cuff_tear: 1,
      },
    },
    testSignatures: {
      global_passive_er_restriction: { positive: 1 },
      hawkins_kennedy: { positive: 0 },
      anterior_apprehension: { positive: -2 },
    },
    management: {
      conservative: [
        "Programme kiné prolongé : mobilité, renforcement coiffe + stabilisateurs scapulaires",
        "Activité physique adaptée, gestion poids si surpoids",
        "Éducation : continuer à bouger dans la limite tolérable",
      ],
      referral:
        "MG pour discussion antalgique. Avis chir (prothèse anatomique ou inversée) si échec ≥ 6 mois ET retentissement majeur.",
      imaging: {
        modality: "Radiographie standard (AP + axillaire)",
        urgency: "rare",
        rationale:
          "Confirme l'arthrose et son stade. Pas indispensable pour démarrer la PEC kiné conservatrice mais utile en cas de discussion chirurgicale.",
      },
      followUp: "Réévaluation à 6-12 semaines, PEC pluriannuelle.",
    },
  },
  {
    id: "calcific_tendinopathy",
    name: "Tendinopathie calcifiante",
    shortName: "Calcification",
    prevalence: "moderate",
    summary:
      "Dépôts calciques au sein de la coiffe (sus-épineux > sous-épineux), avec phases silencieuses ou hyperalgiques (résorption aiguë). Femme 30-50 ans typiquement.",
    hallmarks: [
      "Femme 30-50 ans souvent",
      "Tableau parfois HYPERALGIQUE en phase de résorption",
      "Douleur nocturne intense",
      "Pas toujours corrélé à la fonction (peut être asympto)",
    ],
    questionSignatures: {
      onset: {
        insidious: 1,
        progressive: 1,
        trauma_acute: -1,
      },
      location: { lateral_deltoid: 2, anterior_shoulder: 1 },
      character: {
        constant_pain: 2,
        night_side_lying: 2,
        mechanical: 1,
      },
      rom_pattern: {
        active_painful_passive_ok: 1,
        painful_arc: 1,
      },
      aggravators: {
        elevation_overhead: 2,
        sleeping_on_shoulder: 2,
      },
      demographics: { female: 1, age_30_50: 2 },
      duration: { "2_6w": 1, "6_12w": 1, gt12w: 1 },
    },
    testSignatures: {
      hawkins_kennedy: { positive: 1 },
      neer: { positive: 1 },
      empty_can: { positive: 1 },
      global_passive_er_restriction: { positive: -2 },
    },
    management: {
      conservative: [
        "Si phase silencieuse / modérée : programme RCRSP standard (exercice progressif)",
        "Si phase hyperalgique de résorption : antalgie, AINS, mobilité douce, repos relatif court",
        "Discussion barbotage écho-guidé / ESWT si plateau ≥ 6 mois (orientation rhumato/radiologie interventionnelle)",
      ],
      referral:
        "Avis radiologique interventionnel si calcification visible et tableau récurrent (barbotage souvent efficace).",
      imaging: {
        modality: "Radiographie standard ± échographie",
        urgency: "soonish",
        rationale:
          "La radiographie confirme la calcification et discrimine la phase (formation dense vs résorption). À demander si tableau hyperalgique inhabituel ou récidive (Cardoso 2019).",
      },
    },
  },
  {
    id: "cervical_referred",
    name: "Cervico-brachialgie / origine cervicale",
    shortName: "Origine cervicale",
    prevalence: "common",
    summary:
      "Douleur d'épaule projetée d'origine cervicale (radiculopathie C5-C6 ou douleur référée). Diagnostic souvent manqué — Bot 2005 montre que jusqu'à 30% des douleurs d'épaule ont une composante cervicale.",
    hallmarks: [
      "Douleur irradiant en deçà du coude (avant-bras / main)",
      "Aggravation par les mouvements de la nuque",
      "Paresthésies / décharges électriques possibles",
      "ATCD de cervicalgie connue",
      "Spurling positif",
    ],
    questionSignatures: {
      onset: {
        insidious: 2,
        progressive: 1,
        trauma_acute: 0,
      },
      location: {
        neck_radiation: 3,
        below_elbow_radiation: 3,
        lateral_deltoid: 1,
        ac_joint: -2,
      },
      character: {
        burning_radiating: 3,
        mechanical: 1,
      },
      rom_pattern: {
        active_painful_passive_ok: 0,
        global_restriction: -2,
      },
      aggravators: {
        neck_movement: 3,
      },
      neck_aggravation: {
        neck_aggravates: 3,
        neck_neutral: -3,
      },
      demographics: { age_30_50: 1, age_50_70: 1 },
      history_shoulder: { cervical_radiculopathy: 3 },
    },
    testSignatures: {
      spurling: { positive: 3, negative: -2 },
      hawkins_kennedy: { positive: -1 },
      neer: { positive: -1 },
      global_passive_er_restriction: { positive: -3 },
      anterior_apprehension: { positive: -2 },
    },
    management: {
      conservative: [
        "Bilan cervical complet, traitement de la cervicalgie sous-jacente (mobilité, renforcement deep neck flexors, posture)",
        "Travail neurodynamique du membre supérieur si signes de tension neurale",
        "Éducation : la douleur d'épaule peut être un symptôme cervical",
        "Réévaluer à 4-6 sem — souvent rapide amélioration si origine cervicale",
      ],
      referral:
        "Avis MG / neuro / spé si déficit neurologique progressif ou si signes médullaires (déjà screenés au triage RF).",
      imaging: {
        modality: "Aucune imagerie d'emblée",
        urgency: "rare",
        rationale:
          "PEC initiale est conservatrice. IRM cervicale à discuter si déficit neurologique objectif ou plateau ≥ 6-12 sem.",
      },
    },
    patientScript:
      "« Plusieurs éléments orientent vers une origine cervicale de votre douleur d'épaule — l'irradiation au-delà du coude et la modification par les mouvements de la nuque sont assez parlantes. On va travailler la nuque et la mobilité du nerf, et la majorité des patients vont mieux rapidement quand on prend la bonne porte d'entrée. »",
  },
];

export const shoulderModule: DeepAssessmentModule = {
  zone: "shoulder",
  title: "Évaluation approfondie — épaule",
  scope:
    "Adulte, douleur d'épaule non-traumatique récente OU post-traumatique sans drapeau rouge. Couvre 8 hypothèses cliniques fréquentes en accès direct kiné, avec un cadre conceptuel moderne (RCRSP — Lewis 2018).",
  questions,
  tests,
  pathologies,
};
