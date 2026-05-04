import { useState } from "react";
import { motion } from "framer-motion";
import type {
  SessionInputs,
  ExerciseInputs,
  RunningInputs,
  SportInputs,
  Amplitude,
  RunSessionType,
  SportType,
  InputsSchema,
} from "../types/session";
import { cn } from "../lib/cn";

type SessionInputsScreenProps = {
  schema: InputsSchema;
  treeTitle: string;
  initial?: SessionInputs;
  onContinue: (inputs: SessionInputs) => void;
  onSkip: () => void;
};

export function SessionInputsScreen({
  schema,
  treeTitle,
  initial,
  onContinue,
  onSkip,
}: SessionInputsScreenProps) {
  const [exercise, setExercise] = useState<ExerciseInputs>(
    initial?.exercise ?? {},
  );
  const [running, setRunning] = useState<RunningInputs>(initial?.running ?? {});
  const [sport, setSport] = useState<SportInputs>(initial?.sport ?? {});

  function handleSubmit() {
    const inputs: SessionInputs = {};
    if (schema === "exercise") inputs.exercise = exercise;
    if (schema === "running") inputs.running = running;
    if (schema === "sport") inputs.sport = sport;
    onContinue(inputs);
  }

  return (
    <motion.div
      key="session-inputs"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-12 pt-8 sm:pt-12"
    >
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-pink/80">
        Détails de la séance · optionnel
      </span>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        {treeTitle}
      </h2>
      <p className="mt-2 text-sm text-white/55">
        Saisis les paramètres pour obtenir des modulations chiffrées (charge,
        volume, allure). Tu peux passer cette étape.
      </p>

      <div className="surface mt-6 rounded-2xl p-5 sm:p-6">
        {schema === "exercise" && (
          <ExerciseForm value={exercise} onChange={setExercise} />
        )}
        {schema === "running" && (
          <RunningForm value={running} onChange={setRunning} />
        )}
        {schema === "sport" && <SportForm value={sport} onChange={setSport} />}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <motion.button
          type="button"
          onClick={onSkip}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
        >
          Passer
        </motion.button>
        <motion.button
          type="button"
          onClick={handleSubmit}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="gradient-bg flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
        >
          Continuer avec ces détails
        </motion.button>
      </div>
    </motion.div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-baseline justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
        <span>{label}</span>
        {hint && (
          <span className="text-[9px] font-medium normal-case tracking-normal text-white/35">
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  placeholder,
  unit,
  step = 1,
  min = 0,
}: {
  value: number | undefined;
  onChange: (n: number | undefined) => void;
  placeholder?: string;
  unit?: string;
  step?: number;
  min?: number;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        inputMode="decimal"
        step={step}
        min={min}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "") onChange(undefined);
          else {
            const n = parseFloat(v);
            onChange(Number.isNaN(n) ? undefined : n);
          }
        }}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-brand-pink/60 focus:bg-white/[0.06] focus:outline-none"
      />
      {unit && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40">
          {unit}
        </span>
      )}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  value: string | undefined;
  onChange: (s: string | undefined) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <input
      type="text"
      maxLength={maxLength}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value || undefined)}
      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-brand-pink/60 focus:bg-white/[0.06] focus:outline-none"
    />
  );
}

function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: { value: T; label: string; sub?: string }[];
  value: T | undefined;
  onChange: (v: T | undefined) => void;
  columns?: number;
}) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}
    >
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(active ? undefined : o.value)}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-colors",
              active
                ? "border-brand-pink/60 bg-brand-pink/[0.12] text-white"
                : "border-white/10 bg-white/[0.025] text-white/65 hover:border-white/20 hover:bg-white/[0.05] hover:text-white/85",
            )}
          >
            <div className="font-semibold">{o.label}</div>
            {o.sub && (
              <div className="mt-0.5 text-[10px] text-white/40">{o.sub}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ExerciseForm({
  value,
  onChange,
}: {
  value: ExerciseInputs;
  onChange: (v: ExerciseInputs) => void;
}) {
  const update = (patch: Partial<ExerciseInputs>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="space-y-4">
      <Field label="Exercice (libre)" hint="ex. squat, RDL, calf raise">
        <TextInput
          value={value.exerciseName}
          onChange={(s) => update({ exerciseName: s })}
          placeholder="Nom de l'exercice"
          maxLength={60}
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Charge" hint="kg">
          <NumberInput
            value={value.load}
            onChange={(n) => update({ load: n })}
            placeholder="ex. 60"
            unit="kg"
            step={0.5}
          />
        </Field>
        <Field label="Répétitions" hint="par série">
          <NumberInput
            value={value.reps}
            onChange={(n) => update({ reps: n })}
            placeholder="ex. 10"
            min={1}
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Séries">
          <NumberInput
            value={value.sets}
            onChange={(n) => update({ sets: n })}
            placeholder="ex. 3"
            min={1}
          />
        </Field>
        <Field label="Tempo" hint="ex. 2-0-2 ou 3-0-1">
          <TextInput
            value={value.tempo}
            onChange={(s) => update({ tempo: s })}
            placeholder="exc-iso-conc"
            maxLength={16}
          />
        </Field>
      </div>

      <Field label="Amplitude actuelle">
        <ChipGroup<Amplitude>
          options={[
            { value: "full", label: "Complète", sub: "ROM total" },
            { value: "partial", label: "Partielle", sub: "Range réduite" },
          ]}
          value={value.amplitude}
          onChange={(v) => update({ amplitude: v })}
        />
      </Field>
    </div>
  );
}

function RunningForm({
  value,
  onChange,
}: {
  value: RunningInputs;
  onChange: (v: RunningInputs) => void;
}) {
  const update = (patch: Partial<RunningInputs>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="space-y-4">
      <Field label="Type de sortie">
        <ChipGroup<RunSessionType>
          columns={2}
          options={[
            { value: "longue", label: "Longue", sub: "endurance fondamentale" },
            { value: "intervalle", label: "Intervalles", sub: "fractionné" },
            { value: "denivele", label: "Dénivelé", sub: "côtes / trail" },
            { value: "standard", label: "Standard", sub: "footing classique" },
          ]}
          value={value.sessionType}
          onChange={(v) => update({ sessionType: v })}
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Allure" hint="min/km">
          <NumberInput
            value={value.pace}
            onChange={(n) => update({ pace: n })}
            placeholder="ex. 5.30"
            unit="min/km"
            step={0.05}
            min={2}
          />
        </Field>
        <Field label="Distance" hint="km">
          <NumberInput
            value={value.distance}
            onChange={(n) => update({ distance: n })}
            placeholder="ex. 12"
            unit="km"
            step={0.5}
          />
        </Field>
      </div>

      {value.sessionType === "intervalle" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nombre d'intervalles">
            <NumberInput
              value={value.intervals}
              onChange={(n) => update({ intervals: n })}
              placeholder="ex. 8"
              min={1}
            />
          </Field>
          <Field label="Distance par interv." hint="m">
            <NumberInput
              value={value.intervalDistance}
              onChange={(n) => update({ intervalDistance: n })}
              placeholder="ex. 400"
              unit="m"
              min={50}
            />
          </Field>
        </div>
      )}

      {value.sessionType === "denivele" && (
        <Field label="Dénivelé positif" hint="m D+">
          <NumberInput
            value={value.elevation}
            onChange={(n) => update({ elevation: n })}
            placeholder="ex. 500"
            unit="m"
            step={10}
          />
        </Field>
      )}

      <Field label="Durée totale" hint="min — facultatif">
        <NumberInput
          value={value.duration}
          onChange={(n) => update({ duration: n })}
          placeholder="ex. 60"
          unit="min"
          min={1}
        />
      </Field>
    </div>
  );
}

function SportForm({
  value,
  onChange,
}: {
  value: SportInputs;
  onChange: (v: SportInputs) => void;
}) {
  const update = (patch: Partial<SportInputs>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="space-y-4">
      <Field label="Sport pratiqué" hint="libre">
        <TextInput
          value={value.sport}
          onChange={(s) => update({ sport: s })}
          placeholder="ex. football, tennis, judo"
          maxLength={40}
        />
      </Field>

      <Field label="Catégorie">
        <ChipGroup<SportType>
          columns={2}
          options={[
            { value: "collectif", label: "Collectif", sub: "foot, hand, basket" },
            { value: "raquette", label: "Raquette", sub: "tennis, padel" },
            { value: "combat", label: "Combat", sub: "judo, boxe, MMA" },
            { value: "autre", label: "Autre" },
          ]}
          value={value.sportType}
          onChange={(v) => update({ sportType: v })}
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Durée séance" hint="min">
          <NumberInput
            value={value.duration}
            onChange={(n) => update({ duration: n })}
            placeholder="ex. 90"
            unit="min"
            min={1}
          />
        </Field>
        <Field label="Match prévu sous peu ?">
          <ChipGroup<"yes" | "no">
            options={[
              { value: "yes", label: "Oui" },
              { value: "no", label: "Non" },
            ]}
            value={value.hasMatchSoon ? "yes" : value.hasMatchSoon === false ? "no" : undefined}
            onChange={(v) =>
              update({ hasMatchSoon: v === "yes" ? true : v === "no" ? false : undefined })
            }
          />
        </Field>
      </div>
    </div>
  );
}
