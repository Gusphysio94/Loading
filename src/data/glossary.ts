export type GlossaryEntry = {
  term: string;
  definition: string;
};

export const glossary: Record<string, GlossaryEntry> = {
  eva: {
    term: "EVA",
    definition:
      "Échelle Visuelle Analogique. Évalue l'intensité de la douleur de 0 (aucune) à 10 (insupportable). Le seuil de 4/10 sépare une douleur tolérable d'une douleur qui doit faire moduler la charge.",
  },
  "allure-fondamentale": {
    term: "Allure fondamentale",
    definition:
      "Allure aérobie facile, à laquelle on peut tenir une conversation. ~ 65-75 % de la FC max, intensité que l'on peut soutenir confortablement plusieurs dizaines de minutes.",
  },
  "d-plus": {
    term: "D+",
    definition:
      "Dénivelé positif cumulé d'une sortie. Augmenter le D+ augmente la contrainte excentrique sur les structures musculo-tendineuses.",
  },
  "drapeau-rouge": {
    term: "Drapeau rouge",
    definition:
      "Signe clinique faisant suspecter une pathologie sérieuse (vasculaire, néoplasique, infectieuse, neurologique). En présence d'un drapeau rouge, le raisonnement gestion de charge n'est pas adapté — orienter vers un avis médical.",
  },
};
