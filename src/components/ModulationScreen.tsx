import { motion } from "framer-motion";
import type { ModulationNode } from "../types/tree";
import type { SessionInputs } from "../types/session";
import { hasAnyInput } from "../types/session";
import { cn } from "../lib/cn";
import { CheckIcon, ClockIcon } from "./icons";
import { withInlineGlossary } from "./InlineGlossary";
import { bulletComputers } from "../data/bulletComputers";

type ModulationScreenProps = {
  node: ModulationNode;
  inputs?: SessionInputs;
  onAnswer: (nextId: string) => void;
};

export function ModulationScreen({
  node,
  inputs,
  onAnswer,
}: ModulationScreenProps) {
  const computer = node.computeBulletsKey
    ? bulletComputers[node.computeBulletsKey]
    : undefined;
  const usePersonalized = computer && hasAnyInput(inputs);
  const bullets = usePersonalized && inputs ? computer(inputs) : node.bullets;

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
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-pink/80">
          {node.subtitle}
        </span>
      )}
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        {node.title}
      </h2>

      {usePersonalized && (
        <div className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-brand-pink/30 bg-brand-pink/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-pink">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
          Personnalisé
        </div>
      )}

      <div className="surface-strong mt-6 overflow-hidden rounded-2xl">
        <div className="gradient-bg h-[3px]" />
        <ul className="divide-y divide-white/5">
          {bullets.map((bullet, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.05 + i * 0.04 }}
              className="flex items-start gap-3 px-5 py-4"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-pink/15 text-brand-pink">
                <CheckIcon className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm leading-relaxed text-white/85 sm:text-base">
                {withInlineGlossary(bullet)}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      {node.temporalNote && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent-warning/30 bg-accent-warning/[0.08] px-3 py-1.5 text-xs font-medium text-accent-warning">
          <ClockIcon className="h-3.5 w-3.5" />
          {node.temporalNote}
        </div>
      )}

      {node.followUp && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white/90 sm:text-xl">
            {node.followUp}
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {node.choices.map((choice, idx) => (
              <motion.button
                key={choice.label + idx}
                type="button"
                onClick={() => onAnswer(choice.next)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border px-5 py-5 text-left transition-colors",
                  choice.variant === "yes" &&
                    "border-accent-success/30 bg-accent-success/5 hover:border-accent-success/60 hover:bg-accent-success/10",
                  choice.variant === "no" &&
                    "border-brand-coral/30 bg-brand-coral/5 hover:border-brand-coral/60 hover:bg-brand-coral/10",
                  !choice.variant &&
                    "border-white/10 bg-white/[0.03] hover:border-white/30",
                )}
              >
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-px opacity-60",
                    choice.variant === "yes" && "bg-accent-success",
                    choice.variant === "no" && "bg-brand-coral",
                    !choice.variant && "bg-white/30",
                  )}
                />
                <div
                  className={cn(
                    "text-xs font-semibold uppercase tracking-[0.15em]",
                    choice.variant === "yes" && "text-accent-success/80",
                    choice.variant === "no" && "text-brand-coral/80",
                    !choice.variant && "text-white/50",
                  )}
                >
                  C'est mieux ?
                </div>
                <div className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {choice.label}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
