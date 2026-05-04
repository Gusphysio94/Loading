export type Amplitude = "full" | "partial";
export type RunSessionType = "longue" | "intervalle" | "denivele" | "standard";
export type SportType = "collectif" | "raquette" | "combat" | "autre";

export type ExerciseInputs = {
  load?: number; // kg
  reps?: number; // per set
  sets?: number;
  tempo?: string; // e.g. "2-0-2"
  amplitude?: Amplitude;
  exerciseName?: string;
};

export type RunningInputs = {
  pace?: number; // min per km
  sessionType?: RunSessionType;
  distance?: number; // km
  duration?: number; // min
  intervals?: number; // number of reps for interval session
  intervalDistance?: number; // m per rep
  elevation?: number; // m D+
};

export type SportInputs = {
  sport?: string;
  sportType?: SportType;
  duration?: number; // min
  intensityNote?: string; // free text
  hasMatchSoon?: boolean;
};

export type SessionInputs = {
  exercise?: ExerciseInputs;
  running?: RunningInputs;
  sport?: SportInputs;
};

/** Schema indicates which subset of inputs the tree expects. */
export type InputsSchema = "exercise" | "running" | "sport";

export function hasAnyInput(inputs: SessionInputs | null | undefined): boolean {
  if (!inputs) return false;
  const e = inputs.exercise;
  const r = inputs.running;
  const s = inputs.sport;
  return !!(
    (e &&
      (e.load !== undefined ||
        e.reps !== undefined ||
        e.sets !== undefined ||
        e.tempo ||
        e.amplitude ||
        e.exerciseName)) ||
    (r &&
      (r.pace !== undefined ||
        r.sessionType ||
        r.distance !== undefined ||
        r.duration !== undefined ||
        r.intervals !== undefined ||
        r.intervalDistance !== undefined ||
        r.elevation !== undefined)) ||
    (s &&
      (s.sport ||
        s.sportType ||
        s.duration !== undefined ||
        s.intensityNote ||
        s.hasMatchSoon))
  );
}

export function formatPace(minPerKm: number): string {
  const m = Math.floor(minPerKm);
  const s = Math.round((minPerKm - m) * 60);
  return `${m}:${s.toString().padStart(2, "0")}/km`;
}

export function paceFromSlower(minPerKm: number, addSeconds: number): string {
  const total = minPerKm * 60 + addSeconds;
  const m = Math.floor(total / 60);
  const s = Math.round(total - m * 60);
  return `${m}:${s.toString().padStart(2, "0")}/km`;
}
