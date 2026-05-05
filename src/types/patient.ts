export type Chronicity = "aigu" | "subaigu" | "chronique";

import type { PainAssessment, PainScore } from "./painType";

export type PatientContext = {
  initials?: string;
  location?: string;
  chronicity?: Chronicity;
  painAssessment?: PainAssessment;
  painScore?: PainScore;
};

export const chronicityLabels: Record<Chronicity, string> = {
  aigu: "Aigu (< 4 semaines)",
  subaigu: "Subaigu (4-12 semaines)",
  chronique: "Chronique (> 12 semaines)",
};

export const chronicityShort: Record<Chronicity, string> = {
  aigu: "Aigu",
  subaigu: "Subaigu",
  chronique: "Chronique",
};

export function hasContext(ctx: PatientContext | null | undefined): boolean {
  if (!ctx) return false;
  return !!(ctx.initials || ctx.location || ctx.chronicity);
}

/**
 * Adjusted EVA pain threshold based on chronicity (Silbernagel pain monitoring,
 * adapted by stage):
 *  - aigu (< 4 sem)        → 3/10 (plus prudent, tissu en phase inflammatoire)
 *  - subaigu (4-12 sem)    → 4/10 (seuil par défaut)
 *  - chronique (> 12 sem)  → 5/10 (tolère une douleur résiduelle modulée)
 */
export function evaThresholdFor(
  chronicity: Chronicity | undefined,
): number | undefined {
  if (!chronicity) return undefined;
  switch (chronicity) {
    case "aigu":
      return 3;
    case "subaigu":
      return 4;
    case "chronique":
      return 5;
  }
}

export function evaThresholdNote(
  chronicity: Chronicity | undefined,
): string | undefined {
  if (!chronicity) return undefined;
  switch (chronicity) {
    case "aigu":
      return "Seuil 3/10 — phase aiguë";
    case "subaigu":
      return "Seuil 4/10 — phase subaiguë";
    case "chronique":
      return "Seuil 5/10 — phase chronique";
  }
}
