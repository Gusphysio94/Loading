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
};

/**
 * Stylized body regions for clinical pain localization.
 * Coordinates target a 400×620 viewBox with the silhouette centered.
 *
 * Region set inspired by the Margolis Pain Drawing (1986) + IASP NPR1
 * standard, simplified for in-app rapid selection (~25 zones × 2 sides).
 */
export const bodyRegions: BodyRegion[] = [
  // === FRONT ===
  { id: "f_head", label: "Tête / face", side: "front", cx: 200, cy: 50, rx: 30, ry: 35 },
  { id: "f_neck", label: "Cou (avant)", side: "front", cx: 200, cy: 95, rx: 18, ry: 12 },
  { id: "f_shoulder_l", label: "Épaule G", side: "front", cx: 145, cy: 130, rx: 24, ry: 18 },
  { id: "f_shoulder_r", label: "Épaule D", side: "front", cx: 255, cy: 130, rx: 24, ry: 18 },
  { id: "f_chest", label: "Thorax / pectoraux", side: "front", cx: 200, cy: 155, rx: 45, ry: 30 },
  { id: "f_arm_l", label: "Bras G", side: "front", cx: 120, cy: 185, rx: 14, ry: 30 },
  { id: "f_arm_r", label: "Bras D", side: "front", cx: 280, cy: 185, rx: 14, ry: 30 },
  { id: "f_elbow_l", label: "Coude G", side: "front", cx: 110, cy: 230, rx: 14, ry: 14 },
  { id: "f_elbow_r", label: "Coude D", side: "front", cx: 290, cy: 230, rx: 14, ry: 14 },
  { id: "f_forearm_l", label: "Avant-bras G", side: "front", cx: 100, cy: 270, rx: 14, ry: 28 },
  { id: "f_forearm_r", label: "Avant-bras D", side: "front", cx: 300, cy: 270, rx: 14, ry: 28 },
  { id: "f_wrist_l", label: "Poignet G", side: "front", cx: 92, cy: 310, rx: 12, ry: 10 },
  { id: "f_wrist_r", label: "Poignet D", side: "front", cx: 308, cy: 310, rx: 12, ry: 10 },
  { id: "f_abdomen", label: "Abdomen", side: "front", cx: 200, cy: 220, rx: 38, ry: 30 },
  { id: "f_pelvis", label: "Bassin / pubis", side: "front", cx: 200, cy: 265, rx: 36, ry: 22 },
  { id: "f_hip_l", label: "Hanche G", side: "front", cx: 165, cy: 295, rx: 18, ry: 16 },
  { id: "f_hip_r", label: "Hanche D", side: "front", cx: 235, cy: 295, rx: 18, ry: 16 },
  { id: "f_thigh_l", label: "Cuisse G (face)", side: "front", cx: 170, cy: 365, rx: 22, ry: 40 },
  { id: "f_thigh_r", label: "Cuisse D (face)", side: "front", cx: 230, cy: 365, rx: 22, ry: 40 },
  { id: "f_knee_l", label: "Genou G", side: "front", cx: 170, cy: 425, rx: 18, ry: 16 },
  { id: "f_knee_r", label: "Genou D", side: "front", cx: 230, cy: 425, rx: 18, ry: 16 },
  { id: "f_shin_l", label: "Tibia / jambe G", side: "front", cx: 170, cy: 490, rx: 16, ry: 38 },
  { id: "f_shin_r", label: "Tibia / jambe D", side: "front", cx: 230, cy: 490, rx: 16, ry: 38 },
  { id: "f_ankle_l", label: "Cheville G", side: "front", cx: 170, cy: 545, rx: 14, ry: 12 },
  { id: "f_ankle_r", label: "Cheville D", side: "front", cx: 230, cy: 545, rx: 14, ry: 12 },
  { id: "f_foot_l", label: "Pied G (dorsal)", side: "front", cx: 170, cy: 580, rx: 18, ry: 14 },
  { id: "f_foot_r", label: "Pied D (dorsal)", side: "front", cx: 230, cy: 580, rx: 18, ry: 14 },

  // === BACK ===
  { id: "b_head", label: "Occiput", side: "back", cx: 200, cy: 50, rx: 30, ry: 35 },
  { id: "b_neck", label: "Cervicales", side: "back", cx: 200, cy: 95, rx: 22, ry: 14 },
  { id: "b_shoulder_l", label: "Épaule G (post.)", side: "back", cx: 145, cy: 130, rx: 24, ry: 18 },
  { id: "b_shoulder_r", label: "Épaule D (post.)", side: "back", cx: 255, cy: 130, rx: 24, ry: 18 },
  { id: "b_thoracic", label: "Dos haut (thoracique)", side: "back", cx: 200, cy: 165, rx: 50, ry: 30 },
  { id: "b_arm_l", label: "Bras G (post.)", side: "back", cx: 120, cy: 195, rx: 14, ry: 28 },
  { id: "b_arm_r", label: "Bras D (post.)", side: "back", cx: 280, cy: 195, rx: 14, ry: 28 },
  { id: "b_elbow_l", label: "Coude G (post.)", side: "back", cx: 110, cy: 235, rx: 14, ry: 14 },
  { id: "b_elbow_r", label: "Coude D (post.)", side: "back", cx: 290, cy: 235, rx: 14, ry: 14 },
  { id: "b_lumbar", label: "Lombaires", side: "back", cx: 200, cy: 230, rx: 45, ry: 25 },
  { id: "b_sacrum", label: "Sacrum", side: "back", cx: 200, cy: 270, rx: 25, ry: 18 },
  { id: "b_buttock_l", label: "Fessier G", side: "back", cx: 170, cy: 305, rx: 26, ry: 20 },
  { id: "b_buttock_r", label: "Fessier D", side: "back", cx: 230, cy: 305, rx: 26, ry: 20 },
  { id: "b_hamstring_l", label: "Ischio G", side: "back", cx: 170, cy: 370, rx: 22, ry: 38 },
  { id: "b_hamstring_r", label: "Ischio D", side: "back", cx: 230, cy: 370, rx: 22, ry: 38 },
  { id: "b_kneeback_l", label: "Creux poplité G", side: "back", cx: 170, cy: 425, rx: 18, ry: 14 },
  { id: "b_kneeback_r", label: "Creux poplité D", side: "back", cx: 230, cy: 425, rx: 18, ry: 14 },
  { id: "b_calf_l", label: "Mollet G", side: "back", cx: 170, cy: 490, rx: 18, ry: 38 },
  { id: "b_calf_r", label: "Mollet D", side: "back", cx: 230, cy: 490, rx: 18, ry: 38 },
  { id: "b_achilles_l", label: "Achille G", side: "back", cx: 170, cy: 548, rx: 12, ry: 12 },
  { id: "b_achilles_r", label: "Achille D", side: "back", cx: 230, cy: 548, rx: 12, ry: 12 },
  { id: "b_heel_l", label: "Talon G", side: "back", cx: 170, cy: 580, rx: 14, ry: 12 },
  { id: "b_heel_r", label: "Talon D", side: "back", cx: 230, cy: 580, rx: 14, ry: 12 },
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
