import type {
  AnamnesisQuestion,
  ClinicalTest,
  DeepAssessmentModule,
  PathologyCandidate,
} from "../../types/deepAssessment";

/**
 * Module LOMBAIRE
 *
 * Périmètre : adulte, lombalgie OU lombo-sciatique sans drapeau rouge
 * (post-triage RF — cauda equina, AAA, fracture, infection, néoplasie,
 * spondylarthrite, déficit neurologique progressif, déjà screenés).
 *
 * Cadre conceptuel moderne :
 *  - Lancet LBP series 2018 (Foster, Hartvigsen, Buchbinder) — la majorité
 *    des lombalgies sont non-spécifiques ; éviter le sur-diagnostic
 *    pathoanatomique et le sur-recours à l'imagerie.
 *  - NICE NG59 (2020) — pas d'imagerie de routine ; évaluation du risque
 *    de chronicisation (STarT Back) ; PEC de 1ère ligne = exercice +
 *    éducation + activité.
 *  - O'Sullivan 2018 (Cognitive Functional Therapy) — classification
 *    multidimensionnelle.
 *
 * 8 hypothèses cliniques fréquentes en accès direct kiné :
 *  - Lombalgie commune mécanique (non-specific LBP)
 *  - Radiculopathie / sciatique (avec déficit radiculaire)
 *  - Sténose lombaire (claudication neurogène)
 *  - Douleur sacro-iliaque
 *  - Syndrome facetaire lombaire
 *  - Lombalgie chronique avec sensibilisation centrale (composante nociplastique)
 *  - Spondylolisthésis isthmique symptomatique
 *  - Coccygodynie
 *
 * IMPORTANT : ce module sort du raisonnement pathoanatomique strict.
 * Plusieurs hypothèses peuvent coexister chez un même patient, et la
 * classification fonctionnelle (préférence directionnelle, contrôle
 * moteur, sensibilisation) est centrale dans la PEC moderne.
 *
 * Sources :
 *  - NICE NG59 (Low back pain and sciatica, 2016/2020)
 *  - Foster 2018, Hartvigsen 2018, Buchbinder 2018 (Lancet LBP series)
 *  - Maher 2017 (non-specific LBP, Lancet)
 *  - O'Sullivan 2018 (Cognitive Functional Therapy)
 *  - Hill 2011 (STarT Back screening tool)
 *  - Werneke 2018 (centralization / directional preference McKenzie)
 *  - Verwoerd 2013, Hancock 2007 (sciatica clinical signs)
 *  - Konstantinou 2018 (sciatica trial, BMJ)
 *  - Laslett 2005 (cluster diagnostique sacro-iliaque)
 *  - Hicks 2005 (instabilité lombaire — prone instability test)
 *  - Genevay 2010 (Self-administered Diagnostic Questionnaire — lumbar stenosis)
 *  - Smart 2012, Nijs 2014 (mechanism-based classification, sensibilisation centrale)
 *  - Décary 2017 (raisonnement diagnostique kiné, accès direct)
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
        label: "Trauma aigu identifié (chute, AVP)",
      },
      {
        id: "lifting_episode",
        label: "Effort de soulèvement / port de charge identifié",
      },
      {
        id: "progressive",
        label: "Progressif (semaines)",
      },
      { id: "insidious", label: "Insidieux (sans cause claire)" },
      {
        id: "post_pregnancy",
        label: "Après une grossesse / accouchement",
      },
      {
        id: "fall_buttocks",
        label: "Chute sur les fesses / coccyx",
      },
    ],
  },
  {
    id: "location",
    category: "character",
    prompt: "Où se localise la douleur principalement ?",
    importance: 3,
    multi: true,
    choices: [
      {
        id: "central_lumbar",
        label: "Lombaire central (rachis médian)",
      },
      {
        id: "paramedian_lumbar",
        label: "Lombaire para-médiane (à côté du rachis)",
      },
      {
        id: "lateral_lumbar_unilateral",
        label: "Latéralisée unilatérale (un seul côté)",
      },
      {
        id: "sij_buttock",
        label: "Fesse / sacro-iliaque (sous L5-S1)",
      },
      {
        id: "coccyx",
        label: "Coccyx / sacro-coccygien (très bas, médian)",
      },
      {
        id: "leg_above_knee",
        label: "Irradiation jambe — jusqu'au genou (cuisse)",
      },
      {
        id: "leg_below_knee",
        label: "Irradiation jambe — sous le genou (mollet/pied)",
        hint: "Évoque radiculopathie",
      },
      {
        id: "anterior_thigh",
        label: "Irradiation cuisse antérieure (face avant)",
        hint: "Évoque cruralgie L2-L4",
      },
      {
        id: "bilateral_legs",
        label: "Irradiation aux deux jambes",
        hint: "Évoque sténose canalaire",
      },
    ],
  },
  {
    id: "character",
    category: "character",
    prompt: "Caractère de la douleur ?",
    importance: 2,
    choices: [
      { id: "mechanical", label: "Mécanique — à l'effort, repos soulageant" },
      {
        id: "morning_stiff_short",
        label: "Raideur matinale courte (< 30 min) puis mécanique",
      },
      {
        id: "burning_radicular",
        label: "Brûlure / décharge dans la jambe",
        hint: "Évoque radiculopathie",
      },
      {
        id: "paresthesias",
        label: "Paresthésies / engourdissements dans la jambe",
      },
      {
        id: "throbbing_constant",
        label: "Douleur diffuse, constante, mal localisée",
        hint: "Évoque composante centrale",
      },
      {
        id: "stabbing_localized",
        label: "Douleur en coup de poignard, bien localisée",
      },
    ],
  },
  {
    id: "valsalva",
    category: "character",
    prompt: "La douleur est-elle reproduite par toux / éternuement / Valsalva ?",
    importance: 2,
    choices: [
      {
        id: "valsalva_radiates",
        label: "Oui — irradiation dans la jambe à la toux",
        hint: "Très évocateur de radiculopathie",
      },
      {
        id: "valsalva_local",
        label: "Oui — mais douleur lombaire seulement",
      },
      { id: "valsalva_no", label: "Non" },
      { id: "valsalva_unsure", label: "Pas sûr / pas testé" },
    ],
  },
  {
    id: "neuro_deficit",
    category: "character",
    prompt: "Déficit perçu (force / sensibilité) dans la jambe ?",
    importance: 3,
    multi: true,
    choices: [
      {
        id: "weakness_foot",
        label: "Pied qui « accroche » / chute du pied",
        hint: "L5",
      },
      {
        id: "weakness_calf",
        label: "Difficulté à monter sur la pointe d'un pied",
        hint: "S1",
      },
      {
        id: "weakness_quad",
        label: "Difficulté à monter un escalier (cuisse faible)",
        hint: "L3-L4",
      },
      { id: "numbness_dermatome", label: "Hypoesthésie / engourdissement" },
      { id: "no_neuro_deficit", label: "Aucun déficit perçu" },
    ],
  },
  {
    id: "aggravators",
    category: "modifiers",
    prompt: "Qu'est-ce qui aggrave la douleur ?",
    importance: 3,
    multi: true,
    choices: [
      { id: "flexion", label: "Flexion (se pencher en avant)" },
      { id: "extension", label: "Extension (cambrer / se pencher en arrière)" },
      { id: "rotation", label: "Rotation du tronc" },
      {
        id: "prolonged_standing",
        label: "Station debout prolongée",
      },
      { id: "prolonged_walking", label: "Marche prolongée" },
      { id: "prolonged_sitting", label: "Position assise prolongée" },
      { id: "lifting_load", label: "Port de charges" },
      { id: "transitions", label: "Transitions debout-assis / nuit" },
      {
        id: "single_leg_stand",
        label: "Position en appui sur une jambe",
        hint: "Cible SIJ",
      },
      {
        id: "sitting_coccyx",
        label: "Position assise sur surface dure (douleur très localisée)",
      },
    ],
  },
  {
    id: "relievers",
    category: "modifiers",
    prompt: "Qu'est-ce qui soulage ?",
    importance: 2,
    multi: true,
    choices: [
      {
        id: "flexion_relieves",
        label: "Flexion / position assise penchée en avant",
        hint: "Évoque sténose",
      },
      {
        id: "extension_relieves",
        label: "Extension / position couchée sur le ventre",
        hint: "Évoque préférence directionnelle extension",
      },
      {
        id: "walking_relieves",
        label: "Marche / mouvement",
      },
      { id: "rest_relieves", label: "Repos" },
      { id: "lying_down_relieves", label: "Position couchée" },
      { id: "nothing_relieves", label: "Rien ne soulage vraiment" },
    ],
  },
  {
    id: "claudication",
    category: "modifiers",
    prompt: "Comportement à la marche ?",
    importance: 2,
    choices: [
      {
        id: "neurogenic_claudication",
        label: "Douleur jambe(s) à la marche, soulagée en se penchant en avant ou en s'asseyant",
        hint: "Très évocatrice de sténose canalaire",
      },
      {
        id: "lbp_aggravated_walking",
        label: "Lombaire qui s'aggrave à la marche, mais pas de douleur jambe",
      },
      { id: "walking_no_change", label: "Pas particulièrement modifiée" },
      { id: "walking_relieves_pain", label: "Marche soulage" },
    ],
  },
  {
    id: "centralization_test",
    category: "modifiers",
    prompt:
      "Test de centralisation — comportement de la douleur jambe lors de répétitions d'extensions lombaires (couché ventre, push-up partiel) ?",
    importance: 3,
    choices: [
      {
        id: "centralizes",
        label: "Centralise (la douleur jambe diminue / remonte vers le rachis)",
        hint: "Préférence directionnelle extension — McKenzie",
      },
      {
        id: "peripheralizes",
        label: "Périphéralise (douleur descend dans la jambe)",
      },
      {
        id: "no_change",
        label: "Pas de changement",
      },
      {
        id: "centralizes_flexion",
        label: "Centralise plutôt en flexion / position assise",
      },
      { id: "untested", label: "Non testé" },
    ],
  },
  {
    id: "duration",
    category: "history",
    prompt: "Durée d'évolution ?",
    importance: 2,
    choices: [
      { id: "lt2w", label: "< 2 semaines (aigu)" },
      { id: "2_6w", label: "2-6 semaines" },
      { id: "6_12w", label: "6-12 semaines (subaigu)" },
      { id: "gt12w", label: "> 12 semaines (chronique)" },
      { id: "recurring", label: "Récidive (≥ 3 épisodes)" },
    ],
  },
  {
    id: "central_signs",
    category: "character",
    prompt:
      "Signes évocateurs de sensibilisation centrale (Smart 2012 / Nijs 2014) ?",
    importance: 2,
    multi: true,
    choices: [
      {
        id: "css_disproportionate",
        label: "Douleur disproportionnée par rapport au tableau clinique",
      },
      {
        id: "css_inconsistent",
        label: "Provocation de la douleur incohérente / non reproductible",
      },
      {
        id: "css_widespread",
        label: "Distribution diffuse / non anatomique",
      },
      {
        id: "css_high_yellow_flags",
        label: "Charge psychosociale forte (kinésiophobie, catastrophisme)",
      },
      {
        id: "css_sleep_disturbance",
        label: "Sommeil très perturbé par la douleur",
      },
      {
        id: "css_other_pain_sites",
        label: "Autres sites douloureux concomitants",
      },
      { id: "css_none", label: "Aucun de ces signes" },
    ],
  },
  {
    id: "activity_profile",
    category: "history",
    prompt: "Profil d'activité ?",
    importance: 1,
    choices: [
      { id: "sedentary", label: "Sédentaire" },
      { id: "office_worker", label: "Employé de bureau / position assise +++" },
      {
        id: "manual_worker",
        label: "Travail manuel / port de charges",
      },
      {
        id: "rotation_sport",
        label: "Sport rotation / hyperextension (golf, gymnastique, danse)",
      },
      { id: "leisure_sport", label: "Sportif loisir" },
      { id: "high_level_athlete", label: "Sportif compétition" },
    ],
  },
  {
    id: "demographics",
    category: "history",
    prompt: "Profil démographique ?",
    importance: 2,
    multi: true,
    choices: [
      { id: "age_under25", label: "< 25 ans" },
      { id: "age_25_45", label: "25-45 ans" },
      { id: "age_45_65", label: "45-65 ans" },
      { id: "age_over65", label: "> 65 ans" },
      { id: "female_postpartum", label: "Femme post-partum (< 12 mois)" },
      { id: "overweight", label: "IMC > 25" },
    ],
  },
  {
    id: "history_lumbar",
    category: "history",
    prompt: "ATCD pertinents au niveau du rachis lombaire ?",
    importance: 1,
    multi: true,
    choices: [
      {
        id: "previous_lbp_episodes",
        label: "Épisodes lombalgiques antérieurs",
      },
      {
        id: "previous_sciatica",
        label: "Sciatique / radiculopathie déjà connue",
      },
      {
        id: "spondylolisthesis_known",
        label: "Spondylolisthésis déjà diagnostiqué",
      },
      {
        id: "previous_back_surgery",
        label: "Chirurgie rachis antérieure",
      },
      {
        id: "chronic_pain_history",
        label: "ATCD de douleur chronique (autre site, fibromyalgie)",
      },
      { id: "no_history", label: "Pas d'ATCD significatif" },
    ],
  },
];

const tests: ClinicalTest[] = [
  {
    id: "slr",
    name: "SLR / Lasègue test",
    procedure:
      "Patient en décubitus dorsal. Élévation passive du membre inférieur, jambe tendue.",
    positiveMeans:
      "Reproduction d'une douleur radiculaire dans la jambe (sous le genou) entre 30° et 70° — évoque irritation radiculaire L4-S1.",
    diagnosticAccuracy:
      "Sn ≈ 80-90% · Sp modeste — peu spécifique isolé (Hancock 2007, Verwoerd 2013).",
  },
  {
    id: "crossed_slr",
    name: "Crossed SLR (Lasègue croisé)",
    procedure:
      "Élévation passive de la jambe NON douloureuse — observer la jambe douloureuse.",
    positiveMeans:
      "Reproduction de la douleur radiculaire dans la jambe douloureuse — évoque hernie discale (souvent volumineuse).",
    diagnosticAccuracy:
      "Sp ≈ 90% pour hernie discale symptomatique (Verwoerd 2013).",
  },
  {
    id: "slump",
    name: "Slump test",
    procedure:
      "Patient assis bord de table, slump (cyphose globale + flexion cervicale + extension genou + dorsiflexion). Lever le slump cervical pour confirmer.",
    positiveMeans:
      "Reproduction de la douleur radiculaire qui diminue à la levée de la flexion cervicale — évoque tension neurale / radiculopathie.",
    diagnosticAccuracy:
      "Sn ≈ 84% · Sp ≈ 83% (Walton 2012) — meilleure sensibilité que SLR.",
  },
  {
    id: "femoral_nerve_stretch",
    name: "Femoral nerve stretch (cruralgie)",
    procedure:
      "Patient en décubitus ventral. Flexion passive du genou ± extension de hanche.",
    positiveMeans:
      "Reproduction d'une douleur cuisse antérieure / inguinale — évoque radiculopathie L2-L4.",
  },
  {
    id: "centralization_repeated_extension",
    name: "Centralisation aux extensions répétées (McKenzie)",
    procedure:
      "Patient en décubitus ventral, push-up partiel (extension lombaire) répété 10 fois ; observer le comportement de la douleur jambe.",
    positiveMeans:
      "La douleur jambe centralise (remonte) ou diminue — préférence directionnelle en extension. Forte valeur pronostique (Werneke 2018).",
  },
  {
    id: "active_slr",
    name: "Active SLR (ASLR)",
    procedure:
      "Patient en décubitus dorsal. Élévation active du membre inférieur de 20 cm, demander difficulté de 0 à 5.",
    positiveMeans:
      "Difficulté > 0 reproduite — évoque dysfonction de transmission de charge sacro-iliaque (notamment post-partum) ou troubles du contrôle moteur.",
  },
  {
    id: "laslett_cluster",
    name: "Cluster de Laslett (sacro-iliaque)",
    procedure:
      "Réaliser ≥ 3 des 5 tests SIJ : Distraction, Compression, Thigh thrust, Gaenslen, Sacral thrust.",
    positiveMeans:
      "≥ 3 tests sur 5 positifs — évoque douleur sacro-iliaque (Laslett 2005).",
    diagnosticAccuracy:
      "Sn 91% · Sp 78% pour la douleur SIJ confirmée par bloc anesthésique.",
  },
  {
    id: "kemp_test",
    name: "Kemp test / Quadrant lombaire",
    procedure:
      "Patient debout. Extension + inclinaison + rotation lombaire homolatérale, pression vers le bas.",
    positiveMeans:
      "Reproduction de la douleur lombaire localisée — évoque atteinte facetaire homolatérale.",
  },
  {
    id: "prone_instability",
    name: "Prone instability test (Hicks)",
    procedure:
      "Patient en procubitus, jambes au sol. Pression PA sur les épineuses lombaires (douloureuse). Patient soulève les jambes (active extension), répéter la pression.",
    positiveMeans:
      "Douleur présente jambes au sol, ABOLIE jambes soulevées — évoque instabilité lombaire bénéficiant d'un travail de stabilisation (Hicks 2005).",
  },
  {
    id: "coccyx_palpation",
    name: "Palpation / mobilisation coccygienne",
    procedure:
      "Palpation directe du coccyx (sacro-coccygien et inter-coccygiens), parfois mobilisation prudente.",
    positiveMeans:
      "Douleur très précise et reproductible sur le coccyx, parfois mobilité douloureuse — évoque coccygodynie.",
  },
];

const pathologies: PathologyCandidate[] = [
  {
    id: "non_specific_lbp",
    name: "Lombalgie commune mécanique",
    shortName: "LBP non-spécifique",
    prevalence: "common",
    summary:
      "Lombalgie sans signature radiculaire ni drapeau rouge — la grande majorité (~85-90%) des lombalgies en accès direct (Maher 2017, Lancet 2018). PEC de 1ère ligne : exercice, éducation, activité progressive (NICE NG59).",
    hallmarks: [
      "Douleur lombaire mécanique, sans irradiation au-delà du genou",
      "Pas de déficit neurologique",
      "Évolution favorable spontanée chez la majorité",
      "Aucun signe de centralisation forte ni cluster spécifique",
    ],
    questionSignatures: {
      onset: {
        lifting_episode: 1,
        progressive: 1,
        insidious: 2,
        trauma_acute: 0,
      },
      location: {
        central_lumbar: 2,
        paramedian_lumbar: 2,
        lateral_lumbar_unilateral: 1,
        leg_above_knee: 0,
        leg_below_knee: -2,
        bilateral_legs: -2,
        coccyx: -2,
        anterior_thigh: -2,
      },
      character: {
        mechanical: 2,
        morning_stiff_short: 1,
        burning_radicular: -2,
        throbbing_constant: -1,
      },
      valsalva: { valsalva_no: 1, valsalva_radiates: -2 },
      neuro_deficit: { no_neuro_deficit: 2, weakness_foot: -2, weakness_calf: -2 },
      aggravators: {
        flexion: 1,
        extension: 1,
        rotation: 1,
        prolonged_sitting: 1,
        lifting_load: 1,
      },
      claudication: { walking_no_change: 1, neurogenic_claudication: -3 },
      duration: { lt2w: 1, "2_6w": 1, "6_12w": 1 },
      central_signs: { css_none: 1 },
    },
    testSignatures: {
      slr: { positive: -2, negative: 1 },
      crossed_slr: { positive: -2 },
      slump: { positive: -1 },
      laslett_cluster: { positive: -2 },
      kemp_test: { positive: -1 },
    },
    management: {
      conservative: [
        "Éducation : lombalgie commune souvent bénigne, évolution favorable, pas d'imagerie systématique (NICE NG59)",
        "Exercice + activité physique progressive — pilier de la PEC (Foster 2018)",
        "Réassurance, lutte contre les fausses croyances (\"dos fragile\")",
        "Stratification du risque de chronicisation (STarT Back tool — Hill 2011)",
        "Adapter l'environnement (poste de travail, sommeil) sans alimenter la peur",
      ],
      followUp:
        "Réévaluation à 4-6 semaines. Si plateau / aggravation à 12 sem ou risque STarT Back élevé, intensifier la PEC (multidimensionnelle).",
      imaging: {
        modality: "Aucune imagerie de routine",
        urgency: "rare",
        rationale:
          "L'imagerie de routine est NON RECOMMANDÉE (NICE NG59, Choosing Wisely) — elle n'améliore pas les résultats et augmente le risque d'étiquetage iatrogène. Réservée aux drapeaux rouges (déjà screenés) ou échec > 6-12 sem avec atypie.",
      },
    },
    patientScript:
      "« D'après mon examen, vous avez une lombalgie commune — c'est la forme la plus fréquente, et bonne nouvelle, c'est aussi la plus accessible à la kiné. Le dos n'est pas fragile : on va le remettre en mouvement progressivement. La majorité des patients vont nettement mieux en 4 à 6 semaines avec un programme d'activité adapté, sans avoir besoin de radio ou d'IRM. »",
  },
  {
    id: "radiculopathy",
    name: "Radiculopathie / sciatique",
    shortName: "Radiculopathie",
    prevalence: "moderate",
    summary:
      "Compression / irritation radiculaire (L4-L5-S1 ++ ou L2-L4 pour cruralgie) avec douleur radiculaire ± déficit neurologique. La majorité s'améliore en 6-12 sem en conservateur (Konstantinou 2018).",
    hallmarks: [
      "Douleur radiculaire descendant SOUS le genou (L4-S1) ou cuisse antérieure (L2-L4)",
      "Aggravation à la toux / Valsalva",
      "Déficit moteur ou sensitif possible (territoire dermatomique)",
      "SLR / Slump positif, parfois Crossed SLR",
    ],
    questionSignatures: {
      onset: {
        lifting_episode: 2,
        progressive: 1,
        trauma_acute: 1,
        insidious: 1,
      },
      location: {
        leg_below_knee: 3,
        anterior_thigh: 2,
        leg_above_knee: 1,
        central_lumbar: 0,
        paramedian_lumbar: 1,
        bilateral_legs: -1,
      },
      character: {
        burning_radicular: 3,
        paresthesias: 2,
        mechanical: 0,
        stabbing_localized: 1,
      },
      valsalva: { valsalva_radiates: 3, valsalva_no: -1 },
      neuro_deficit: {
        weakness_foot: 3,
        weakness_calf: 3,
        weakness_quad: 2,
        numbness_dermatome: 2,
        no_neuro_deficit: -2,
      },
      aggravators: {
        prolonged_sitting: 1,
        flexion: 1,
        prolonged_standing: 0,
      },
      duration: { lt2w: 1, "2_6w": 1, "6_12w": 1 },
    },
    testSignatures: {
      slr: { positive: 2, negative: -2 },
      crossed_slr: { positive: 3 },
      slump: { positive: 2 },
      femoral_nerve_stretch: { positive: 2 },
      laslett_cluster: { positive: -2 },
      kemp_test: { positive: 0 },
      centralization_repeated_extension: { positive: 0 },
    },
    management: {
      conservative: [
        "Éducation : la majorité des sciatiques s'améliorent en 6-12 sem en conservateur, même avec hernie objectivée (Konstantinou 2018)",
        "Mobilisation neurodynamique progressive (selon tolérance)",
        "Tester la préférence directionnelle (centralisation aux extensions répétées — McKenzie)",
        "Activité physique adaptée, marche progressive",
        "PEC active dès que possible — éviter le repos prolongé",
        "Surveillance clinique du déficit moteur (réévaluation régulière de la force)",
      ],
      referral:
        "Avis MG / spé si déficit moteur progressif (drapeau rouge), syndrome queue de cheval (déjà screené au triage), ou échec ≥ 6-12 sem avec retentissement majeur (discussion infiltration / chir).",
      imaging: {
        modality: "IRM lombaire (rare, après 6-12 sem d'échec)",
        urgency: "rare",
        rationale:
          "Pas d'imagerie de routine. À demander si déficit progressif, échec conservateur ≥ 6-12 sem, OU avant décision chirurgicale (NICE NG59). Les anomalies discales sont fréquentes chez l'asymptomatique — l'image ne fait pas le diagnostic.",
      },
      followUp: "Réévaluation à 2-4 semaines puis 6 semaines.",
    },
    patientScript:
      "« Plusieurs éléments orientent vers une sciatique — irritation d'une racine nerveuse. C'est une pathologie qui a la réputation d'être grave, mais en réalité 70-80% des cas vont mieux en 6 à 12 semaines avec un programme actif. On va travailler la mobilité du nerf, la centralisation de la douleur si on a une bonne réponse en extension, et on va surveiller régulièrement la force. La chirurgie n'arrive que dans une minorité de cas. »",
  },
  {
    id: "lumbar_stenosis",
    name: "Sténose lombaire (claudication neurogène)",
    shortName: "Sténose lombaire",
    prevalence: "moderate",
    summary:
      "Rétrécissement du canal vertébral (central, latéral ou foraminal) provoquant une claudication neurogène : douleur ou faiblesse des MI à la marche, soulagée en position penchée en avant ou assise (Genevay 2010).",
    hallmarks: [
      "Patient > 60 ans typiquement",
      "Douleur ou lourdeur des MI déclenchée par la marche / station debout",
      "Soulagement en flexion lombaire (caddie sign — penché sur un caddie)",
      "Symptômes souvent bilatéraux",
    ],
    questionSignatures: {
      onset: { insidious: 3, progressive: 2, trauma_acute: -2 },
      location: {
        bilateral_legs: 3,
        leg_above_knee: 1,
        leg_below_knee: 2,
        central_lumbar: 1,
      },
      character: {
        burning_radicular: 1,
        paresthesias: 1,
        mechanical: 1,
      },
      claudication: {
        neurogenic_claudication: 3,
        lbp_aggravated_walking: 1,
        walking_no_change: -2,
      },
      aggravators: {
        prolonged_walking: 3,
        prolonged_standing: 2,
        extension: 2,
        flexion: -2,
      },
      relievers: {
        flexion_relieves: 3,
        extension_relieves: -2,
      },
      neuro_deficit: {
        weakness_foot: 1,
        weakness_calf: 1,
        numbness_dermatome: 1,
      },
      demographics: { age_45_65: 1, age_over65: 3, age_under25: -3 },
      duration: { gt12w: 2, "6_12w": 1, lt2w: -1 },
    },
    testSignatures: {
      slr: { positive: -1 },
      crossed_slr: { positive: -1 },
      centralization_repeated_extension: { positive: -2 },
      laslett_cluster: { positive: -2 },
    },
    management: {
      conservative: [
        "Éducation : pathologie chronique mais souvent gérable en conservateur (Slätis 2010)",
        "Programme orienté flexion (vélo, marche penchée, assouplissement extenseurs)",
        "Renforcement chaîne abdominale + fessiers + extenseurs progressifs",
        "Exposition graduelle à la marche, parfois canne ou aide initiale",
        "Adaptation du niveau d'activité selon distance de marche tolérée",
      ],
      referral:
        "Avis chir orthopédique si claudication < 100 m ET retentissement majeur sur l'autonomie ET échec conservateur > 6 mois. Pas d'urgence sauf déficit neuro progressif.",
      imaging: {
        modality: "IRM lombaire (à discuter)",
        urgency: "rare",
        rationale:
          "À demander si décision chirurgicale envisagée OU si tableau atypique. Pas indispensable pour démarrer la PEC kiné (clinique suffit pour le diagnostic fonctionnel).",
      },
      followUp: "Réévaluation à 6-12 semaines.",
    },
  },
  {
    id: "sij_pain",
    name: "Douleur sacro-iliaque",
    shortName: "Sacro-iliaque",
    prevalence: "moderate",
    summary:
      "Douleur d'origine sacro-iliaque, classiquement post-partum, post-trauma (chute fesses) ou post-effort asymétrique. Diagnostic clinique sur cluster de Laslett (≥ 3 tests SIJ positifs).",
    hallmarks: [
      "Douleur fessière unilatérale (sous L5-S1)",
      "Pointage du doigt sur le SIJ (Fortin finger sign)",
      "Aggravation en appui unilatéral, transitions",
      "Cluster Laslett positif",
      "Souvent post-partum ou post-trauma fessier",
    ],
    questionSignatures: {
      onset: {
        post_pregnancy: 3,
        fall_buttocks: 2,
        lifting_episode: 1,
        progressive: 1,
        insidious: 0,
      },
      location: {
        sij_buttock: 3,
        paramedian_lumbar: 1,
        leg_above_knee: 1,
        leg_below_knee: -2,
        coccyx: -1,
      },
      character: { mechanical: 2 },
      aggravators: {
        single_leg_stand: 3,
        transitions: 2,
        prolonged_standing: 1,
        prolonged_walking: 1,
      },
      demographics: { female_postpartum: 3, age_25_45: 1 },
      neuro_deficit: { no_neuro_deficit: 1 },
    },
    testSignatures: {
      laslett_cluster: { positive: 3, negative: -2 },
      slr: { positive: -1 },
      crossed_slr: { positive: -2 },
      kemp_test: { positive: 0 },
      active_slr: { positive: 1 },
      centralization_repeated_extension: { positive: -1 },
    },
    management: {
      conservative: [
        "Renforcement progressif des stabilisateurs lombo-pelviens (transverse, multifides, fessiers)",
        "Travail du contrôle moteur des transitions et de la chaîne postérieure",
        "Éducation : pathologie de transmission de charge, pas de fragilité structurelle",
        "Post-partum : adapter au timing physiologique, accompagner la récupération",
        "Réintégration sportive progressive selon tolérance",
      ],
      followUp: "Réévaluation à 6-8 semaines.",
      imaging: {
        modality: "Aucune imagerie de routine",
        urgency: "rare",
        rationale:
          "Diagnostic clinique. Imagerie réservée aux atypies (suspicion spondylarthrite — déjà screenée au triage RF, fracture sacrée).",
      },
    },
  },
  {
    id: "facet_joint_pain",
    name: "Syndrome facetaire lombaire",
    shortName: "Facetaire",
    prevalence: "moderate",
    summary:
      "Atteinte d'une articulation zygapophysaire (facetaire) — souvent unilatérale, mécanique, aggravée par extension + rotation homolatérale. Diagnostic difficile sans bloc anesthésique mais cluster clinique reproductible.",
    hallmarks: [
      "Douleur lombaire para-médiane unilatérale",
      "Aggravation en extension, rotation homolatérale, station debout",
      "Soulagement en flexion / position assise",
      "Pas d'irradiation sous le genou habituellement",
      "Kemp test positif",
    ],
    questionSignatures: {
      onset: {
        lifting_episode: 1,
        progressive: 2,
        insidious: 2,
        trauma_acute: 1,
      },
      location: {
        paramedian_lumbar: 2,
        lateral_lumbar_unilateral: 3,
        sij_buttock: 0,
        leg_above_knee: 0,
        leg_below_knee: -2,
      },
      character: { mechanical: 2, stabbing_localized: 1 },
      aggravators: {
        extension: 3,
        rotation: 2,
        prolonged_standing: 2,
        flexion: -1,
      },
      relievers: { flexion_relieves: 1, extension_relieves: -2 },
      activity_profile: {
        rotation_sport: 1,
        manual_worker: 1,
      },
      demographics: { age_25_45: 1, age_45_65: 2 },
      duration: { recurring: 1 },
    },
    testSignatures: {
      kemp_test: { positive: 3, negative: -1 },
      slr: { positive: -2 },
      crossed_slr: { positive: -2 },
      laslett_cluster: { positive: -1 },
      centralization_repeated_extension: { positive: -1 },
    },
    management: {
      conservative: [
        "Travail de la mobilité segmentaire (mobilisations spécifiques, exercices ciblés)",
        "Renforcement extenseurs lombaires + chaîne profonde",
        "Adaptation des activités provoquantes (extension, rotation chargée)",
        "Préférence directionnelle souvent en flexion-distraction",
      ],
      referral:
        "Avis MG / rhumato si récurrences invalidantes — discussion bloc anesthésique facetaire ou radiofréquence si confirmation.",
      imaging: {
        modality: "Aucune imagerie de routine",
        urgency: "rare",
        rationale:
          "Diagnostic clinique. Anomalies facetaires dégénératives très fréquentes chez l'asymptomatique — l'imagerie n'apporte rien à la PEC initiale.",
      },
      followUp: "Réévaluation à 6-8 semaines.",
    },
  },
  {
    id: "central_sensitization_lbp",
    name: "Lombalgie chronique avec sensibilisation centrale",
    shortName: "LBP nociplastique",
    prevalence: "common",
    summary:
      "Lombalgie persistante avec composante de sensibilisation centrale prédominante (Smart 2012, Nijs 2014) : douleur disproportionnée, distribution diffuse, charge psychosociale forte. Cible la PEC multidimensionnelle (CFT — O'Sullivan 2018).",
    hallmarks: [
      "Évolution > 12 semaines, souvent récurrente",
      "Douleur diffuse, parfois disproportionnée et incohérente",
      "Charge psychosociale forte (kinésiophobie, catastrophisme)",
      "Sommeil perturbé, parfois autres sites douloureux",
      "Faible réponse aux interventions structurelles",
    ],
    questionSignatures: {
      onset: { insidious: 1, progressive: 1, trauma_acute: -1 },
      location: {
        central_lumbar: 1,
        paramedian_lumbar: 1,
        leg_above_knee: 1,
        bilateral_legs: 1,
      },
      character: {
        throbbing_constant: 3,
        burning_radicular: 0,
        mechanical: -1,
      },
      central_signs: {
        css_disproportionate: 3,
        css_inconsistent: 3,
        css_widespread: 3,
        css_high_yellow_flags: 3,
        css_sleep_disturbance: 2,
        css_other_pain_sites: 2,
        css_none: -3,
      },
      duration: { gt12w: 3, recurring: 2, lt2w: -3 },
      history_lumbar: {
        chronic_pain_history: 2,
        previous_lbp_episodes: 1,
      },
      aggravators: { transitions: 1 },
    },
    testSignatures: {
      slr: { positive: 0 },
      crossed_slr: { positive: -1 },
      laslett_cluster: { positive: -1 },
      kemp_test: { positive: 0 },
    },
    management: {
      conservative: [
        "Éducation à la neurophysiologie de la douleur (PNE — pain neuroscience education, Louw 2016)",
        "Approche multidimensionnelle (Cognitive Functional Therapy — O'Sullivan 2018)",
        "Activité graduée + exposition progressive aux mouvements évités",
        "Travail des facteurs cognitifs (catastrophisme, kinésiophobie) — relier au yellow flags screener",
        "Co-construction d'objectifs fonctionnels significatifs pour le patient",
        "Hygiène de sommeil, gestion du stress",
      ],
      referral:
        "Approche pluridisciplinaire utile : MG, psychologue de la douleur, parfois centre antalgique si retentissement majeur.",
      imaging: {
        modality: "Aucune imagerie",
        urgency: "rare",
        rationale:
          "L'imagerie est CONTRE-INDIQUÉE en routine dans ce contexte (Lancet 2018) — risque iatrogène majeur d'étiquetage et d'aggravation.",
      },
      followUp:
        "Suivi pluriannuel possible. Indicateurs de progrès = fonction et activité, pas seulement douleur.",
    },
    patientScript:
      "« Votre douleur dure depuis longtemps et a plusieurs caractéristiques qui orientent vers une sensibilité accrue du système nerveux à la douleur — pas un dommage structurel actif. C'est une situation très étudiée en kiné moderne, avec des approches qui combinent éducation, activité progressive et travail sur les facteurs qui entretiennent la douleur. C'est plus long, mais on peut sortir de cette spirale. »",
  },
  {
    id: "spondylolisthesis",
    name: "Spondylolisthésis isthmique symptomatique",
    shortName: "Spondylolisthésis",
    prevalence: "rare",
    summary:
      "Glissement vertébral antérieur (le plus souvent L5-S1, parfois L4-L5) sur lyse isthmique — adolescent sportif (sports d'hyperextension) ou adulte avec lyse ancienne devenue symptomatique. Tableau souvent extension+, parfois irradiation radiculaire associée.",
    hallmarks: [
      "Adolescent sportif (gym, danse, plongeon, lancer) OU patient avec lyse connue",
      "Lombalgie aggravée en extension / hyperextension",
      "Parfois marche dandinante chez l'enfant",
      "Glissement palpable sur les épineuses (step-off sign)",
    ],
    questionSignatures: {
      onset: {
        progressive: 2,
        insidious: 1,
        trauma_acute: 0,
      },
      location: {
        central_lumbar: 2,
        paramedian_lumbar: 1,
        leg_above_knee: 1,
        leg_below_knee: 1,
      },
      character: { mechanical: 2 },
      aggravators: {
        extension: 3,
        rotation: 1,
        prolonged_standing: 1,
        prolonged_walking: 1,
        flexion: -1,
      },
      activity_profile: {
        rotation_sport: 3,
        high_level_athlete: 2,
      },
      demographics: { age_under25: 2, age_25_45: 1 },
      history_lumbar: {
        spondylolisthesis_known: 3,
      },
    },
    testSignatures: {
      kemp_test: { positive: 1 },
      prone_instability: { positive: 1 },
      slr: { positive: 0 },
    },
    management: {
      conservative: [
        "Éviter temporairement les positions / sports à hyperextension (lyse aiguë adolescent)",
        "Renforcement chaîne profonde (multifides, transverse, obliques) — Hicks 2005",
        "Travail du contrôle moteur en flexion privilégiée",
        "Réintégration sportive progressive avec contrôle technique",
        "Adolescent : surveillance clinique + parfois corset selon avis spé",
      ],
      referral:
        "Avis chir orthopédique / rhumato pédiatrique chez l'adolescent OU si glissement progressif / radiculopathie associée résistante.",
      imaging: {
        modality: "Radiographie standard ± IRM",
        urgency: "soonish",
        rationale:
          "Confirme la lyse / le glissement (incidence + profil debout). IRM si suspicion d'œdème osseux (lyse aiguë adolescent) ou de radiculopathie associée.",
      },
      followUp: "Réévaluation à 6-12 semaines.",
    },
  },
  {
    id: "coccygodynia",
    name: "Coccygodynie",
    shortName: "Coccygodynie",
    prevalence: "rare",
    summary:
      "Douleur localisée au coccyx, le plus souvent post-traumatique (chute fesses) ou post-partum, parfois insidieuse. Très spécifique cliniquement (pointage très précis sur le coccyx, douleur à la position assise sur surface dure).",
    hallmarks: [
      "Douleur très localisée au coccyx, le patient pointe précisément",
      "Position assise sur surface dure très douloureuse",
      "ATCD de chute sur les fesses ou accouchement difficile",
      "Palpation directe du coccyx reproduit la douleur",
    ],
    questionSignatures: {
      onset: {
        fall_buttocks: 3,
        post_pregnancy: 2,
        insidious: 1,
        trauma_acute: 1,
      },
      location: {
        coccyx: 3,
        sij_buttock: 0,
        central_lumbar: -2,
        paramedian_lumbar: -2,
        leg_above_knee: -2,
      },
      character: { stabbing_localized: 2, mechanical: 1 },
      aggravators: {
        sitting_coccyx: 3,
        prolonged_sitting: 2,
        transitions: 1,
        prolonged_standing: -1,
      },
      demographics: { female_postpartum: 1 },
    },
    testSignatures: {
      coccyx_palpation: { positive: 3, negative: -2 },
      laslett_cluster: { positive: -2 },
      slr: { positive: -2 },
      kemp_test: { positive: -2 },
    },
    management: {
      conservative: [
        "Adaptation de la position assise : coussin troué / en U, redistribution de pression",
        "Mobilisations coccygiennes prudentes (interne ou externe selon formation)",
        "Renforcement périnée + chaîne postérieure",
        "Étirement piriforme et plancher pelvien si tension associée",
        "Patience : évolution souvent longue (3-6 mois)",
      ],
      referral:
        "Avis MG / rhumato pour discussion infiltration locale (cortisone) si plateau ≥ 3-6 mois.",
      imaging: {
        modality: "Radiographie dynamique (rare)",
        urgency: "rare",
        rationale:
          "Radiographie dynamique (assise debout) si chronicité et discussion d'infiltration ou rare coccygectomie. Pas indispensable d'emblée.",
      },
      followUp: "Réévaluation à 6 semaines.",
    },
  },
];

export const lumbarModule: DeepAssessmentModule = {
  zone: "lumbar",
  title: "Évaluation approfondie — rachis lombaire",
  scope:
    "Adulte, lombalgie ou lombo-sciatique sans drapeau rouge (post-triage RF). Couvre 8 hypothèses cliniques fréquentes en accès direct kiné, dans un cadre conceptuel moderne (Lancet LBP 2018, NICE NG59) qui évite le sur-diagnostic structurel.",
  questions,
  tests,
  pathologies,
};
