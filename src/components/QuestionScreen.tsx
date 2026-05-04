import { motion } from "framer-motion";
import type { QuestionNode } from "../types/tree";
import { cn } from "../lib/cn";
import { ThumbUpIcon, ThumbDownIcon } from "./icons";

type QuestionScreenProps = {
  node: QuestionNode;
  onAnswer: (nextId: string) => void;
};

export function QuestionScreen({ node, onAnswer }: QuestionScreenProps) {
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
          {node.subtitle}
        </span>
      )}
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        {node.title}
      </h2>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {node.choices.map((choice, idx) => (
          <motion.button
            key={choice.label + idx}
            type="button"
            onClick={() => onAnswer(choice.next)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "group relative overflow-hidden rounded-2xl border px-6 py-7 text-left transition-colors",
              choice.variant === "yes" &&
                "border-brand-coral/30 bg-brand-coral/5 hover:border-brand-coral/60 hover:bg-brand-coral/10",
              choice.variant === "no" &&
                "border-accent-success/30 bg-accent-success/5 hover:border-accent-success/60 hover:bg-accent-success/10",
              !choice.variant &&
                "border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]",
            )}
          >
            <div
              className={cn(
                "absolute inset-x-0 top-0 h-px opacity-50",
                choice.variant === "yes" && "bg-brand-coral",
                choice.variant === "no" && "bg-accent-success",
                !choice.variant && "bg-white/30",
              )}
            />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div
                  className={cn(
                    "text-xs font-semibold uppercase tracking-[0.15em]",
                    choice.variant === "yes" && "text-brand-coral/80",
                    choice.variant === "no" && "text-accent-success/80",
                    !choice.variant && "text-white/50",
                  )}
                >
                  Réponse
                </div>
                <div className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {choice.label}
                </div>
              </div>
              {choice.variant === "yes" && (
                <ThumbUpIcon
                  className="h-7 w-7 shrink-0 text-brand-coral/55 transition-transform group-hover:scale-110"
                  aria-hidden
                />
              )}
              {choice.variant === "no" && (
                <ThumbDownIcon
                  className="h-7 w-7 shrink-0 text-accent-success/55 transition-transform group-hover:scale-110"
                  aria-hidden
                />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {node.hint && (
        <p className="mt-6 text-sm text-white/50">{node.hint}</p>
      )}
    </motion.div>
  );
}
