import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { glossary } from "../data/glossary";
import { cn } from "../lib/cn";

type GlossaryTermProps = {
  termId: keyof typeof glossary;
  children: React.ReactNode;
};

export function GlossaryTerm({ termId, children }: GlossaryTermProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const entry = glossary[termId];

  useLayoutEffect(() => {
    if (!open || !ref.current) return;
    const trigger = ref.current.getBoundingClientRect();
    const margin = 12;
    const width = Math.min(288, window.innerWidth - margin * 2);
    let left = trigger.left + trigger.width / 2 - width / 2;
    if (left + width > window.innerWidth - margin) {
      left = window.innerWidth - margin - width;
    }
    if (left < margin) left = margin;
    const top = trigger.bottom + 8 + window.scrollY;
    setPos({ left, top });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  if (!entry) return <>{children}</>;

  return (
    <span ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Définition : ${entry.term}`}
        className={cn(
          "inline-flex items-center gap-0.5 border-b border-dotted border-brand-pink/50 transition-colors hover:border-brand-pink",
          open ? "text-brand-pink" : "text-current",
        )}
      >
        {children}
        <span
          aria-hidden
          className="ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-current/40 text-[8px] font-bold"
        >
          ?
        </span>
      </button>
      {open &&
        pos &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            style={{ left: pos.left, top: pos.top, width: 288 }}
            className="absolute z-50 max-w-[calc(100vw-24px)] rounded-xl border border-white/15 bg-night-300/95 px-4 py-3 text-left text-xs leading-relaxed text-white/85 shadow-xl shadow-black/50 backdrop-blur-xl"
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-pink">
              {entry.term}
            </div>
            <div className="mt-1">{entry.definition}</div>
          </div>,
          document.body,
        )}
    </span>
  );
}
