import type { PatientContext } from "../types/patient";

const KEY = "loading.context.v1";

export function loadPatientContext(): PatientContext | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PatientContext;
    return parsed;
  } catch {
    return null;
  }
}

export function savePatientContext(ctx: PatientContext): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(ctx));
  } catch {
    // ignore
  }
}

export function clearPatientContext(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
