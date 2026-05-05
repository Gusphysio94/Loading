import { motion } from "framer-motion";
import { trees } from "../data/trees";
import type { Tree } from "../types/tree";
import {
  iconForTree,
  ChevronRightIcon,
  RefreshIcon,
  AlertIcon,
  BarChartIcon,
  ActivityIcon,
  CheckIcon,
  StopIcon,
} from "./icons";
import { PatientContextCard } from "./PatientContextCard";
import type { PatientContext } from "../types/patient";
import {
  mechanismLabels,
  mechanismColors,
} from "../types/painType";
import { triageZoneLabels, type TriageZone } from "../types/triage";
import { hasDeepModule } from "../data/deepAssessment";

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
  onAcknowledgeRedFlags: () => void;
  onClearTriage: () => void;
  onOpenDeepAssessment: (zone: TriageZone) => void;
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
  onAcknowledgeRedFlags,
  onClearTriage,
  onOpenDeepAssessment,
  resume,
  patientContext,
  onPatientContextChange,
  onPatientContextClear,
  evaluationCount,
}: HomeProps) {
  const painScore = patientContext.painScore;
  const dominantMech = painScore?.dominant;
  const yfScore = patientContext.yellowFlagScore;
  const triage = patientContext.triageStatus;
  const treesUnlocked = !!triage; // triage performed (clear or flagged ack)
  const treesBlocked = triage?.outcome === "flagged" && triage.hasCritical;

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
          Triage MSK · accès direct
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
        Sécuriser le triage en accès direct, puis guider la décision de gestion
        de charge basée sur la douleur.
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

      <SectionHeader
        eyebrow="Étape 1"
        title="Triage drapeaux rouges"
        delay={0.18}
      />

      <TriageCard
        triage={triage}
        onOpenBodyMap={onOpenBodyMap}
        onAcknowledgeRedFlags={onAcknowledgeRedFlags}
        onClearTriage={onClearTriage}
        onOpenRedFlagsChecklist={onOpenRedFlags}
        onOpenDeepAssessment={onOpenDeepAssessment}
        delay={0.2}
      />

      <SectionHeader
        eyebrow="Étape 2 · Profil patient"
        title="Outils de qualification"
        delay={0.32}
      />

      <motion.button
        type="button"
        onClick={onOpenPainType}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.34 }}
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
        transition={{ duration: 0.4, delay: 0.36 }}
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

      <SectionHeader
        eyebrow="Étape 3 · Gestion de charge"
        title="Quelle est la situation ?"
        delay={0.4}
      />

      {!treesUnlocked && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.42 }}
          className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs text-white/55"
        >
          Le triage drapeaux rouges (étape 1) sécurise l'accès aux arbres
          décisionnels. Une fois validé, ils se débloquent ici.
        </motion.div>
      )}

      {treesBlocked && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.42 }}
          className="mt-4 rounded-xl border border-accent-danger/30 bg-accent-danger/[0.06] px-4 py-3 text-xs text-white/75"
        >
          <strong className="text-accent-danger">Drapeau rouge critique actif.</strong>{" "}
          La gestion de charge n'est pas indiquée tant que l'orientation
          médicale n'a pas été réalisée.
        </motion.div>
      )}

      <PhaseSubHeader
        label="Pendant ou juste après l'effort"
        kicker="Le kiné est avec son patient"
        delay={0.44}
      />

      <div className="mt-3 grid gap-3">
        {trees
          .filter((t) => t.phase === "in-session")
          .map((tree, index) => (
            <TreeCard
              key={tree.id}
              tree={tree}
              index={index}
              delay={0.46 + index * 0.06}
              onSelect={() => onSelectTree(tree.id)}
              locked={!treesUnlocked || treesBlocked}
            />
          ))}
      </div>

      <PhaseSubHeader
        label="Entre 2 séances"
        kicker="Patient à distance · texte / appel"
        delay={0.62}
      />

      <div className="mt-3 grid gap-3">
        {trees
          .filter((t) => t.phase === "between-sessions")
          .map((tree, index) => (
            <TreeCard
              key={tree.id}
              tree={tree}
              index={index + 3}
              delay={0.64 + index * 0.06}
              onSelect={() => onSelectTree(tree.id)}
              locked={!treesUnlocked || treesBlocked}
            />
          ))}
      </div>

      {evaluationCount > 0 && (
        <motion.button
          type="button"
          onClick={onOpenStats}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
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
        transition={{ duration: 0.6, delay: 0.75 }}
        className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 text-xs leading-relaxed text-white/45"
      >
        <strong className="font-semibold text-white/70">Outil pro · usage kinésithérapeute.</strong>{" "}
        Loading propose un cadre de triage MSK et de gestion de charge fondé
        sur la littérature (IFOMPT 2020, NICE NG59, Foster sRPE, IASP). Il ne
        remplace pas le raisonnement clinique du praticien.
      </motion.div>
    </div>
  );
}

function TriageCard({
  triage,
  onOpenBodyMap,
  onAcknowledgeRedFlags,
  onClearTriage,
  onOpenRedFlagsChecklist,
  onOpenDeepAssessment,
  delay,
}: {
  triage: PatientContext["triageStatus"];
  onOpenBodyMap: () => void;
  onAcknowledgeRedFlags: () => void;
  onClearTriage: () => void;
  onOpenRedFlagsChecklist: () => void;
  onOpenDeepAssessment: (zone: TriageZone) => void;
  delay: number;
}) {
  if (!triage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="surface-strong mt-4 overflow-hidden rounded-3xl border-accent-danger/20"
      >
        <div className="h-[3px] w-full bg-gradient-to-r from-accent-danger via-brand-pink to-brand-violet opacity-80" />
        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-danger/10 text-accent-danger">
              <AlertIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent-danger/85">
                Avant toute prise en charge
              </div>
              <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">
                Localiser la douleur, screener les drapeaux rouges
              </h3>
              <p className="mt-1 text-sm text-white/55">
                Sélectionne les zones douloureuses sur le squelette. Le
                screening RF spécifique à la région est ensuite généré
                automatiquement (IFOMPT, Cook, Greenhalgh).
              </p>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={onOpenBodyMap}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.99 }}
            className="gradient-bg mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
          >
            Démarrer le triage
            <ChevronRightIcon className="h-4 w-4" />
          </motion.button>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/40">
            <button
              type="button"
              onClick={onOpenRedFlagsChecklist}
              className="hover:text-white/70 hover:underline"
            >
              Screening universel rapide (sans région)
            </button>
            <button
              type="button"
              onClick={onAcknowledgeRedFlags}
              className="hover:text-white/70 hover:underline"
            >
              Patient déjà screené aujourd'hui →
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Triage performed
  const isCritical = triage.outcome === "flagged" && triage.hasCritical;
  const isFlagged = triage.outcome === "flagged";
  const isClear = triage.outcome === "clear";
  const date = new Date(triage.date);
  const dateStr = date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`surface-strong mt-4 overflow-hidden rounded-3xl ${
        isCritical
          ? "border-accent-danger/40"
          : isFlagged
            ? "border-accent-warning/40"
            : "border-accent-success/35"
      }`}
    >
      <div
        className={`h-[3px] w-full ${
          isCritical
            ? "bg-accent-danger"
            : isFlagged
              ? "bg-accent-warning"
              : "bg-accent-success"
        }`}
      />
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isCritical
                ? "bg-accent-danger/15 text-accent-danger"
                : isFlagged
                  ? "bg-accent-warning/15 text-accent-warning"
                  : "bg-accent-success/15 text-accent-success"
            }`}
          >
            {isClear ? (
              <CheckIcon className="h-5 w-5" />
            ) : isCritical ? (
              <StopIcon className="h-5 w-5" />
            ) : (
              <AlertIcon className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                isCritical
                  ? "text-accent-danger"
                  : isFlagged
                    ? "text-accent-warning"
                    : "text-accent-success"
              }`}
            >
              {isClear
                ? "Triage clair"
                : isCritical
                  ? "Drapeau rouge critique"
                  : "Drapeaux à vérifier"}
            </div>
            <h3 className="mt-1 text-lg font-bold text-white">
              {isClear
                ? triage.zones.length === 0
                  ? "RF déjà screenés (auto-déclaré)"
                  : `${triage.zones.length} zone${triage.zones.length > 1 ? "s" : ""} screenée${triage.zones.length > 1 ? "s" : ""}`
                : `${triage.flaggedIds.length} drapeau${triage.flaggedIds.length > 1 ? "x" : ""} positif${triage.flaggedIds.length > 1 ? "s" : ""}`}
            </h3>
            {triage.zones.length > 0 && (
              <p className="mt-1 text-xs text-white/55">
                {triage.zones.map((z) => triageZoneLabels[z]).join(" · ")}
              </p>
            )}
            <p className="mt-1 text-[11px] text-white/35">{dateStr}</p>
          </div>
        </div>

        {isClear && (() => {
          const deepEligible = triage.zones.filter((z) => hasDeepModule(z));
          if (deepEligible.length === 0) return null;
          return (
            <div className="mt-4 space-y-2">
              {deepEligible.map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => onOpenDeepAssessment(z)}
                  className="flex w-full items-center gap-3 rounded-xl border border-brand-pink/35 bg-brand-pink/[0.06] px-4 py-3 text-left transition hover:border-brand-pink/55 hover:bg-brand-pink/[0.10]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-pink/15 text-brand-pink">
                    <ActivityIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-pink">
                      Évaluation approfondie disponible
                    </div>
                    <div className="text-sm font-semibold text-white">
                      Hypothèses cliniques · {triageZoneLabels[z]}
                    </div>
                  </div>
                  <ChevronRightIcon className="h-4 w-4 shrink-0 text-brand-pink/60" />
                </button>
              ))}
            </div>
          );
        })()}

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={onOpenBodyMap}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-white/85 transition hover:border-white/25 hover:bg-white/[0.06]"
          >
            Refaire le triage
          </button>
          <button
            type="button"
            onClick={onClearTriage}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs font-medium text-white/55 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white/75"
          >
            Effacer le statut
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  delay = 0,
}: {
  eyebrow: string;
  title: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
      className="mt-8 flex items-baseline gap-3"
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="text-center">
        <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/35">
          {eyebrow}
        </div>
        <div className="mt-0.5 text-sm font-semibold text-white/85">
          {title}
        </div>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/15 to-transparent" />
    </motion.div>
  );
}

function PhaseSubHeader({
  label,
  kicker,
  delay = 0,
}: {
  label: string;
  kicker: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="mt-5 flex items-center gap-2"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/75">
        {label}
      </span>
      <span className="text-[11px] text-white/35">· {kicker}</span>
    </motion.div>
  );
}

function TreeCard({
  tree,
  index,
  delay,
  onSelect,
  locked,
}: {
  tree: Tree;
  index: number;
  delay: number;
  onSelect: () => void;
  locked: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={locked ? undefined : onSelect}
      disabled={locked}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: locked ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={locked ? undefined : { y: -2 }}
      whileTap={locked ? undefined : { scale: 0.985 }}
      className={`surface group relative flex items-center gap-5 overflow-hidden rounded-2xl px-5 py-5 text-left transition-colors sm:px-6 sm:py-6 ${
        locked ? "cursor-not-allowed" : "hover:border-white/20"
      }`}
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

      <ChevronRightIcon
        className={`h-5 w-5 shrink-0 transition-all ${
          locked
            ? "text-white/20"
            : "text-white/40 group-hover:translate-x-1 group-hover:text-white/80"
        }`}
      />
    </motion.button>
  );
}
