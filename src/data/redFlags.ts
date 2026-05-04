export type RedFlag = {
  id: string;
  label: string;
  detail?: string;
};

/**
 * Drapeaux rouges musculo-squelettiques généraux à dépister avant de
 * raisonner en termes de gestion de charge. La présence d'un seul drapeau
 * rouge doit faire stopper l'évaluation et orienter vers un avis médical.
 */
export const redFlags: RedFlag[] = [
  {
    id: "night_pain",
    label: "Douleur nocturne réveillant le patient",
    detail: "Indépendante du mouvement, persistante.",
  },
  {
    id: "neuro",
    label: "Faiblesse motrice ou paresthésies",
    detail: "Déficit sensitif ou moteur, anesthésie en selle.",
  },
  {
    id: "systemic",
    label: "Fièvre, sueurs nocturnes ou perte de poids inexpliquée",
    detail: "Signes systémiques associés.",
  },
  {
    id: "cancer_history",
    label: "Antécédent de cancer",
    detail: "Surtout dans les 5 dernières années.",
  },
  {
    id: "trauma",
    label: "Trauma majeur récent",
    detail: "Chute, AVP, choc à haute énergie.",
  },
  {
    id: "thoracic",
    label: "Douleur thoracique ou dyspnée à l'effort",
    detail: "Suspect en course / sport.",
  },
  {
    id: "rapid_progression",
    label: "Aggravation rapide sur les dernières semaines",
    detail: "Sans facteur déclenchant identifié.",
  },
  {
    id: "vascular",
    label: "Signes vasculaires : œdème unilatéral, pied chaud / froid, marbrures",
    detail: "Suspicion thrombose / ischémie.",
  },
];
