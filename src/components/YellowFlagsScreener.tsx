import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  yellowFlagItems,
  tskOptions,
  pcsOptions,
  scoreYellowFlags,
  yellowFlagsOrientation,
  TSK_THRESHOLD,
  PCS_THRESHOLD,
  type YellowFlagAnswers,
  type YellowFlagAssessment,
} from "../types/yellowFlags";
import { cn } from "../lib/cn";
import { RefreshIcon } from "./icons";

type Props = {
  initial?: YellowFlagAssessment;
  onSave: (assessment: YellowFlagAssessment) => void;
  onBackHome: () => void;
};

export function YellowFlagsScreener({ initial, onSave, onBackHome }: Props) {
  const [answers, setAnswers] = useState<YellowFlagAnswers>(
    initial?.answers ?? {},
  );
  const [showResult, setShowResult] = useState(
    !!initial && Object.keys(initial.answers).length === yellowFlagItems.length,
  );

  const allAnswered = yellowFlagItems.every(
    (it) => typeof answers[it.id] === "number",
  );

  const score = useMemo(() => scoreYellowFlags(answers), [answers]);

  function setAnswer(id: string, value: number) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleShowResult() {
    setShowResult(true);
    onSave({ answers, date: new Date().toISOString() });
  }

  function handleReset() {
    setAnswers({});
    setShowResult(false);
  }

  if (showResult) {
    return (
      <YellowFlagsResult
        score={score}
        onEdit={() => setShowResult(false)}
        onReset={handleReset}
        onBackHome={onBackHome}
      />
    );
  }

  return (
    <motion.div
      key="yf-quiz"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-12 pt-8 sm:pt-12"
    >
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent-warning">
        Drapeaux jaunes psychosociaux
      </span>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        Kinésiophobie & catastrophisme
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-white/55">
        TSK-7 (Woby 2005) — peur du mouvement · PCS-4 (McWilliams 2015) —
        catastrophisme face à la douleur. 11 questions à faire répondre par
        le patient.
      </p>

      <div className="mt-6 space-y-3">
        {yellowFlagItems.map((item, idx) => {
          const answer = answers[item.id];
          const options = item.type === "tsk" ? tskOptions : pcsOptions;
          const isFirstOfType =
            idx === 0 || yellowFlagItems[idx - 1].type !== item.type;
          return (
            <div key={item.id}>
              {isFirstOfType && (
                <div className="mb-2 mt-4 flex items-baseline justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                    {item.type === "tsk"
                      ? "TSK-7 — Peur du mouvement"
                      : "PCS-4 — Catastrophisme"}
                  </h3>
                  <span className="text-[10px] text-white/30">
                    {item.type === "tsk"
                      ? "1-4 (Pas du tout → Tout à fait)"
                      : "0-4 (Jamais → Toujours)"}
                  </span>
                </div>
              )}
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-[10px] font-semibold text-white/55">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1 text-sm leading-snug text-white/90">
                    {item.question}
                  </div>
                </div>
                <div
                  className="mt-3 grid gap-1.5"
                  style={{
                    gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))`,
                  }}
                >
                  {options.map((opt) => {
                    const active = answer === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAnswer(item.id, opt.value)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-0.5 rounded-lg border px-1 py-2 text-[10px] font-medium transition-colors",
                          active
                            ? "border-accent-warning/60 bg-accent-warning/[0.15] text-white"
                            : "border-white/10 bg-white/[0.025] text-white/55 hover:border-white/25 hover:bg-white/[0.05] hover:text-white/85",
                        )}
                      >
                        <span className="text-sm font-bold">{opt.value}</span>
                        <span className="line-clamp-1 text-[9px] uppercase tracking-wide">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3 text-xs text-white/55">
        <span>
          {score.answeredCount} / {yellowFlagItems.length} questions
        </span>
        {score.answeredCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="font-semibold text-white/45 hover:text-white/85 hover:underline"
          >
            Tout réinitialiser
          </button>
        )}
      </div>

      <motion.button
        type="button"
        onClick={handleShowResult}
        disabled={!allAnswered}
        whileHover={allAnswered ? { y: -1 } : undefined}
        whileTap={allAnswered ? { scale: 0.98 } : undefined}
        className={cn(
          "mt-4 flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold transition",
          allAnswered
            ? "gradient-bg text-white shadow-lg shadow-brand-violet/20 hover:shadow-xl hover:shadow-brand-violet/30"
            : "cursor-not-allowed border border-white/10 bg-white/[0.03] text-white/30",
        )}
      >
        Voir les scores
      </motion.button>
    </motion.div>
  );
}

function YellowFlagsResult({
  score,
  onEdit,
  onReset,
  onBackHome,
}: {
  score: ReturnType<typeof scoreYellowFlags>;
  onEdit: () => void;
  onReset: () => void;
  onBackHome: () => void;
}) {
  const orientation = yellowFlagsOrientation(score);

  return (
    <motion.div
      key="yf-result"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-12 pt-8 sm:pt-12"
    >
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent-warning">
        Profil psychosocial
      </span>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        {orientation.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-white/65">
        {orientation.message}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <ScoreCard
          label="TSK-7 · Kinésiophobie"
          score={score.tskScore}
          max={28}
          threshold={TSK_THRESHOLD}
          high={score.tskHigh}
          subtitle={score.tskHigh ? "Élevée" : "Faible"}
        />
        <ScoreCard
          label="PCS-4 · Catastrophisme"
          score={score.pcsScore}
          max={16}
          threshold={PCS_THRESHOLD}
          high={score.pcsHigh}
          subtitle={score.pcsHigh ? "Élevé" : "Faible"}
        />
      </div>

      <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3 text-[11px] leading-relaxed text-white/45">
        <strong className="font-semibold text-white/65">Disclaimer.</strong>{" "}
        Outils validés en clinique mais non spécifiques d'un diagnostic. Des
        scores élevés augmentent la probabilité a posteriori d'un profil
        nociplastique (Adams 2023, Nijs 2021) et orientent vers PNE +
        exposition graduée (Louw 2021). À recroiser avec l'examen clinique.
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <motion.button
          type="button"
          onClick={onEdit}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/85 transition hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
        >
          Modifier
        </motion.button>
        <motion.button
          type="button"
          onClick={onReset}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/70 transition hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
        >
          <RefreshIcon className="h-3.5 w-3.5" />
          Recommencer
        </motion.button>
        <motion.button
          type="button"
          onClick={onBackHome}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="gradient-bg flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20"
        >
          Retour à l'accueil
        </motion.button>
      </div>
    </motion.div>
  );
}

function ScoreCard({
  label,
  score,
  max,
  threshold,
  high,
  subtitle,
}: {
  label: string;
  score: number;
  max: number;
  threshold: number;
  high: boolean;
  subtitle: string;
}) {
  const pct = (score / max) * 100;
  const thresholdPct = (threshold / max) * 100;
  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        high
          ? "border-accent-warning/35 bg-accent-warning/[0.08]"
          : "border-accent-success/30 bg-accent-success/[0.06]",
      )}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span
          className={cn(
            "font-display text-3xl font-black tracking-tight",
            high ? "text-accent-warning" : "text-accent-success",
          )}
        >
          {score}
        </span>
        <span className="text-sm font-medium text-white/45">/ {max}</span>
        <span
          className={cn(
            "ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em]",
            high
              ? "bg-accent-warning/15 text-accent-warning"
              : "bg-accent-success/15 text-accent-success",
          )}
        >
          {subtitle}
        </span>
      </div>
      <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-white/[0.05]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            high ? "bg-accent-warning" : "bg-accent-success",
          )}
        />
        <div
          className="absolute top-0 h-full w-px bg-white/40"
          style={{ left: `${thresholdPct}%` }}
          aria-hidden
        />
      </div>
      <div className="mt-1 flex items-center justify-between text-[10px] text-white/35">
        <span>0</span>
        <span>seuil {threshold}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
