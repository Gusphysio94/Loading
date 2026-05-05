import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  type TriageRedFlag,
  type TriageZone,
  type TriageStatus,
  triageZoneLabels,
  summarizeOutcome,
} from "../types/triage";
import {
  universalRedFlags,
  zoneRedFlags,
  allRedFlagsById,
  referralLabels,
} from "../data/regionalRedFlags";
import { hasDeepModule } from "../data/deepAssessment";
import { cn } from "../lib/cn";
import { AlertIcon, CheckIcon, ChevronRightIcon, StopIcon } from "./icons";

type RegionTriageScreenProps = {
  zones: TriageZone[];
  /** Initial flagged ids to repopulate (if user comes back). */
  initialFlagged?: string[];
  /** Called when user confirms triage — clear OR flagged. */
  onComplete: (status: TriageStatus) => void;
  onBackHome: () => void;
  /** Called when the kiné wants to launch a deep assessment for a zone. */
  onStartDeepAssessment?: (zone: TriageZone) => void;
};

type View = "checklist" | "stop" | "clear";

export function RegionTriageScreen({
  zones,
  initialFlagged = [],
  onComplete,
  onBackHome,
  onStartDeepAssessment,
}: RegionTriageScreenProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const id of initialFlagged) init[id] = true;
    return init;
  });
  const [view, setView] = useState<View>("checklist");

  const flaggedIds = useMemo(
    () => Object.keys(checked).filter((k) => checked[k]),
    [checked],
  );

  const flaggedDetails = useMemo(
    () =>
      flaggedIds
        .map((id) => allRedFlagsById[id])
        .filter((f): f is TriageRedFlag => !!f),
    [flaggedIds],
  );

  const { hasCritical } = summarizeOutcome(flaggedIds, allRedFlagsById);

  const referralPriority = useMemo(() => {
    if (flaggedDetails.some((f) => f.referral === "urgent")) return "urgent";
    if (flaggedDetails.some((f) => f.referral === "specialist"))
      return "specialist";
    if (flaggedDetails.some((f) => f.referral === "physician"))
      return "physician";
    return null;
  }, [flaggedDetails]);

  function toggle(id: string) {
    setChecked((p) => ({ ...p, [id]: !p[id] }));
  }

  function handleSubmit() {
    const status: TriageStatus = {
      date: new Date().toISOString(),
      zones,
      outcome: flaggedIds.length > 0 ? "flagged" : "clear",
      flaggedIds,
      hasCritical,
    };
    onComplete(status);
    setView(flaggedIds.length > 0 ? "stop" : "clear");
  }

  function handleReset() {
    setChecked({});
    setView("checklist");
  }

  if (view === "stop") {
    return (
      <motion.div
        key="triage-stop"
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
                {hasCritical
                  ? "Orientation médicale prioritaire"
                  : "Avis médical recommandé"}
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
              {hasCritical
                ? "Stop — bilan médical avant toute prise en charge"
                : "Avis médical à organiser avant la suite"}
            </h2>

            <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
              {flaggedDetails.length} drapeau
              {flaggedDetails.length > 1 ? "x" : ""} rouge
              {flaggedDetails.length > 1 ? "s" : ""} identifié
              {flaggedDetails.length > 1 ? "s" : ""} sur les zones :{" "}
              <span className="font-semibold text-white">
                {zones.map((z) => triageZoneLabels[z]).join(", ")}
              </span>
              .
            </p>

            {referralPriority && (
              <div
                className={cn(
                  "mt-5 rounded-2xl border px-4 py-3 text-sm",
                  referralPriority === "urgent"
                    ? "border-accent-danger/45 bg-accent-danger/[0.10] text-white"
                    : "border-white/15 bg-white/[0.04] text-white/85",
                )}
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                  Orientation
                </div>
                <div className="mt-1 font-semibold">
                  {referralLabels[referralPriority]}
                </div>
              </div>
            )}

            <ul className="mt-6 space-y-2.5">
              {flaggedDetails.map((f) => (
                <li
                  key={f.id}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm",
                    f.severity === "critical"
                      ? "border-accent-danger/30 bg-accent-danger/[0.08]"
                      : "border-accent-warning/30 bg-accent-warning/[0.06]",
                  )}
                >
                  <AlertIcon
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      f.severity === "critical"
                        ? "text-accent-danger"
                        : "text-accent-warning",
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-white">{f.label}</div>
                    <div className="mt-0.5 text-xs text-white/70">
                      Suspicion : {f.suspect}
                    </div>
                    {f.detail && (
                      <div className="mt-0.5 text-xs text-white/45">
                        {f.detail}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-white/55">
              <strong className="text-white/75">À dire au patient :</strong>{" "}
              « Sur ce que vous décrivez, certains éléments sortent de mon
              champ et nécessitent un avis médical avant que je puisse vous
              prendre en charge en kinésithérapie. Je vous oriente vers{" "}
              {referralPriority === "urgent"
                ? "les urgences ou votre médecin sans délai"
                : referralPriority === "specialist"
                  ? "un spécialiste"
                  : "votre médecin traitant"}
              . »
            </div>
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
        key="triage-clear"
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
                Aucun drapeau rouge identifié
              </span>
            </div>
            <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
              Triage clair sur {zones.length} zone{zones.length > 1 ? "s" : ""}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
              Aucun élément du screening régional ne nécessite une orientation
              médicale immédiate. Tu peux poursuivre l'évaluation kiné et le
              raisonnement de gestion de charge.
            </p>
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-white/55">
              Reste vigilant à toute évolution atypique : douleur nocturne
              constante, déficit qui s'étend, signes systémiques. Recote le
              triage si le tableau change.
            </div>
          </div>
        </div>

        {(() => {
          const deepEligible = onStartDeepAssessment
            ? zones.filter((z) => hasDeepModule(z))
            : [];
          if (deepEligible.length === 0) {
            return (
              <motion.button
                type="button"
                onClick={onBackHome}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="gradient-bg mt-6 flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
              >
                Continuer vers l'évaluation
              </motion.button>
            );
          }
          return (
            <div className="mt-6 space-y-3">
              {deepEligible.map((z) => (
                <motion.button
                  key={z}
                  type="button"
                  onClick={() => onStartDeepAssessment?.(z)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="gradient-bg flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
                >
                  Évaluation approfondie · {triageZoneLabels[z].toLowerCase()}
                  <ChevronRightIcon className="h-4 w-4" />
                </motion.button>
              ))}
              <button
                type="button"
                onClick={onBackHome}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
              >
                Retour à l'accueil — je continue mon examen
              </button>
            </div>
          );
        })()}
      </motion.div>
    );
  }

  return (
    <motion.div
      key="triage-checklist"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-12 pt-8 sm:pt-12"
    >
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-pink/80">
        Triage en accès direct · drapeaux rouges
      </span>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        Coche tout drapeau rouge présent
      </h2>
      <p className="mt-2 text-sm text-white/55">
        Zones screenées :{" "}
        <span className="font-medium text-white/75">
          {zones.map((z) => triageZoneLabels[z]).join(" · ")}
        </span>
        . Si un seul élément est positif, le raisonnement gestion de charge
        n'est pas indiqué — oriente vers un avis médical.
      </p>

      <FlagSection
        title="Drapeaux rouges universels"
        subtitle="Quel que soit le motif — à passer en revue systématiquement."
        flags={universalRedFlags}
        checked={checked}
        onToggle={toggle}
        accent="violet"
      />

      {zones.map((z) => {
        const set = zoneRedFlags[z];
        if (!set) return null;
        return (
          <FlagSection
            key={z}
            title={set.groupTitle}
            subtitle={`Spécifiques à la zone : ${triageZoneLabels[z]}.`}
            flags={set.flags}
            checked={checked}
            onToggle={toggle}
            accent="pink"
          />
        );
      })}

      <div className="mt-6 flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3 text-xs text-white/55">
        <span>
          {flaggedIds.length} drapeau{flaggedIds.length > 1 ? "x" : ""}{" "}
          sélectionné{flaggedIds.length > 1 ? "s" : ""}
        </span>
        {flaggedIds.length > 0 && (
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
        {flaggedIds.length > 0
          ? "Voir l'orientation"
          : "Tout est clair, valider le triage"}
      </motion.button>
    </motion.div>
  );
}

type FlagSectionProps = {
  title: string;
  subtitle: string;
  flags: TriageRedFlag[];
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
  accent: "violet" | "pink";
};

function FlagSection({
  title,
  subtitle,
  flags,
  checked,
  onToggle,
  accent,
}: FlagSectionProps) {
  const accentTextClass =
    accent === "violet" ? "text-brand-violet/80" : "text-brand-pink/80";
  return (
    <section className="mt-7">
      <div
        className={cn(
          "text-[10px] font-bold uppercase tracking-[0.18em]",
          accentTextClass,
        )}
      >
        {title}
      </div>
      <p className="mt-1 text-xs text-white/45">{subtitle}</p>
      <ul className="mt-3 space-y-2">
        {flags.map((f) => {
          const isOn = !!checked[f.id];
          const sevColor =
            f.severity === "critical"
              ? "border-accent-danger/40 bg-accent-danger/[0.08]"
              : "border-accent-warning/35 bg-accent-warning/[0.06]";
          const checkColor =
            f.severity === "critical"
              ? "border-accent-danger bg-accent-danger"
              : "border-accent-warning bg-accent-warning";
          return (
            <li key={f.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isOn}
                onClick={() => onToggle(f.id)}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors",
                  isOn
                    ? sevColor
                    : "border-white/10 bg-white/[0.025] hover:border-white/25 hover:bg-white/[0.05]",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    isOn
                      ? `${checkColor} text-night-500`
                      : "border-white/25 bg-white/[0.03] text-transparent",
                  )}
                  aria-hidden
                >
                  {isOn && <CheckIcon className="h-3.5 w-3.5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        isOn ? "text-white" : "text-white/85",
                      )}
                    >
                      {f.label}
                    </span>
                    {f.severity === "critical" && (
                      <span className="rounded-full border border-accent-danger/40 bg-accent-danger/[0.10] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-danger">
                        Critique
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[11px] uppercase tracking-wider text-white/35">
                    Suspicion : {f.suspect}
                  </div>
                  {f.detail && (
                    <div className="mt-1 text-xs text-white/55">
                      {f.detail}
                    </div>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
