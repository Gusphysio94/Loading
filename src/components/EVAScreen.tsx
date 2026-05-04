import { useState } from "react";
import { motion } from "framer-motion";
import type { EVANode } from "../types/tree";
import { cn } from "../lib/cn";
import { GlossaryTerm } from "./Glossary";

type EVAScreenProps = {
  node: EVANode;
  initialValue?: number;
  onConfirm: (value: number, nextId: string) => void;
};

const FACES = ["😌", "🙂", "😐", "😕", "😣", "😖", "😫", "😩", "🥵", "😱", "🤯"];

function severityFor(value: number, threshold: number): {
  color: string;
  bg: string;
  text: string;
  label: string;
} {
  if (value === 0) {
    return {
      color: "var(--color-accent-success)",
      bg: "rgba(52,211,153,0.12)",
      text: "text-accent-success",
      label: "Aucune douleur",
    };
  }
  if (value <= threshold) {
    return {
      color: "var(--color-accent-success)",
      bg: "rgba(52,211,153,0.12)",
      text: "text-accent-success",
      label: "Tolérable — sous le seuil",
    };
  }
  if (value <= 6) {
    return {
      color: "var(--color-accent-warning)",
      bg: "rgba(251,191,36,0.12)",
      text: "text-accent-warning",
      label: "Au-dessus du seuil — adapter la charge",
    };
  }
  return {
    color: "var(--color-accent-danger)",
    bg: "rgba(248,113,113,0.12)",
    text: "text-accent-danger",
    label: "Très élevée — adaptation nette nécessaire",
  };
}

export function EVAScreen({ node, initialValue, onConfirm }: EVAScreenProps) {
  const [value, setValue] = useState<number>(initialValue ?? 0);
  const sev = severityFor(value, node.threshold);

  function handleConfirm() {
    const nextId =
      value > node.threshold ? node.above.next : node.belowOrEqual.next;
    onConfirm(value, nextId);
  }

  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-12 pt-8 sm:pt-12"
    >
      {node.subtitle && (
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
          Échelle visuelle analogique{" "}
          <GlossaryTerm termId="eva">(EVA)</GlossaryTerm> · seuil clé : 4/10
        </span>
      )}
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        {node.title}
      </h2>

      <div className="mt-10 flex flex-col items-center">
        <motion.div
          key={value}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, type: "spring", stiffness: 300 }}
          className="text-7xl"
          aria-hidden
        >
          {FACES[Math.min(Math.max(value, 0), 10)]}
        </motion.div>

        <div className="mt-3 flex items-baseline gap-2 font-display">
          <span
            className={cn(
              "text-7xl font-black leading-none tracking-tight",
              sev.text,
            )}
          >
            {value}
          </span>
          <span className="text-2xl font-semibold text-white/40">/10</span>
        </div>

        <span
          className={cn(
            "mt-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]",
            sev.text,
          )}
          style={{ backgroundColor: sev.bg }}
        >
          {sev.label}
        </span>
      </div>

      <div className="mt-10">
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value, 10))}
          aria-label="Intensité de la douleur sur 10"
          className="eva-slider"
          style={
            {
              "--eva-color": sev.color,
              "--eva-progress": `${(value / 10) * 100}%`,
            } as React.CSSProperties
          }
        />

        <div className="mt-3 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
          <span>{node.minLabel ?? "0"}</span>
          <span className="text-brand-pink/70">Seuil {node.threshold}/10</span>
          <span>{node.maxLabel ?? "10"}</span>
        </div>

        <div className="mt-2 grid grid-cols-11 gap-0.5">
          {Array.from({ length: 11 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setValue(i)}
              aria-label={`Sélectionner ${i} sur 10`}
              className={cn(
                "rounded-md py-1.5 text-[11px] font-semibold transition-colors",
                i === value
                  ? "bg-white/15 text-white"
                  : "bg-white/[0.03] text-white/45 hover:bg-white/[0.08] hover:text-white/80",
              )}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <motion.button
        type="button"
        onClick={handleConfirm}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="gradient-bg mt-10 flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
      >
        Valider · {value}/10
      </motion.button>
    </motion.div>
  );
}
