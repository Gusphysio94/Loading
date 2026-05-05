import { motion } from "framer-motion";
import { trees } from "../data/trees";
import {
  iconForTree,
  ChevronRightIcon,
  RefreshIcon,
  AlertIcon,
  BarChartIcon,
  ActivityIcon,
} from "./icons";
import { PatientContextCard } from "./PatientContextCard";
import type { PatientContext } from "../types/patient";
import {
  mechanismLabels,
  mechanismColors,
} from "../types/painType";

type ResumeProps = {
  treeTitle: string;
  stepsDone: number;
  isTerminal: boolean;
  onResume: () => void;
  onDismiss: () => void;
};

type HomeProps = {
  onSelectTree: (treeId: string) => void;
  onOpenRedFlags: () => void;
  onOpenPainType: () => void;
  onOpenBodyMap: () => void;
  onOpenYellowFlags: () => void;
  onOpenStats: () => void;
  resume: ResumeProps | null;
  patientContext: PatientContext;
  onPatientContextChange: (ctx: PatientContext) => void;
  onPatientContextClear: () => void;
  evaluationCount: number;
};

export function Home({
  onSelectTree,
  onOpenRedFlags,
  onOpenPainType,
  onOpenBodyMap,
  onOpenYellowFlags,
  onOpenStats,
  resume,
  patientContext,
  onPatientContextChange,
  onPatientContextClear,
  evaluationCount,
}: HomeProps) {
  const painScore = patientContext.painScore;
  const dominantMech = painScore?.dominant;
  const yfScore = patientContext.yellowFlagScore;
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-12 pt-10 sm:pt-16">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-2 flex items-center gap-2"
      >
        <div className="gradient-bg h-2.5 w-2.5 rounded-full" />
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
          Aide à la décision · kinésithérapie
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="font-display text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl"
      >
        <span className="gradient-text">Loading</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-3 max-w-xl text-base text-white/60 sm:text-lg"
      >
        Gérer la charge de tes patients en quelques clics, en fonction de la
        douleur rapportée. Choisis la situation clinique pour démarrer.
      </motion.p>

      {resume && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="surface-strong mt-7 flex flex-col gap-3 rounded-2xl border-brand-pink/20 px-5 py-4 sm:flex-row sm:items-center"
        >
          <div className="gradient-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white">
            <RefreshIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-pink/80">
              {resume.isTerminal ? "Dernière évaluation" : "Évaluation en cours"}
            </div>
            <div className="truncate text-sm font-semibold text-white">
              {resume.treeTitle}
            </div>
            <div className="text-xs text-white/50">
              {resume.isTerminal
                ? "Conclusion disponible"
                : `${resume.stepsDone} étape${resume.stepsDone > 1 ? "s" : ""} franchie${resume.stepsDone > 1 ? "s" : ""}`}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={resume.onDismiss}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-white/60 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white/90"
            >
              Effacer
            </button>
            <button
              type="button"
              onClick={resume.onResume}
              className="gradient-bg rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
            >
              {resume.isTerminal ? "Voir le résultat" : "Reprendre"}
            </button>
          </div>
        </motion.div>
      )}

      <PatientContextCard
        context={patientContext}
        onChange={onPatientContextChange}
        onClear={onPatientContextClear}
        onOpenBodyMap={onOpenBodyMap}
      />

      <motion.button
        type="button"
        onClick={onOpenPainType}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.99 }}
        className="group mt-3 flex items-center gap-3 rounded-2xl border border-brand-violet/25 bg-brand-violet/[0.05] px-4 py-3 text-left transition-colors hover:border-brand-violet/45 hover:bg-brand-violet/[0.08]"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-violet/15 text-brand-violet">
          <ActivityIcon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-violet/85">
            Profil de douleur · IASP
          </div>
          {painScore ? (
            <div className="text-sm font-semibold text-white">
              {dominantMech ? (
                <>
                  Dominance{" "}
                  <span style={{ color: mechanismColors[dominantMech] }}>
                    {mechanismLabels[dominantMech].toLowerCase()}
                  </span>
                </>
              ) : (
                "Profil mixte"
              )}
              <span className="ml-2 text-[11px] font-normal text-white/45">
                {painScore.nociceptive}% / {painScore.neuropathic}% /{" "}
                {painScore.nociplastic}%
              </span>
            </div>
          ) : (
            <div className="text-sm font-semibold text-white">
              Classifier la douleur en 9 questions
            </div>
          )}
        </div>
        <ChevronRightIcon className="h-4 w-4 shrink-0 text-brand-violet/60 transition-all group-hover:translate-x-0.5 group-hover:text-brand-violet" />
      </motion.button>

      <motion.button
        type="button"
        onClick={onOpenYellowFlags}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.21 }}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.99 }}
        className="group mt-3 flex items-center gap-3 rounded-2xl border border-accent-warning/25 bg-accent-warning/[0.05] px-4 py-3 text-left transition-colors hover:border-accent-warning/45 hover:bg-accent-warning/[0.08]"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-warning/15 text-accent-warning">
          <AlertIcon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-warning/85">
            Drapeaux jaunes · TSK + PCS
          </div>
          {yfScore && yfScore.answeredCount > 0 ? (
            <div className="text-sm font-semibold text-white">
              TSK {yfScore.tskScore}/28
              {yfScore.tskHigh && (
                <span className="ml-1 text-accent-warning">↑</span>
              )}
              <span className="mx-1 text-white/30">·</span>
              PCS {yfScore.pcsScore}/16
              {yfScore.pcsHigh && (
                <span className="ml-1 text-accent-warning">↑</span>
              )}
            </div>
          ) : (
            <div className="text-sm font-semibold text-white">
              Kinésiophobie & catastrophisme — 11 questions
            </div>
          )}
        </div>
        <ChevronRightIcon className="h-4 w-4 shrink-0 text-accent-warning/60 transition-all group-hover:translate-x-0.5 group-hover:text-accent-warning" />
      </motion.button>

      <motion.button
        type="button"
        onClick={onOpenRedFlags}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.22 }}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.99 }}
        className="group mt-3 flex items-center gap-3 rounded-2xl border border-accent-danger/20 bg-accent-danger/[0.05] px-4 py-3 text-left transition-colors hover:border-accent-danger/40 hover:bg-accent-danger/[0.08]"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-danger/15 text-accent-danger">
          <AlertIcon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-danger/80">
            Avant l'évaluation
          </div>
          <div className="text-sm font-semibold text-white">
            Vérifier les drapeaux rouges
          </div>
        </div>
        <ChevronRightIcon className="h-4 w-4 shrink-0 text-accent-danger/60 transition-all group-hover:translate-x-0.5 group-hover:text-accent-danger" />
      </motion.button>

      <div className="mt-6 grid gap-4">
        {trees.map((tree, index) => (
          <motion.button
            key={tree.id}
            type="button"
            onClick={() => onSelectTree(tree.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 + index * 0.08 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
            className="surface group relative flex items-center gap-5 overflow-hidden rounded-2xl px-5 py-5 text-left transition-colors hover:border-white/20 sm:px-6 sm:py-6"
          >
            <div className="gradient-bg absolute inset-x-0 top-0 h-px opacity-40" />

            <div className="gradient-bg relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-white shadow-lg shadow-brand-violet/20">
              {iconForTree(tree.icon, { className: "h-7 w-7" })}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium uppercase tracking-wider text-white/40">
                Situation {String(index + 1).padStart(2, "0")}
              </div>
              <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                {tree.title}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-white/55">
                {tree.description}
              </p>
            </div>

            <ChevronRightIcon className="h-5 w-5 shrink-0 text-white/40 transition-all group-hover:translate-x-1 group-hover:text-white/80" />
          </motion.button>
        ))}
      </div>

      {evaluationCount > 0 && (
        <motion.button
          type="button"
          onClick={onOpenStats}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.99 }}
          className="mt-6 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3 text-left transition-colors hover:border-white/20 hover:bg-white/[0.05]"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/65">
            <BarChartIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Statistiques privées
            </div>
            <div className="text-sm font-medium text-white/85">
              {evaluationCount} évaluation{evaluationCount > 1 ? "s" : ""} en
              mémoire
            </div>
          </div>
          <ChevronRightIcon className="h-4 w-4 shrink-0 text-white/40" />
        </motion.button>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 text-xs leading-relaxed text-white/45"
      >
        <strong className="font-semibold text-white/70">Outil pro · usage kinésithérapeute.</strong>{" "}
        Loading propose un cadre décisionnel inspiré des principes de gestion
        de charge basés sur la douleur. Il ne remplace pas le raisonnement
        clinique du praticien.
      </motion.div>
    </div>
  );
}
