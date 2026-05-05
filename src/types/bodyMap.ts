import type { TriageZone } from "./triage";

export type BodySide = "front" | "back";

export type BodyRegion = {
  id: string;
  label: string;
  /** Side of the body view this region belongs to. */
  side: BodySide;
  /** SVG ellipse center & radii (unit: viewBox 0..400 wide, 0..620 tall). */
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** Triage zone this anatomical region maps to (for red-flag screening). */
  triageZone: TriageZone;
};

/**
 * Régions anatomiques pour la localisation de la douleur + triage.
 * - Système de coordonnées : viewBox 0..400 × 0..620, corps centré x=200.
 * - Chaque région possède un `triageZone` qui détermine quelle batterie
 *   de drapeaux rouges spécifiques sera proposée au screening.
 */
export const bodyRegions: BodyRegion[] = [
  // === FRONT ===
  { id: "f_head", label: "Crâne / face", side: "front", cx: 200, cy: 50, rx: 30, ry: 35, triageZone: "head_neck" },
  { id: "f_jaw", label: "Mâchoire / ATM", side: "front", cx: 200, cy: 90, rx: 22, ry: 10, triageZone: "head_neck" },
  { id: "f_neck", label: "Cou (avant)", side: "front", cx: 200, cy: 105, rx: 16, ry: 10, triageZone: "head_neck" },
  { id: "f_shoulder_l", label: "Épaule G", side: "front", cx: 145, cy: 130, rx: 24, ry: 18, triageZone: "shoulder" },
  { id: "f_shoulder_r", label: "Épaule D", side: "front", cx: 255, cy: 130, rx: 24, ry: 18, triageZone: "shoulder" },
  { id: "f_chest", label: "Thorax / pectoraux", side: "front", cx: 200, cy: 155, rx: 45, ry: 30, triageZone: "thoracic" },
  { id: "f_arm_l", label: "Bras G", side: "front", cx: 120, cy: 185, rx: 14, ry: 30, triageZone: "elbow_arm" },
  { id: "f_arm_r", label: "Bras D", side: "front", cx: 280, cy: 185, rx: 14, ry: 30, triageZone: "elbow_arm" },
  { id: "f_elbow_l", label: "Coude G", side: "front", cx: 110, cy: 230, rx: 14, ry: 14, triageZone: "elbow_arm" },
  { id: "f_elbow_r", label: "Coude D", side: "front", cx: 290, cy: 230, rx: 14, ry: 14, triageZone: "elbow_arm" },
  { id: "f_forearm_l", label: "Avant-bras G", side: "front", cx: 100, cy: 270, rx: 14, ry: 28, triageZone: "elbow_arm" },
  { id: "f_forearm_r", label: "Avant-bras D", side: "front", cx: 300, cy: 270, rx: 14, ry: 28, triageZone: "elbow_arm" },
  { id: "f_wrist_l", label: "Poignet G", side: "front", cx: 90, cy: 312, rx: 12, ry: 10, triageZone: "wrist_hand" },
  { id: "f_wrist_r", label: "Poignet D", side: "front", cx: 310, cy: 312, rx: 12, ry: 10, triageZone: "wrist_hand" },
  { id: "f_hand_l", label: "Main G", side: "front", cx: 84, cy: 340, rx: 14, ry: 16, triageZone: "wrist_hand" },
  { id: "f_hand_r", label: "Main D", side: "front", cx: 316, cy: 340, rx: 14, ry: 16, triageZone: "wrist_hand" },
  { id: "f_abdomen", label: "Abdomen", side: "front", cx: 200, cy: 220, rx: 38, ry: 28, triageZone: "lumbar" },
  { id: "f_pelvis", label: "Bassin / pubis", side: "front", cx: 200, cy: 268, rx: 36, ry: 18, triageZone: "hip_pelvis" },
  { id: "f_hip_l", label: "Hanche G", side: "front", cx: 165, cy: 295, rx: 18, ry: 16, triageZone: "hip_pelvis" },
  { id: "f_hip_r", label: "Hanche D", side: "front", cx: 235, cy: 295, rx: 18, ry: 16, triageZone: "hip_pelvis" },
  { id: "f_thigh_l", label: "Cuisse G (face)", side: "front", cx: 170, cy: 365, rx: 22, ry: 40, triageZone: "knee_thigh" },
  { id: "f_thigh_r", label: "Cuisse D (face)", side: "front", cx: 230, cy: 365, rx: 22, ry: 40, triageZone: "knee_thigh" },
  { id: "f_knee_l", label: "Genou G", side: "front", cx: 170, cy: 425, rx: 18, ry: 16, triageZone: "knee_thigh" },
  { id: "f_knee_r", label: "Genou D", side: "front", cx: 230, cy: 425, rx: 18, ry: 16, triageZone: "knee_thigh" },
  { id: "f_shin_l", label: "Tibia / jambe G", side: "front", cx: 170, cy: 490, rx: 16, ry: 36, triageZone: "ankle_foot" },
  { id: "f_shin_r", label: "Tibia / jambe D", side: "front", cx: 230, cy: 490, rx: 16, ry: 36, triageZone: "ankle_foot" },
  { id: "f_ankle_l", label: "Cheville G", side: "front", cx: 170, cy: 545, rx: 14, ry: 12, triageZone: "ankle_foot" },
  { id: "f_ankle_r", label: "Cheville D", side: "front", cx: 230, cy: 545, rx: 14, ry: 12, triageZone: "ankle_foot" },
  { id: "f_foot_l", label: "Pied G (dorsal)", side: "front", cx: 170, cy: 580, rx: 18, ry: 14, triageZone: "ankle_foot" },
  { id: "f_foot_r", label: "Pied D (dorsal)", side: "front", cx: 230, cy: 580, rx: 18, ry: 14, triageZone: "ankle_foot" },

  // === BACK ===
  { id: "b_head", label: "Occiput", side: "back", cx: 200, cy: 50, rx: 30, ry: 35, triageZone: "head_neck" },
  { id: "b_neck", label: "Cervicales", side: "back", cx: 200, cy: 95, rx: 22, ry: 14, triageZone: "head_neck" },
  { id: "b_shoulder_l", label: "Épaule G (post.)", side: "back", cx: 145, cy: 130, rx: 24, ry: 18, triageZone: "shoulder" },
  { id: "b_shoulder_r", label: "Épaule D (post.)", side: "back", cx: 255, cy: 130, rx: 24, ry: 18, triageZone: "shoulder" },
  { id: "b_scapula_l", label: "Scapula G", side: "back", cx: 165, cy: 165, rx: 22, ry: 24, triageZone: "shoulder" },
  { id: "b_scapula_r", label: "Scapula D", side: "back", cx: 235, cy: 165, rx: 22, ry: 24, triageZone: "shoulder" },
  { id: "b_thoracic", label: "Dos haut (thoracique)", side: "back", cx: 200, cy: 175, rx: 18, ry: 38, triageZone: "thoracic" },
  { id: "b_arm_l", label: "Bras G (post.)", side: "back", cx: 120, cy: 195, rx: 14, ry: 28, triageZone: "elbow_arm" },
  { id: "b_arm_r", label: "Bras D (post.)", side: "back", cx: 280, cy: 195, rx: 14, ry: 28, triageZone: "elbow_arm" },
  { id: "b_elbow_l", label: "Coude G (post.)", side: "back", cx: 110, cy: 235, rx: 14, ry: 14, triageZone: "elbow_arm" },
  { id: "b_elbow_r", label: "Coude D (post.)", side: "back", cx: 290, cy: 235, rx: 14, ry: 14, triageZone: "elbow_arm" },
  { id: "b_forearm_l", label: "Avant-bras G (post.)", side: "back", cx: 100, cy: 275, rx: 14, ry: 28, triageZone: "elbow_arm" },
  { id: "b_forearm_r", label: "Avant-bras D (post.)", side: "back", cx: 300, cy: 275, rx: 14, ry: 28, triageZone: "elbow_arm" },
  { id: "b_lumbar", label: "Lombaires", side: "back", cx: 200, cy: 235, rx: 30, ry: 22, triageZone: "lumbar" },
  { id: "b_sacrum", label: "Sacrum", side: "back", cx: 200, cy: 270, rx: 22, ry: 16, triageZone: "lumbar" },
  { id: "b_buttock_l", label: "Fessier G", side: "back", cx: 170, cy: 305, rx: 26, ry: 20, triageZone: "hip_pelvis" },
  { id: "b_buttock_r", label: "Fessier D", side: "back", cx: 230, cy: 305, rx: 26, ry: 20, triageZone: "hip_pelvis" },
  { id: "b_hamstring_l", label: "Ischio G", side: "back", cx: 170, cy: 370, rx: 22, ry: 38, triageZone: "knee_thigh" },
  { id: "b_hamstring_r", label: "Ischio D", side: "back", cx: 230, cy: 370, rx: 22, ry: 38, triageZone: "knee_thigh" },
  { id: "b_kneeback_l", label: "Creux poplité G", side: "back", cx: 170, cy: 425, rx: 18, ry: 14, triageZone: "knee_thigh" },
  { id: "b_kneeback_r", label: "Creux poplité D", side: "back", cx: 230, cy: 425, rx: 18, ry: 14, triageZone: "knee_thigh" },
  { id: "b_calf_l", label: "Mollet G", side: "back", cx: 170, cy: 490, rx: 18, ry: 36, triageZone: "ankle_foot" },
  { id: "b_calf_r", label: "Mollet D", side: "back", cx: 230, cy: 490, rx: 18, ry: 36, triageZone: "ankle_foot" },
  { id: "b_achilles_l", label: "Achille G", side: "back", cx: 170, cy: 548, rx: 12, ry: 12, triageZone: "ankle_foot" },
  { id: "b_achilles_r", label: "Achille D", side: "back", cx: 230, cy: 548, rx: 12, ry: 12, triageZone: "ankle_foot" },
  { id: "b_heel_l", label: "Talon G", side: "back", cx: 170, cy: 580, rx: 14, ry: 12, triageZone: "ankle_foot" },
  { id: "b_heel_r", label: "Talon D", side: "back", cx: 230, cy: 580, rx: 14, ry: 12, triageZone: "ankle_foot" },
];

export const regionsById: Record<string, BodyRegion> = Object.fromEntries(
  bodyRegions.map((r) => [r.id, r]),
);

export function labelFor(id: string): string {
  return regionsById[id]?.label ?? id;
}

export function joinedLabels(ids: string[]): string {
  return ids
    .map((id) => regionsById[id]?.label)
    .filter(Boolean)
    .join(", ");
}

/** Resolve unique triage zones from a list of region ids (preserves order). */
export function triageZonesForRegions(regionIds: string[]): TriageZone[] {
  const seen = new Set<TriageZone>();
  const out: TriageZone[] = [];
  for (const id of regionIds) {
    const z = regionsById[id]?.triageZone;
    if (!z || seen.has(z)) continue;
    seen.add(z);
    out.push(z);
  }
  return out;
}
