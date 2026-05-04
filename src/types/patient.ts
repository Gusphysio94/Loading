export type Chronicity = "aigu" | "subaigu" | "chronique";

export type PatientContext = {
  initials?: string;
  location?: string;
  chronicity?: Chronicity;
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
