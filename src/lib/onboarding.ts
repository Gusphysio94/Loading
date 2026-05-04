const KEY = "loading.onboarding.v1";

export function hasSeenOnboarding(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return true; // if storage unavailable, don't pester the user
  }
}

export function markOnboardingSeen(): void {
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    // ignore
  }
}

export function resetOnboarding(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
