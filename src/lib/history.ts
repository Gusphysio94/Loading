import type { Severity } from "../types/tree";
import type { PatientContext } from "../types/patient";

const KEY = "loading.history.v1";
const MAX_ENTRIES = 50;

export type HistoryEntry = {
  id: string;
  date: string;
  treeId: string;
  treeTitle: string;
  recommendationId: string;
  recommendationTitle: string;
  severity: Severity;
  evaPeak?: number;
  patientInitials?: string;
  patientLocation?: string;
  patientChronicity?: PatientContext["chronicity"];
};

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

export function appendHistory(entry: HistoryEntry): HistoryEntry[] {
  const existing = loadHistory();
  // Avoid duplicates if the same id is appended twice in the same session
  const filtered = existing.filter((e) => e.id !== entry.id);
  const next = [entry, ...filtered].slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore quota
  }
  return next;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
