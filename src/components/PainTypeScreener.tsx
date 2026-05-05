import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  painItems,
  scorePainAssessment,
  mechanismLabels,
  mechanismColors,
  mechanismShortDescriptions,
  orientationFor,
  type PainAnswer,
  type PainAssessment,
  type PainMechanism,
} from "../types/painType";
import { cn } from "../lib/cn";
import { RefreshIcon } from "./icons";

type PainTypeScreenerProps = {
  initial?: PainAssessment;
  onSave: (assessment: PainAssessment) => void;
  onBackHome: () => void;
};

export function PainTypeScreener({
  initial,
  onSave,
  onBackHome,
}: PainTypeScreenerProps) {
  const [answers, setAnswers] = useState<Record<string, PainAnswer>>(
    initial?.answers ?? {},
  );
  const [showResult, setShowResult] = useState(
    !!initial && Object.keys(initial.answers).length === painItems.length,
  );

  const allAnswered = painItems.every((it) => !!answers[it.id]);

  const score = useMemo(() => scorePainAssessment(answers), [answers]);

  function setAnswer(id: string, value: PainAnswer) {
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
      <PainTypeResult
        score={score}
        onEdit={() => setShowResult(false)}
        onReset={handleReset}
        onBackHome={onBackHome}
      />
    );
  }

  return (
    <motion.div
      key="painType-quiz"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-12 pt-8 sm:pt-12"
    >
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-pink/80">
        Classification mécanistique de la douleur
      </span>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        Quelle est la dominance de la douleur ?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-white/55">
        9 questions courtes pour estimer si la douleur est plutôt nociceptive,
        neuropathique ou nociplastique. Cadre IASP (Kosek 2021), items dérivés
        de Smart 2012, Nijs 2021, DN4 et CSI.
      </p>

      <ul className="mt-6 space-y-2.5">
        {painItems.map((item, idx) => {
          const answer = answers[item.id];
          return (
            <li
              key={item.id}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-[10px] font-semibold text-white/55">
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium leading-snug text-white/90 sm:text-[15px]">
                    {item.question}
                  </div>
                  {item.hint && (
                    <div className="mt-0.5 text-[11px] text-white/40">
                      {item.hint}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["yes", "no"] as PainAnswer[]).map((v) => {
                  const active = answer === v;
                  const label = v === "yes" ? "OUI" : "NON";
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAnswer(item.id, v)}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-sm font-semibold transition-colors",
                        active
                          ? v === "yes"
                            ? "border-brand-coral/60 bg-brand-coral/[0.12] text-white"
                            : "border-accent-success/60 bg-accent-success/[0.12] text-white"
                          : "border-white/10 bg-white/[0.025] text-white/55 hover:border-white/25 hover:bg-white/[0.05] hover:text-white/85",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3 text-xs text-white/55">
        <span>
          {Object.keys(answers).length} / {painItems.length} questions
        </span>
        {Object.keys(answers).length > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="font-medium text-white/45 hover:text-white/80 hover:underline"
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
        Voir le profil dominant
      </motion.button>
    </motion.div>
  );
}

function PainTypeResult({
  score,
  onEdit,
  onReset,
  onBackHome,
}: {
  score: ReturnType<typeof scorePainAssessment>;
  onEdit: () => void;
  onReset: () => void;
  onBackHome: () => void;
}) {
  const orientation = orientationFor(score);

  return (
    <motion.div
      key="painType-result"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-12 pt-8 sm:pt-12"
    >
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-pink/80">
        Profil mécanistique estimé
      </span>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        {orientation.title}
      </h2>
      {orientation.message && (
        <p className="mt-2 text-sm leading-relaxed text-white/65">
          {orientation.message}
        </p>
      )}

      {/* Triangle ternary plot */}
      <div className="surface-strong mt-6 rounded-2xl p-5 sm:p-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
          Dominance — visualisation
        </h3>
        <div className="mt-4 flex justify-center">
          <PainTriangle score={score} />
        </div>
      </div>

      {/* Per-mechanism bars */}
      <div className="mt-4 space-y-3">
        {(["nociceptive", "neuropathic", "nociplastic"] as PainMechanism[]).map(
          (m) => {
            const v = score[m];
            const isDominant = score.dominant === m;
            return (
              <div
                key={m}
                className={cn(
                  "rounded-2xl border px-5 py-4 transition-colors",
                  isDominant
                    ? "border-white/25 bg-white/[0.05]"
                    : "border-white/10 bg-white/[0.025]",
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: mechanismColors[m] }}
                      />
                      <span
                        className="text-sm font-bold uppercase tracking-wider"
                        style={{ color: mechanismColors[m] }}
                      >
                        {mechanismLabels[m]}
                      </span>
                      {isDominant && (
                        <span className="rounded-full border border-white/20 bg-white/[0.08] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/85">
                          dominant
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] leading-snug text-white/45">
                      {mechanismShortDescriptions[m]}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className="font-display text-2xl font-black tracking-tight"
                      style={{ color: mechanismColors[m] }}
                    >
                      {v}%
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${v}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: mechanismColors[m] }}
                  />
                </div>
              </div>
            );
          },
        )}
      </div>

      <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3 text-[11px] leading-relaxed text-white/45">
        <strong className="font-semibold text-white/65">Disclaimer.</strong>{" "}
        Outil d'orientation basé sur des heuristiques pondérées (Smart 2012,
        Nijs 2014/2021, Kosek 2021). Ne remplace ni un examen clinique
        complet, ni un avis médical en présence de drapeaux rouges. Les
        mécanismes peuvent coexister (Chimenti et al. 2018).
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <motion.button
          type="button"
          onClick={onEdit}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/85 transition hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
        >
          Modifier les réponses
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
          className="gradient-bg flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
        >
          Continuer l'évaluation
        </motion.button>
      </div>
    </motion.div>
  );
}

/**
 * Ternary plot — equilateral triangle with one corner per mechanism.
 * Position of the dot uses barycentric coordinates: each axis weighted
 * by its share of the total score.
 */
function PainTriangle({
  score,
}: {
  score: ReturnType<typeof scorePainAssessment>;
}) {
  // Convert percentages to barycentric: normalize so they sum to 1.
  const sum = score.nociceptive + score.neuropathic + score.nociplastic;
  const a = sum > 0 ? score.nociceptive / sum : 1 / 3;
  const b = sum > 0 ? score.neuropathic / sum : 1 / 3;
  const c = sum > 0 ? score.nociplastic / sum : 1 / 3;

  const size = 240;
  // corners (A=nociceptive bottom-left, B=neuropathic bottom-right, C=nociplastic top)
  const padding = 20;
  const A = { x: padding, y: size - padding };
  const B = { x: size - padding, y: size - padding };
  const C = { x: size / 2, y: padding };

  const px = a * A.x + b * B.x + c * C.x;
  const py = a * A.y + b * B.y + c * C.y;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="max-w-full"
      aria-label="Triangle de dominance des 3 mécanismes de douleur"
    >
      <defs>
        <linearGradient id="tri-edge-noc-neu" x1={A.x} y1={A.y} x2={B.x} y2={B.y} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={mechanismColors.nociceptive} stopOpacity="0.6" />
          <stop offset="100%" stopColor={mechanismColors.neuropathic} stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="tri-edge-neu-ncp" x1={B.x} y1={B.y} x2={C.x} y2={C.y} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={mechanismColors.neuropathic} stopOpacity="0.6" />
          <stop offset="100%" stopColor={mechanismColors.nociplastic} stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="tri-edge-ncp-noc" x1={C.x} y1={C.y} x2={A.x} y2={A.y} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={mechanismColors.nociplastic} stopOpacity="0.6" />
          <stop offset="100%" stopColor={mechanismColors.nociceptive} stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Background triangle */}
      <polygon
        points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />

      {/* Edges with gradients */}
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="url(#tri-edge-noc-neu)" strokeWidth="2" />
      <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke="url(#tri-edge-neu-ncp)" strokeWidth="2" />
      <line x1={C.x} y1={C.y} x2={A.x} y2={A.y} stroke="url(#tri-edge-ncp-noc)" strokeWidth="2" />

      {/* Inner reference grid (33% lines) */}
      {[1 / 3, 2 / 3].map((t, i) => {
        const m1 = { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t };
        const m2 = { x: B.x + (C.x - B.x) * t, y: B.y + (C.y - B.y) * t };
        const m3 = { x: C.x + (A.x - C.x) * t, y: C.y + (A.y - C.y) * t };
        return (
          <g key={i}>
            <line x1={m1.x} y1={m1.y} x2={m2.x} y2={m2.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1={m2.x} y1={m2.y} x2={m3.x} y2={m3.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1={m3.x} y1={m3.y} x2={m1.x} y2={m1.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          </g>
        );
      })}

      {/* Corner labels & dots */}
      <circle cx={A.x} cy={A.y} r="5" fill={mechanismColors.nociceptive} />
      <circle cx={B.x} cy={B.y} r="5" fill={mechanismColors.neuropathic} />
      <circle cx={C.x} cy={C.y} r="5" fill={mechanismColors.nociplastic} />

      <text
        x={A.x - 6}
        y={A.y + 18}
        fill={mechanismColors.nociceptive}
        fontSize="11"
        fontWeight="700"
        textAnchor="start"
        style={{ letterSpacing: "0.05em" }}
      >
        NOCICEPTIF
      </text>
      <text
        x={B.x + 6}
        y={B.y + 18}
        fill={mechanismColors.neuropathic}
        fontSize="11"
        fontWeight="700"
        textAnchor="end"
        style={{ letterSpacing: "0.05em" }}
      >
        NEUROPATHIQUE
      </text>
      <text
        x={C.x}
        y={C.y - 8}
        fill={mechanismColors.nociplastic}
        fontSize="11"
        fontWeight="700"
        textAnchor="middle"
        style={{ letterSpacing: "0.05em" }}
      >
        NOCIPLASTIQUE
      </text>

      {/* Dominant point */}
      <motion.circle
        initial={{ opacity: 0, r: 0 }}
        animate={{ opacity: 1, r: 9 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        cx={px}
        cy={py}
        fill="url(#tri-dot-grad)"
        stroke="#fff"
        strokeWidth="2"
      />
      <defs>
        <radialGradient id="tri-dot-grad">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#a64bff" />
        </radialGradient>
      </defs>
    </svg>
  );
}
