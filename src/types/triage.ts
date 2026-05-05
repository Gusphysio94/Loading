/**
 * Triage musculo-squelettique en accès direct.
 *
 * Référentiels :
 *  - Finucane 2020 — IFOMPT International Framework for Red Flags (Spine)
 *  - Greenhalgh & Selfe 2010 — Red Flags I & II
 *  - Sizer 2007 — Medical Screening Checklists
 *  - NICE NG59 (lombalgie + sciatique) / NG12 (cancer suspected)
 *  - Cook 2018 — Red flags spine
 *  - Davenport 2017 — Cervical artery dysfunction guideline
 *
 * Le présent module fournit :
 *  - une liste de 9 zones de triage cliniquement pertinentes,
 *  - une liste de RF universels (présents quelle que soit la zone),
 *  - une liste de RF spécifiques par zone (avec source / pathologie suspectée).
 */

export type TriageZone =
  | "head_neck"
  | "thoracic"
  | "lumbar"
  | "shoulder"
  | "elbow_arm"
  | "wrist_hand"
  | "hip_pelvis"
  | "knee_thigh"
  | "ankle_foot";

export const triageZoneLabels: Record<TriageZone, string> = {
  head_neck: "Tête / cou",
  thoracic: "Rachis dorsal",
  lumbar: "Rachis lombaire / bassin postérieur",
  shoulder: "Épaule",
  elbow_arm: "Coude / bras",
  wrist_hand: "Poignet / main",
  hip_pelvis: "Hanche / bassin",
  knee_thigh: "Genou / cuisse",
  ankle_foot: "Cheville / pied",
};

export const triageZoneShort: Record<TriageZone, string> = {
  head_neck: "Cou",
  thoracic: "Dorsal",
  lumbar: "Lombaire",
  shoulder: "Épaule",
  elbow_arm: "Coude",
  wrist_hand: "Poignet",
  hip_pelvis: "Hanche",
  knee_thigh: "Genou",
  ankle_foot: "Cheville",
};

export type RedFlagSeverity = "critical" | "warning";

export type TriageRedFlag = {
  id: string;
  /** Question telle que posée au kiné. */
  label: string;
  /** Pathologie / cluster suspect — guide l'orientation. */
  suspect: string;
  /** Détail / éléments diagnostiques associés. */
  detail?: string;
  severity: RedFlagSeverity;
  /** Si présent, oriente vers cette structure (urgences vs MG / spé). */
  referral?: "urgent" | "physician" | "specialist";
};

export type ZoneRedFlagSet = {
  zone: TriageZone;
  /** Titre court affiché en tête de la section. */
  groupTitle: string;
  flags: TriageRedFlag[];
};

export type TriageOutcome = "clear" | "flagged";

export type TriageStatus = {
  /** ISO date string when the triage was performed. */
  date: string;
  /** Zones screenées lors de cette session. */
  zones: TriageZone[];
  outcome: TriageOutcome;
  /** Liste d'IDs de RF déclenchés (vide si clear). */
  flaggedIds: string[];
  /** Présence d'au moins un RF "critical" (oriente urgences). */
  hasCritical: boolean;
};

/** Compute global outcome from a set of flag ids + dictionary. */
export function summarizeOutcome(
  flaggedIds: string[],
  byId: Record<string, TriageRedFlag>,
): { outcome: TriageOutcome; hasCritical: boolean } {
  if (flaggedIds.length === 0) return { outcome: "clear", hasCritical: false };
  const hasCritical = flaggedIds.some((id) => byId[id]?.severity === "critical");
  return { outcome: "flagged", hasCritical };
}
