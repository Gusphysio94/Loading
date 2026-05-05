import type { TriageZone } from "../../types/triage";
import type { DeepAssessmentModule } from "../../types/deepAssessment";
import { kneeModule } from "./knee";
import { ankleModule } from "./ankle";
import { shoulderModule } from "./shoulder";
import { lumbarModule } from "./lumbar";

/**
 * Registre des modules d'évaluation approfondie disponibles.
 * Pilote initial : genou. Étendu : cheville/pied, épaule, lombaire.
 * À étendre par zone selon priorisation clinique.
 */
export const deepAssessmentModules: Partial<Record<TriageZone, DeepAssessmentModule>> = {
  knee_thigh: kneeModule,
  ankle_foot: ankleModule,
  shoulder: shoulderModule,
  lumbar: lumbarModule,
};

export function moduleForZone(zone: TriageZone): DeepAssessmentModule | undefined {
  return deepAssessmentModules[zone];
}

export function hasDeepModule(zone: TriageZone): boolean {
  return !!deepAssessmentModules[zone];
}
