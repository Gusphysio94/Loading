import { useState } from "react";
import { motion } from "framer-motion";
import type { RecapEntry, RecommendationNode, Tree } from "../types/tree";
import type { PatientContext } from "../types/patient";
import { chronicityShort, hasContext } from "../types/patient";
import type { SessionInputs, PostSessionLoad } from "../types/session";
import { hasAnyInput, formatPace, suggestedDuration } from "../types/session";
import { SRPECard } from "./SRPECard";
import { cn } from "../lib/cn";
import {
  CheckIcon,
  AlertIcon,
  StopIcon,
  RefreshIcon,
  CopyIcon,
  ShareIcon,
  PrintIcon,
  EditIcon,
} from "./icons";
import { formatRecapAsText, shareOrCopy, copyToClipboard } from "../lib/recap";

type RecommendationScreenProps = {
  tree: Tree;
  node: RecommendationNode;
  recap: RecapEntry[];
  patientContext?: PatientContext;
  sessionInputs?: SessionInputs;
  onRestart: () => void;
  onHome: () => void;
  onEditStep?: (index: number) => void;
  onPostSessionChange?: (load: PostSessionLoad) => void;
};

const severityConfig = {
  success: {
    label: "Charge tolérée",
    accent: "text-accent-success",
    border: "border-accent-success/30",
    bg: "bg-accent-success/10",
    glow: "shadow-[0_0_60px_-15px_rgba(52,211,153,0.5)]",
    Icon: CheckIcon,
    bar: "bg-accent-success",
  },
  warning: {
    label: "À ajuster",
    accent: "text-accent-warning",
    border: "border-accent-warning/30",
    bg: "bg-accent-warning/10",
    glow: "shadow-[0_0_60px_-15px_rgba(251,191,36,0.45)]",
    Icon: AlertIcon,
    bar: "bg-accent-warning",
  },
  danger: {
    label: "Stop / avis spécialisé",
    accent: "text-accent-danger",
    border: "border-accent-danger/30",
    bg: "bg-accent-danger/10",
    glow: "shadow-[0_0_60px_-15px_rgba(248,113,113,0.5)]",
    Icon: StopIcon,
    bar: "bg-accent-danger",
  },
  neutral: {
    label: "Recommandation",
    accent: "text-white",
    border: "border-white/15",
    bg: "bg-white/[0.04]",
    glow: "",
    Icon: CheckIcon,
    bar: "bg-white/40",
  },
} as const;

type Toast = { kind: "shared" | "copied" | "error"; key: number } | null;

export function RecommendationScreen({
  tree,
  node,
  recap,
  patientContext,
  sessionInputs,
  onRestart,
  onHome,
  onEditStep,
  onPostSessionChange,
}: RecommendationScreenProps) {
  const config = severityConfig[node.severity];
  const { Icon } = config;
  const [toast, setToast] = useState<Toast>(null);

  const recapText = formatRecapAsText({
    tree,
    recap,
    recommendationTitle: node.title,
    recommendationMessage: node.message,
    patientContext,
    sessionInputs,
  });

  const ctxFilled = hasContext(patientContext);
  const inputsFilled = hasAnyInput(sessionInputs);

  function showToast(kind: "shared" | "copied" | "error") {
    setToast({ kind, key: Date.now() });
    setTimeout(() => setToast(null), 2500);
  }

  async function handleShare() {
    const result = await shareOrCopy(recapText, "Loading — Évaluation");
    if (result === "shared") showToast("shared");
    else if (result === "copied") showToast("copied");
    else showToast("error");
  }

  async function handleCopy() {
    const result = await copyToClipboard(recapText);
    if (result === "copied") showToast("copied");
    else showToast("error");
  }

  function handlePrint() {
    window.print();
  }

  const supportsShare =
    typeof navigator !== "undefined" && "share" in navigator;

  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-12 pt-8 sm:pt-12"
    >
      <div className="print-only mb-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-gray-500">
              Loading · gestion de charge
            </div>
            <div className="text-base font-semibold">{tree.title}</div>
          </div>
          <div className="text-xs text-gray-500">
            {new Date().toLocaleDateString("fr-FR")}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "surface-strong print-card overflow-hidden rounded-3xl border p-1",
          config.border,
          config.glow,
        )}
      >
        <div className={cn("h-[3px] w-full", config.bar)} />

        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                config.bg,
                config.accent,
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.18em]",
                config.accent,
              )}
            >
              {config.label}
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
            {node.title}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
            {node.message}
          </p>
        </div>
      </div>

      {onPostSessionChange && (
        <SRPECard
          value={sessionInputs?.postSession}
          suggestedDurationMin={suggestedDuration(sessionInputs)}
          onChange={onPostSessionChange}
        />
      )}

      {recap.length > 0 && (
        <section className="print-card mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              Récapitulatif des réponses
            </h3>
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              {tree.title}
            </span>
          </div>

          {(ctxFilled || inputsFilled) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {patientContext?.initials && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                  Patient : {patientContext.initials}
                </span>
              )}
              {patientContext?.location && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                  {patientContext.location}
                </span>
              )}
              {patientContext?.chronicity && (
                <span className="rounded-full border border-brand-pink/25 bg-brand-pink/[0.08] px-2.5 py-0.5 text-[11px] font-medium text-brand-pink">
                  {chronicityShort[patientContext.chronicity]}
                </span>
              )}
              {sessionInputs?.exercise?.exerciseName && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                  {sessionInputs.exercise.exerciseName}
                </span>
              )}
              {sessionInputs?.exercise?.load !== undefined && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                  {sessionInputs.exercise.load} kg
                </span>
              )}
              {sessionInputs?.exercise?.sets !== undefined &&
                sessionInputs.exercise.reps !== undefined && (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                    {sessionInputs.exercise.sets}×{sessionInputs.exercise.reps}
                  </span>
                )}
              {sessionInputs?.running?.sessionType && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                  {sessionInputs.running.sessionType}
                </span>
              )}
              {sessionInputs?.running?.distance !== undefined && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                  {sessionInputs.running.distance} km
                </span>
              )}
              {sessionInputs?.running?.pace !== undefined && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                  {formatPace(sessionInputs.running.pace)}
                </span>
              )}
              {sessionInputs?.running?.elevation !== undefined && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                  {sessionInputs.running.elevation} m D+
                </span>
              )}
              {sessionInputs?.sport?.sport && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-white/70">
                  {sessionInputs.sport.sport}
                </span>
              )}
            </div>
          )}
          {onEditStep && (
            <p className="no-print mt-3 text-[11px] text-white/40">
              Touche une étape pour la corriger.
            </p>
          )}

          <ul className="mt-3 space-y-1.5">
            {recap.map((entry, i) => {
              const content = (
                <>
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-[10px] font-semibold text-white/50 group-hover:bg-brand-pink/20 group-hover:text-brand-pink">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1 text-sm leading-snug">
                    <div className="text-white/85">
                      {entry.kind === "modulation" ? (
                        <>
                          <span className="text-white/70">{entry.label}</span>
                          <span className="text-white/40">
                            {" "}· c'est mieux ?
                          </span>{" "}
                          <span
                            className={cn(
                              "font-semibold",
                              entry.answer === "OUI"
                                ? "text-accent-success"
                                : "text-accent-danger",
                            )}
                          >
                            {entry.answer}
                          </span>
                        </>
                      ) : entry.kind === "eva" ? (
                        <>
                          <span className="text-white/70">{entry.label}</span>
                          <span className="text-white/40"> :</span>{" "}
                          <span className="font-semibold text-brand-pink">
                            {entry.answer}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-white/70">{entry.label}</span>
                          <span className="text-white/40"> :</span>{" "}
                          <span
                            className={cn(
                              "font-semibold",
                              entry.answer === "OUI"
                                ? "text-brand-coral"
                                : entry.answer === "NON"
                                  ? "text-accent-success"
                                  : "text-white",
                            )}
                          >
                            {entry.answer}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </>
              );

              if (onEditStep) {
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => onEditStep(i)}
                      aria-label={`Modifier l'étape ${i + 1} : ${entry.label}`}
                      className="group flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/[0.04]"
                    >
                      {content}
                      <EditIcon
                        className="mt-0.5 h-4 w-4 shrink-0 text-white/0 transition-colors group-hover:text-white/55 group-focus-visible:text-white/55"
                        aria-hidden
                      />
                    </button>
                  </li>
                );
              }

              return (
                <li key={i} className="flex items-start gap-3 px-2 py-2">
                  {content}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {node.relatedContent && node.relatedContent.length > 0 && (
        <section className="no-print mt-4 rounded-2xl border border-brand-violet/20 bg-brand-violet/[0.04] p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="gradient-bg h-1.5 w-1.5 rounded-full" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-violet/85">
              Aller plus loin · Fullphysio
            </span>
          </div>
          <ul className="space-y-2">
            {node.relatedContent.map((c, i) => (
              <li key={i}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3 text-sm text-white/85 transition-colors hover:border-brand-violet/40 hover:bg-brand-violet/[0.08] hover:text-white"
                >
                  <span className="line-clamp-2">{c.title}</span>
                  <span className="text-xs text-brand-violet/70 transition-colors group-hover:text-brand-violet">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="no-print mt-4 grid gap-3 sm:grid-cols-3">
        {supportsShare && (
          <motion.button
            type="button"
            onClick={handleShare}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
          >
            <ShareIcon className="h-4 w-4" />
            Envoyer
          </motion.button>
        )}
        <motion.button
          type="button"
          onClick={handleCopy}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
        >
          <CopyIcon className="h-4 w-4" />
          Copier
        </motion.button>
        <motion.button
          type="button"
          onClick={handlePrint}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
        >
          <PrintIcon className="h-4 w-4" />
          Imprimer / PDF
        </motion.button>
      </div>

      <div className="no-print mt-3 grid gap-3 sm:grid-cols-2">
        <motion.button
          type="button"
          onClick={onRestart}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="gradient-bg flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
        >
          <RefreshIcon className="h-4 w-4" />
          {node.cta ?? "Recommencer"}
        </motion.button>
        <motion.button
          type="button"
          onClick={onHome}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-3.5 text-sm font-semibold text-white/70 transition hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
        >
          Changer de situation
        </motion.button>
      </div>

      {toast && (
        <motion.div
          key={toast.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="pointer-events-none fixed inset-x-0 bottom-6 z-40 mx-auto flex max-w-xs justify-center px-5"
        >
          <div
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-md",
              toast.kind === "copied" &&
                "border-accent-success/30 bg-accent-success/10 text-accent-success",
              toast.kind === "shared" &&
                "border-brand-pink/30 bg-brand-pink/10 text-brand-pink",
              toast.kind === "error" &&
                "border-accent-danger/30 bg-accent-danger/10 text-accent-danger",
            )}
          >
            {toast.kind === "copied" && "Résumé copié dans le presse-papiers"}
            {toast.kind === "shared" && "Partagé"}
            {toast.kind === "error" && "Échec — réessaye"}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
