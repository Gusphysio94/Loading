import type {
  TriageRedFlag,
  TriageZone,
  ZoneRedFlagSet,
} from "../types/triage";

/**
 * Drapeaux rouges UNIVERSELS — à passer en revue quelle que soit la zone.
 * Sources : IFOMPT 2020, Greenhalgh & Selfe 2010, Cook 2018, NICE NG59.
 */
export const universalRedFlags: TriageRedFlag[] = [
  {
    id: "u_cancer_history",
    label: "Antécédent personnel de cancer (≤ 5 ans, ou évolutif)",
    suspect: "Métastase / récidive néoplasique",
    detail: "Penser sein, poumon, prostate, rein, thyroïde (sites métastatiques rachidiens fréquents).",
    severity: "critical",
    referral: "physician",
  },
  {
    id: "u_unexplained_weight_loss",
    label: "Perte de poids inexpliquée (> 5% en 1 mois ou > 10% en 6 mois)",
    suspect: "Néoplasie / pathologie systémique",
    severity: "critical",
    referral: "physician",
  },
  {
    id: "u_night_pain_unrelenting",
    label: "Douleur nocturne incoercible, non soulagée par la position",
    suspect: "Néoplasie / infection / pathologie viscérale",
    detail: "À distinguer de la douleur mécanique exacerbée par certaines postures.",
    severity: "warning",
    referral: "physician",
  },
  {
    id: "u_fever",
    label: "Fièvre, sueurs nocturnes, frissons",
    suspect: "Infection (spondylodiscite, arthrite septique, ostéomyélite)",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "u_immunosuppression",
    label: "Immunodépression (corticoïdes au long cours, VIH, chimio, transplant)",
    suspect: "Surrisque infectieux et néoplasique",
    severity: "warning",
    referral: "physician",
  },
  {
    id: "u_iv_drug_use",
    label: "Usage IV de drogues / toxicomanie active",
    suspect: "Spondylodiscite, endocardite",
    severity: "warning",
    referral: "physician",
  },
  {
    id: "u_major_trauma",
    label: "Trauma majeur récent (chute hauteur, AVP, choc haute énergie)",
    suspect: "Fracture occulte, lésion ligamentaire grave, hématome",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "u_minor_trauma_osteoporosis",
    label: "Trauma mineur sur terrain ostéoporotique / > 50 ans / corticothérapie",
    suspect: "Fracture par insuffisance osseuse",
    detail: "Une simple chute de sa hauteur peut suffire chez le sujet à risque.",
    severity: "warning",
    referral: "physician",
  },
  {
    id: "u_progressive_neuro",
    label: "Déficit neurologique progressif (faiblesse, hypoesthésie qui s'étend)",
    suspect: "Compression médullaire / radiculaire évolutive",
    severity: "critical",
    referral: "urgent",
  },
];

/**
 * Drapeaux rouges SPÉCIFIQUES par zone.
 * Cluster construit pour minimiser les faux négatifs en accès direct kiné.
 */
const headNeckFlags: TriageRedFlag[] = [
  {
    id: "n_5d3n",
    label: "Au moins un des « 5D 3N » : Drop attack, Diplopie, Dysarthrie, Dysphagie, Drop / Nystagmus, Nausée, Numbness facial",
    suspect: "Insuffisance vertébro-basilaire / dissection artérielle cervicale",
    detail: "Davenport 2017 — toute combinaison impose un avis urgent avant manipulation.",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "n_horner",
    label: "Ptosis + myosis + anhidrose unilatéraux (syndrome de Horner)",
    suspect: "Dissection carotidienne, Pancoast",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "n_thunderclap",
    label: "Céphalée brutale en coup de tonnerre / la pire de la vie",
    suspect: "Hémorragie sous-arachnoïdienne",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "n_meningismus",
    label: "Raideur de nuque + fièvre + photophobie",
    suspect: "Méningite",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "n_myelopathy",
    label: "Signes de myélopathie cervicale : maladresse fine des mains, démarche hésitante, Hoffman / Babinski",
    suspect: "Compression médullaire cervicale",
    severity: "critical",
    referral: "specialist",
  },
  {
    id: "n_bilateral_uloss",
    label: "Paresthésies bilatérales aux 4 membres / sensation de décharge en flexion (Lhermitte)",
    suspect: "Atteinte médullaire cervicale",
    severity: "critical",
    referral: "specialist",
  },
  {
    id: "n_instability_signs",
    label: "Trauma cervical récent + crépitation, sensation d'instabilité, douleur à la palpation des épineuses",
    suspect: "Fracture / instabilité cervicale (Canadian C-spine rules)",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "n_temporal_arteritis",
    label: "Patient > 50 ans, céphalée temporale + douleur mâchoire à la mastication ± troubles visuels",
    suspect: "Artérite temporale (Horton)",
    severity: "critical",
    referral: "urgent",
  },
];

const thoracicFlags: TriageRedFlag[] = [
  {
    id: "t_chest_pain_effort",
    label: "Douleur thoracique à l'effort, irradiation bras gauche / mâchoire, sueurs",
    suspect: "Syndrome coronarien aigu",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "t_dyspnea",
    label: "Dyspnée d'apparition récente, douleur thoracique pleurale, hémoptysie",
    suspect: "Embolie pulmonaire / pneumothorax",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "t_aortic",
    label: "Douleur dorsale brutale, déchirante, irradiant entre les omoplates ± syncope",
    suspect: "Dissection aortique",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "t_referred_visceral",
    label: "Douleur dorsale modulée par les repas, alcool, ou en lien avec une pathologie digestive",
    suspect: "Pathologie viscérale projetée (ulcère, pancréas, vésicule)",
    severity: "warning",
    referral: "physician",
  },
  {
    id: "t_thoracic_tenderness_osteo",
    label: "Patient > 60 ans + cyphose nouvelle / perte de taille + dorsalgie au moindre effort",
    suspect: "Fracture vertébrale par insuffisance",
    severity: "warning",
    referral: "physician",
  },
  {
    id: "t_ank_spond",
    label: "Raideur matinale > 30 min, amélioration à l'activité, < 45 ans, durée > 3 mois",
    suspect: "Spondylarthrite axiale",
    detail: "Critères ASAS — orientation rhumato.",
    severity: "warning",
    referral: "specialist",
  },
];

const lumbarFlags: TriageRedFlag[] = [
  {
    id: "l_cauda_equina",
    label: "Anesthésie en selle, rétention urinaire, incontinence sphinctérienne, dysfonction sexuelle récente",
    suspect: "Syndrome de la queue de cheval",
    detail: "Urgence chirurgicale dans les 48h — IRM en urgence.",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "l_bilateral_sciatica",
    label: "Sciatique bilatérale ou progression rapide d'un déficit neurologique",
    suspect: "Compression centrale, syndrome queue de cheval débutant",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "l_aaa",
    label: "Patient > 60 ans, lombalgie pulsatile ± masse abdominale battante, tabac, ATCD vasculaire",
    suspect: "Anévrisme aorte abdominale",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "l_fracture_age",
    label: "Lombalgie aiguë + chute (même mineure) chez sujet > 50 ans / ostéoporose connue / corticothérapie",
    suspect: "Fracture vertébrale",
    severity: "warning",
    referral: "physician",
  },
  {
    id: "l_inflammatory",
    label: "< 45 ans, douleur insidieuse, raideur matinale > 30 min, amélioration à l'activité, > 3 mois",
    suspect: "Spondylarthrite axiale",
    severity: "warning",
    referral: "specialist",
  },
  {
    id: "l_visceral",
    label: "Lombalgie liée aux mictions / cycle menstruel / non modulable par la posture",
    suspect: "Pathologie viscérale (rein, gynéco) projetée",
    severity: "warning",
    referral: "physician",
  },
  {
    id: "l_drop_foot",
    label: "Pied tombant / déficit moteur tronqué récent (L5, S1)",
    suspect: "Compression radiculaire significative",
    severity: "warning",
    referral: "physician",
  },
];

const shoulderFlags: TriageRedFlag[] = [
  {
    id: "s_locked_shoulder",
    label: "Épaule bloquée en rotation interne après luxation / trauma — déformation visible",
    suspect: "Luxation non réduite, fracture-luxation",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "s_septic",
    label: "Épaule rouge / chaude / impotence majeure + fièvre",
    suspect: "Arthrite septique",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "s_pancoast",
    label: "Tabagique chronique + douleur épaule + Horner / amyotrophie main",
    suspect: "Tumeur Pancoast (apex pulmonaire)",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "s_cardiac_referred",
    label: "Douleur épaule G déclenchée par effort, soulagée au repos, ± dyspnée",
    suspect: "Douleur projetée d'origine cardiaque",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "s_post_trauma_weakness",
    label: "Trauma épaule + déficit moteur ou sensitif persistant",
    suspect: "Lésion plexus brachial / nerveuse focale",
    severity: "warning",
    referral: "physician",
  },
  {
    id: "s_rapid_atrophy",
    label: "Amyotrophie rapide sus / sous-épineux sans cause mécanique",
    suspect: "Neuropathie sus-scapulaire / Parsonage-Turner",
    severity: "warning",
    referral: "specialist",
  },
];

const elbowArmFlags: TriageRedFlag[] = [
  {
    id: "e_compartment",
    label: "Douleur disproportionnée + tension musculaire + paresthésies / pâleur post-trauma",
    suspect: "Syndrome des loges",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "e_septic",
    label: "Coude rouge / chaud / impotence + fièvre",
    suspect: "Arthrite septique",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "e_supracondylar",
    label: "Trauma + déformation / impotence totale + paresthésies main",
    suspect: "Fracture supracondylienne ± lésion vasculo-nerveuse",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "e_neuropathy_progressive",
    label: "Faiblesse / amyotrophie progressive territoire ulnaire ou médian",
    suspect: "Neuropathie périphérique évolutive",
    severity: "warning",
    referral: "specialist",
  },
];

const wristHandFlags: TriageRedFlag[] = [
  {
    id: "w_scaphoid",
    label: "Chute main tendue + douleur tabatière anatomique persistante",
    suspect: "Fracture du scaphoïde (radio normale n'exclut pas)",
    severity: "warning",
    referral: "physician",
  },
  {
    id: "w_septic",
    label: "Articulation rouge / chaude / impotente + fièvre, ou plaie morsure",
    suspect: "Arthrite septique / phlegmon",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "w_crps",
    label: "Allodynie majeure + œdème + troubles vasomoteurs / sudoraux disproportionnés",
    suspect: "SDRC type I (CRPS)",
    severity: "warning",
    referral: "specialist",
  },
  {
    id: "w_ischemia",
    label: "Pâleur / cyanose / froideur unilatérale + douleur",
    suspect: "Ischémie aiguë / thrombose",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "w_motor_loss",
    label: "Perte de force significative récente (préhension effondrée) sans contexte mécanique",
    suspect: "Neuropathie compressive sévère / cervicale",
    severity: "warning",
    referral: "physician",
  },
];

const hipPelvisFlags: TriageRedFlag[] = [
  {
    id: "h_nof_fracture",
    label: "Sujet âgé / ostéoporotique + chute + impotence + raccourcissement-rotation externe du MI",
    suspect: "Fracture du col fémoral",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "h_septic",
    label: "Hanche rouge-chaude (ou simplement très douloureuse) + fièvre, surtout enfant",
    suspect: "Arthrite septique / ostéomyélite",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "h_avn",
    label: "Corticoïdes au long cours / éthylisme / drépanocytose + douleur inguinale + boiterie",
    suspect: "Ostéonécrose tête fémorale",
    severity: "warning",
    referral: "specialist",
  },
  {
    id: "h_slipped_femoral",
    label: "Adolescent en surpoids + boiterie + rotation externe + douleur genou ipsi",
    suspect: "Épiphysiolyse fémorale supérieure",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "h_stress_fracture",
    label: "Sportif / militaire / coureur — douleur d'effort progressive en charge, douleur nocturne",
    suspect: "Fracture de fatigue (col fémoral, branche pubienne)",
    severity: "warning",
    referral: "physician",
  },
  {
    id: "h_visceral_groin",
    label: "Douleur inguinale + symptômes urogénitaux / digestifs (testicule, hernie, gynéco)",
    suspect: "Pathologie viscérale projetée",
    severity: "warning",
    referral: "physician",
  },
];

const kneeThighFlags: TriageRedFlag[] = [
  {
    id: "k_dvt",
    label: "Mollet / cuisse œdématié unilatéral, chaud, douloureux, post-immobilisation / vol long",
    suspect: "Thrombose veineuse profonde",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "k_septic",
    label: "Genou très chaud / rouge / impotence majeure + fièvre",
    suspect: "Arthrite septique",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "k_locked_knee",
    label: "Genou bloqué en flexion ou extension, suite à twist ± hémarthrose",
    suspect: "Lésion ménisco-ligamentaire majeure / corps étranger",
    severity: "warning",
    referral: "physician",
  },
  {
    id: "k_ottawa",
    label: "Trauma + impossibilité de porter le poids 4 pas + douleur tête fibula / patella",
    suspect: "Fracture (Ottawa Knee Rules)",
    severity: "warning",
    referral: "physician",
  },
  {
    id: "k_compartment",
    label: "Post-trauma : douleur disproportionnée, tension du compartiment, paresthésies",
    suspect: "Syndrome des loges",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "k_stress_fracture_thigh",
    label: "Coureur / sportif endurance + douleur cuisse à l'effort, nocturne, progressive",
    suspect: "Fracture de fatigue fémorale",
    severity: "warning",
    referral: "physician",
  },
];

const ankleFootFlags: TriageRedFlag[] = [
  {
    id: "a_ottawa",
    label: "Trauma + impossibilité de porter le poids 4 pas + douleur malléole post / base 5e méta / scaphoïde",
    suspect: "Fracture (Ottawa Ankle / Foot Rules)",
    severity: "warning",
    referral: "physician",
  },
  {
    id: "a_dvt_calf",
    label: "Mollet unilatéral chaud, œdématié, douloureux, post-immobilisation / vol long",
    suspect: "Thrombose veineuse profonde",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "a_compartment",
    label: "Douleur disproportionnée jambe + tension + paresthésies / parésie pied",
    suspect: "Syndrome des loges",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "a_achilles_rupture",
    label: "Trauma brutal mollet, sensation de coup de fouet, Thompson positif",
    suspect: "Rupture du tendon d'Achille",
    severity: "warning",
    referral: "physician",
  },
  {
    id: "a_ischemia",
    label: "Pied froid, pâle, douleur de repos / nocturne, claudication, AOMI connue",
    suspect: "Ischémie de membre inférieur",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "a_septic_arthritis",
    label: "Articulation cheville / pied chaude rouge + fièvre + impotence",
    suspect: "Arthrite septique / cellulite",
    severity: "critical",
    referral: "urgent",
  },
  {
    id: "a_charcot",
    label: "Diabétique + œdème pied unilatéral chaud, sans plaie évidente",
    suspect: "Pied de Charcot",
    severity: "warning",
    referral: "specialist",
  },
];

export const zoneRedFlags: Record<TriageZone, ZoneRedFlagSet> = {
  head_neck: { zone: "head_neck", groupTitle: "Tête / cou — drapeaux rouges spécifiques", flags: headNeckFlags },
  thoracic: { zone: "thoracic", groupTitle: "Rachis dorsal — drapeaux rouges spécifiques", flags: thoracicFlags },
  lumbar: { zone: "lumbar", groupTitle: "Rachis lombaire — drapeaux rouges spécifiques", flags: lumbarFlags },
  shoulder: { zone: "shoulder", groupTitle: "Épaule — drapeaux rouges spécifiques", flags: shoulderFlags },
  elbow_arm: { zone: "elbow_arm", groupTitle: "Coude / bras — drapeaux rouges spécifiques", flags: elbowArmFlags },
  wrist_hand: { zone: "wrist_hand", groupTitle: "Poignet / main — drapeaux rouges spécifiques", flags: wristHandFlags },
  hip_pelvis: { zone: "hip_pelvis", groupTitle: "Hanche / bassin — drapeaux rouges spécifiques", flags: hipPelvisFlags },
  knee_thigh: { zone: "knee_thigh", groupTitle: "Genou / cuisse — drapeaux rouges spécifiques", flags: kneeThighFlags },
  ankle_foot: { zone: "ankle_foot", groupTitle: "Cheville / pied — drapeaux rouges spécifiques", flags: ankleFootFlags },
};

export const allRedFlagsById: Record<string, TriageRedFlag> = (() => {
  const map: Record<string, TriageRedFlag> = {};
  for (const f of universalRedFlags) map[f.id] = f;
  for (const z of Object.values(zoneRedFlags)) {
    for (const f of z.flags) map[f.id] = f;
  }
  return map;
})();

export const referralLabels: Record<NonNullable<TriageRedFlag["referral"]>, string> = {
  urgent: "Urgences / SAMU",
  physician: "Médecin traitant — sans délai",
  specialist: "Spécialiste (rhumato / neuro / chir)",
};
