import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PostSessionLoad } from "../types/session";
import { loadAU, zoneFromAU, zoneLabels } from "../types/session";
import { cn } from "../lib/cn";
import { ChevronRightIcon, BarChartIcon, CheckIcon } from "./icons";

const RPE_FACES = ["😌", "🙂", "😐", "🙂‍↔️", "😯", "😤", "😣", "🥵", "😫", "🤯", "😱"];

const RPE_LABELS: string[] = [
  "Aucun effort",
  "Très facile",
  "Facile",
  "Modéré",
  "Modéré +",
  "Difficile",
  "Difficile +",
  "Très difficile",
  "Très difficile +",
  "Maximal",
  "Effort absolu",
];

type SRPECardProps = {
  value: PostSessionLoad | undefined;
  suggestedDurationMin?: number;
  onChange: (value: PostSessionLoad) => void;
};

const zoneColor: Record<string, string> = {
  low: "text-accent-success",
  moderate: "text-accent-warning",
  high: "text-accent-warning",
  veryHigh: "text-accent-danger",
};

const zoneBg: Record<string, string> = {
  low: "bg-accent-success/15",
  moderate: "bg-accent-warning/15",
  high: "bg-accent-warning/20",
  veryHigh: "bg-accent-danger/15",
};

export function SRPECard({
  value,
  suggestedDurationMin,
  onChange,
}: SRPECardProps) {
  const [open, setOpen] = useState(false);
  const [rpe, setRpe] = useState<number>(value?.srpe ?? 5);
  const [duration, setDuration] = useState<number>(
    value?.actualDuration ?? suggestedDurationMin ?? 60,
  );

  const saved = value?.srpe !== undefined && value?.actualDuration !== undefined;
  const au = saved ? loadAU(value!.srpe!, value!.actualDuration!) : null;
  const zone = au !== null ? zoneFromAU(au) : null;

  const previewAU = loadAU(rpe, duration);
  const previewZone = zoneFromAU(previewAU);

  function handleSave() {
    onChange({ srpe: rpe, actualDuration: duration });
    setOpen(false);
  }

  function handleClear() {
    onChange({ srpe: undefined, actualDuration: undefined });
  }

  return (
    <section className="no-print mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            saved && zone
              ? `${zoneBg[zone]} ${zoneColor[zone]}`
              : "border border-white/10 bg-white/[0.03] text-white/65",
          )}
        >
          {saved ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <BarChartIcon className="h-4 w-4" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
            Charge interne · sRPE Foster
          </div>
          <div className="text-sm font-medium text-white/85">
            {saved && au !== null && zone ? (
              <>
                <span className="font-bold text-white">{au} UA</span>
                <span className="text-white/40">
                  {" "}· {value!.srpe}/10 × {value!.actualDuration} min ·{" "}
                </span>
                <span className={zoneColor[zone]}>{zoneLabels[zone]}</span>
              </>
            ) : (
              "Saisir l'effort perçu de la séance (optionnel)"
            )}
          </div>
        </div>
        <ChevronRightIcon
          className={cn(
            "h-4 w-4 shrink-0 text-white/40 transition-transform",
            open && "rotate-90",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-5 border-t border-white/8 px-5 pb-5 pt-5">
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Effort perçu (Borg CR-10)
                </label>
                <p className="text-xs text-white/50">
                  À quel point la séance a-t-elle été dure dans son ensemble ?
                  Idéal : 15-30 min après la séance.
                </p>

                <div className="mt-4 flex flex-col items-center">
                  <div className="text-5xl" aria-hidden>
                    {RPE_FACES[Math.min(Math.max(rpe, 0), 10)]}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span
                      className={cn(
                        "text-5xl font-black leading-none tracking-tight",
                        zoneColor[previewZone],
                      )}
                    >
                      {rpe}
                    </span>
                    <span className="text-lg font-semibold text-white/40">
                      /10
                    </span>
                  </div>
                  <div className="mt-1 text-xs font-medium text-white/55">
                    {RPE_LABELS[rpe]}
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={rpe}
                  onChange={(e) => setRpe(parseInt(e.target.value, 10))}
                  aria-label="Effort perçu sur 10"
                  className="eva-slider mt-4"
                  style={
                    {
                      "--eva-color":
                        previewZone === "low"
                          ? "var(--color-accent-success)"
                          : previewZone === "veryHigh"
                            ? "var(--color-accent-danger)"
                            : "var(--color-accent-warning)",
                      "--eva-progress": `${(rpe / 10) * 100}%`,
                    } as React.CSSProperties
                  }
                />

                <div className="mt-3 grid grid-cols-11 gap-0.5">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRpe(i)}
                      aria-label={`RPE ${i} sur 10`}
                      className={cn(
                        "rounded-md py-1.5 text-[11px] font-semibold transition-colors",
                        i === rpe
                          ? "bg-white/15 text-white"
                          : "bg-white/[0.03] text-white/45 hover:bg-white/[0.08] hover:text-white/80",
                      )}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Durée totale de la séance
                </label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="numeric"
                    step={5}
                    min={1}
                    value={duration}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      setDuration(Number.isNaN(v) ? 0 : v);
                    }}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-brand-pink/60 focus:bg-white/[0.06] focus:outline-none"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40">
                    min
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <div className="text-xs text-white/55">
                  Charge interne (UA)
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={cn(
                      "text-2xl font-black tracking-tight",
                      zoneColor[previewZone],
                    )}
                  >
                    {previewAU}
                  </span>
                  <span className="text-xs text-white/40">
                    UA · {zoneLabels[previewZone]}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {saved && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-white/55 transition hover:border-accent-danger/30 hover:bg-accent-danger/[0.06] hover:text-accent-danger"
                  >
                    Effacer
                  </button>
                )}
                <motion.button
                  type="button"
                  onClick={handleSave}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="gradient-bg flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20"
                >
                  Enregistrer · {previewAU} UA
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
