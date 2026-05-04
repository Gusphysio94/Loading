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
  /** Foster session-RPE (0-10), captured 15-30 min post-session. */
  srpe?: number;
  /** Effective session duration, in minutes. */
  durationMin?: number;
  /** Internal load = sRPE × durationMin (Foster, AU). */
  loadAU?: number;
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

/** Update the most recent entry matching (treeId, recommendationId) — used to attach
 * post-session sRPE without duplicating the row. Returns the new history. */
export function updateLatestEntry(
  match: { treeId: string; recommendationId: string },
  patch: Partial<HistoryEntry>,
): HistoryEntry[] {
  const existing = loadHistory();
  const idx = existing.findIndex(
    (e) => e.treeId === match.treeId && e.recommendationId === match.recommendationId,
  );
  if (idx === -1) return existing;
  const next = existing.slice();
  next[idx] = { ...next[idx], ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
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
