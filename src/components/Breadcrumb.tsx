import { motion } from "framer-motion";
import type { Tree } from "../types/tree";
import { maxDepth } from "../lib/depth";

type BreadcrumbProps = {
  tree: Tree;
  history: string[];
};

export function Breadcrumb({ tree, history }: BreadcrumbProps) {
  const currentId = history[history.length - 1];
  const remaining = maxDepth(tree, currentId);
  const total = Math.max(history.length + remaining - 1, history.length);
  const stepNumber = history.length;

  const segments = total;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-2 px-5 pt-4">
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
        <span>
          Étape {stepNumber} <span className="text-white/25">/ {total}</span>
        </span>
        <span className="text-white/35">{tree.shortTitle}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: segments }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            className={
              i < stepNumber - 1
                ? "h-1 flex-1 rounded-full bg-gradient-to-r from-brand-coral via-brand-pink to-brand-violet"
                : i === stepNumber - 1
                  ? "h-1 flex-1 rounded-full bg-white/35"
                  : "h-1 flex-1 rounded-full bg-white/10"
            }
          />
        ))}
      </div>
    </div>
  );
}
