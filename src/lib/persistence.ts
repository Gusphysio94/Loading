const KEY = "loading.state.v2";
const LEGACY_KEY = "loading.state.v1";

export type PersistedState = {
  treeId: string;
  history: string[];
  evaValues?: Record<string, number>;
  /** ISO timestamp of last update — used to avoid restoring stale state if older than 24 h. */
  updatedAt: string;
};

export function loadState(): PersistedState | null {
  try {
    // Drop legacy state from previous schema
    localStorage.removeItem(LEGACY_KEY);

    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (
      typeof parsed.treeId !== "string" ||
      !Array.isArray(parsed.history) ||
      typeof parsed.updatedAt !== "string"
    ) {
      return null;
    }
    const ageMs = Date.now() - new Date(parsed.updatedAt).getTime();
    if (ageMs > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(state: {
  treeId: string;
  history: string[];
  evaValues?: Record<string, number>;
}): void {
  try {
    const payload: PersistedState = {
      ...state,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // localStorage may be unavailable (private mode, full quota) — silently ignore
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
