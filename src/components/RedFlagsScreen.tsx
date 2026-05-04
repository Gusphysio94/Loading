import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { redFlags } from "../data/redFlags";
import { cn } from "../lib/cn";
import { AlertIcon, CheckIcon, StopIcon } from "./icons";

type RedFlagsScreenProps = {
  onBackHome: () => void;
};

type View = "checklist" | "stop" | "clear";

export function RedFlagsScreen({ onBackHome }: RedFlagsScreenProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<View>("checklist");

  const flagged = useMemo(
    () => redFlags.filter((f) => checked[f.id]),
    [checked],
  );

  function toggle(id: string) {
    setChecked((p) => ({ ...p, [id]: !p[id] }));
  }

  function handleSubmit() {
    setView(flagged.length > 0 ? "stop" : "clear");
  }

  function handleReset() {
    setChecked({});
    setView("checklist");
  }

  if (view === "stop") {
    return (
      <motion.div
        key="redflags-stop"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
        className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-12 pt-8 sm:pt-12"
      >
        <div className="surface-strong overflow-hidden rounded-3xl border border-accent-danger/30 p-1 shadow-[0_0_60px_-15px_rgba(248,113,113,0.5)]">
          <div className="h-[3px] w-full bg-accent-danger" />
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-danger/10 text-accent-danger">
                <StopIcon className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-danger">
                Avis médical recommandé
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
              Stop sur la gestion de charge
            </h2>

            <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
              {flagged.length} drapeau{flagged.length > 1 ? "x" : ""} rouge
              {flagged.length > 1 ? "s" : ""} identifié
              {flagged.length > 1 ? "s" : ""}. Le raisonnement « gestion de
              charge » n'est pas adapté ici. Oriente vers un médecin / examen
              complémentaire avant toute reprise structurée.
            </p>

            <ul className="mt-6 space-y-2.5">
              {flagged.map((f) => (
                <li
                  key={f.id}
                  className="flex items-start gap-3 rounded-xl border border-accent-danger/20 bg-accent-danger/[0.06] px-4 py-3 text-sm"
                >
                  <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-danger" />
                  <div className="flex-1">
                    <div className="font-semibold text-white">{f.label}</div>
                    {f.detail && (
                      <div className="text-xs text-white/55">{f.detail}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <motion.button
            type="button"
            onClick={handleReset}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
          >
            Refaire le screening
          </motion.button>
          <motion.button
            type="button"
            onClick={onBackHome}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="gradient-bg flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
          >
            Retour à l'accueil
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (view === "clear") {
    return (
      <motion.div
        key="redflags-clear"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
        className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-12 pt-8 sm:pt-12"
      >
        <div className="surface-strong overflow-hidden rounded-3xl border border-accent-success/30 p-1 shadow-[0_0_60px_-15px_rgba(52,211,153,0.5)]">
          <div className="h-[3px] w-full bg-accent-success" />
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-success/10 text-accent-success">
                <CheckIcon className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-success">
                Aucun drapeau rouge
              </span>
            </div>
            <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
              Tu peux passer à l'évaluation
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
              Aucun drapeau rouge identifié sur les éléments les plus
              fréquents. Le raisonnement gestion de charge est cohérent ici.
              Reste attentif à toute évolution atypique.
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={onBackHome}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="gradient-bg mt-6 flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
        >
          Choisir une situation clinique
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="redflags-checklist"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-12 pt-8 sm:pt-12"
    >
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-pink/80">
        Screening pré-évaluation
      </span>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        Coche tout drapeau rouge présent chez le patient
      </h2>
      <p className="mt-2 text-sm text-white/55">
        Si l'un de ces signes est présent, le raisonnement gestion de charge
        n'est pas adapté — oriente vers un avis médical.
      </p>

      <ul className="mt-6 space-y-2">
        {redFlags.map((f) => {
          const isOn = !!checked[f.id];
          return (
            <li key={f.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isOn}
                onClick={() => toggle(f.id)}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors",
                  isOn
                    ? "border-accent-danger/40 bg-accent-danger/[0.08]"
                    : "border-white/10 bg-white/[0.025] hover:border-white/25 hover:bg-white/[0.05]",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    isOn
                      ? "border-accent-danger bg-accent-danger text-night-500"
                      : "border-white/25 bg-white/[0.03] text-transparent",
                  )}
                  aria-hidden
                >
                  {isOn && <CheckIcon className="h-3.5 w-3.5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      "text-sm font-semibold",
                      isOn ? "text-white" : "text-white/85",
                    )}
                  >
                    {f.label}
                  </div>
                  {f.detail && (
                    <div className="text-xs text-white/45">{f.detail}</div>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3 text-xs text-white/55">
        <span>
          {flagged.length} drapeau{flagged.length > 1 ? "x" : ""} sélectionné
          {flagged.length > 1 ? "s" : ""}
        </span>
        {flagged.length > 0 && (
          <button
            type="button"
            onClick={() => setChecked({})}
            className="font-semibold text-brand-pink hover:underline"
          >
            Tout décocher
          </button>
        )}
      </div>

      <motion.button
        type="button"
        onClick={handleSubmit}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        className="gradient-bg mt-4 flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
      >
        {flagged.length > 0 ? "Voir les recommandations" : "Tout est clair, continuer"}
      </motion.button>
    </motion.div>
  );
}
