import { motion } from "framer-motion";
import { ArrowLeftIcon, HomeIcon } from "./icons";

type HeaderProps = {
  treeTitle?: string;
  canGoBack: boolean;
  onBack: () => void;
  onHome: () => void;
};

export function Header({ treeTitle, canGoBack, onBack, onHome }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-night-500/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-3">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          aria-label="Retour"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:bg-white/[0.04]"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
            Loading
          </div>
          {treeTitle && (
            <motion.div
              key={treeTitle}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="truncate text-sm font-semibold text-white/85"
            >
              {treeTitle}
            </motion.div>
          )}
        </div>

        <button
          type="button"
          onClick={onHome}
          aria-label="Accueil"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
        >
          <HomeIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
