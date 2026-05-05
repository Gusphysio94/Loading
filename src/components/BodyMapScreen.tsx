import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bodyRegions, regionsById, type BodySide } from "../types/bodyMap";
import { cn } from "../lib/cn";

type BodyMapScreenProps = {
  initial?: string[];
  onSave: (zoneIds: string[]) => void;
  onCancel: () => void;
};

export function BodyMapScreen({
  initial = [],
  onSave,
  onCancel,
}: BodyMapScreenProps) {
  const [side, setSide] = useState<BodySide>("front");
  const [selected, setSelected] = useState<Set<string>>(new Set(initial));

  const visible = bodyRegions.filter((r) => r.side === side);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clear() {
    setSelected(new Set());
  }

  const selectedIds = [...selected];
  const selectedFront = selectedIds.filter((id) => id.startsWith("f_"));
  const selectedBack = selectedIds.filter((id) => id.startsWith("b_"));

  return (
    <motion.div
      key="bodymap"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-12 pt-8 sm:pt-12"
    >
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-pink/80">
        Localisation de la douleur
      </span>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        Schéma corporel
      </h2>
      <p className="mt-2 text-sm text-white/55">
        Touche les zones douloureuses. Plusieurs zones possibles.
      </p>

      <div className="mt-6 flex items-center justify-center">
        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.025] p-1">
          {(["front", "back"] as BodySide[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSide(s)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                side === s
                  ? "bg-white/15 text-white"
                  : "text-white/55 hover:text-white/85",
              )}
            >
              {s === "front" ? "Vue antérieure" : "Vue postérieure"}
            </button>
          ))}
        </div>
      </div>

      <div className="surface-strong mt-5 overflow-hidden rounded-2xl px-2 py-3 sm:px-4 sm:py-4">
        <BodySVG side={side} regions={visible} selected={selected} onToggle={toggle} />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3 text-xs text-white/55">
        <span>
          {selected.size} zone{selected.size > 1 ? "s" : ""} sélectionnée
          {selected.size > 1 ? "s" : ""}
        </span>
        {selected.size > 0 && (
          <button
            type="button"
            onClick={clear}
            className="font-semibold text-white/45 hover:text-white/85 hover:underline"
          >
            Tout désélectionner
          </button>
        )}
      </div>

      {selected.size > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <AnimatePresence>
            {selectedIds.map((id) => {
              const region = regionsById[id];
              if (!region) return null;
              return (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => toggle(id)}
                  className="group flex items-center gap-1 rounded-full border border-brand-coral/35 bg-brand-coral/[0.10] px-2.5 py-0.5 text-[11px] font-medium text-brand-coral transition hover:border-brand-coral/60 hover:bg-brand-coral/[0.18]"
                >
                  {region.label}
                  <span className="text-brand-coral/60 group-hover:text-brand-coral">
                    ×
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {(selectedFront.length > 0 && side === "back") ||
      (selectedBack.length > 0 && side === "front") ? (
        <p className="mt-2 text-[11px] text-white/35">
          Note : tu as aussi des zones sélectionnées sur l'autre vue. Bascule
          le toggle pour les voir.
        </p>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-medium text-white/70 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
        >
          Annuler
        </motion.button>
        <motion.button
          type="button"
          onClick={() => onSave(selectedIds)}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="gradient-bg flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
        >
          Valider
          {selected.size > 0 && (
            <span className="ml-1 text-white/85">· {selected.size}</span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

type BodySVGProps = {
  side: BodySide;
  regions: typeof bodyRegions;
  selected: Set<string>;
  onToggle: (id: string) => void;
};

function BodySVG({ side, regions, selected, onToggle }: BodySVGProps) {
  return (
    <svg
      viewBox="0 0 400 620"
      className="mx-auto w-full max-w-[340px]"
      role="img"
      aria-label={`Schéma corporel — vue ${side === "front" ? "antérieure" : "postérieure"}`}
    >
      <defs>
        <linearGradient id="silhouette-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
        </linearGradient>
        <linearGradient id="region-active" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF5470" />
          <stop offset="100%" stopColor="#F04EA0" />
        </linearGradient>
      </defs>

      {/* Silhouette */}
      <Silhouette side={side} />

      {/* Hit zones + selected highlights */}
      {regions.map((r) => {
        const isSelected = selected.has(r.id);
        return (
          <g key={r.id}>
            <ellipse
              cx={r.cx}
              cy={r.cy}
              rx={r.rx}
              ry={r.ry}
              fill={isSelected ? "url(#region-active)" : "transparent"}
              fillOpacity={isSelected ? 0.55 : 0}
              stroke={isSelected ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.10)"}
              strokeWidth={isSelected ? 1.5 : 0.6}
              strokeDasharray={isSelected ? undefined : "2 3"}
              style={{ cursor: "pointer" }}
              onClick={() => onToggle(r.id)}
            />
            <title>{r.label}</title>
          </g>
        );
      })}
    </svg>
  );
}

function Silhouette({ side }: { side: BodySide }) {
  // Stylized monochrome body silhouette. Front and back share most paths.
  // Width 400, height 620, body centered around x=200.
  const fill = "url(#silhouette-grad)";
  const stroke = "rgba(255,255,255,0.18)";
  const sw = 1.5;

  return (
    <g fill={fill} stroke={stroke} strokeWidth={sw}>
      {/* Head */}
      <ellipse cx={200} cy={50} rx={30} ry={36} />
      {/* Neck */}
      <rect x={188} y={82} width={24} height={22} rx={4} />
      {/* Torso (with shoulder slope) */}
      <path
        d="M 152 110
           Q 148 102 145 105
           L 110 130
           Q 105 140 110 150
           L 130 200
           L 130 260
           Q 130 270 138 275
           L 165 280
           L 165 290
           Q 165 295 170 295
           L 230 295
           Q 235 295 235 290
           L 235 280
           L 262 275
           Q 270 270 270 260
           L 270 200
           L 290 150
           Q 295 140 290 130
           L 255 105
           Q 252 102 248 110
           Q 220 116 200 116
           Q 180 116 152 110 Z"
      />
      {/* Left arm */}
      <path
        d="M 130 130
           L 100 230
           L 90 270
           L 85 310
           L 86 320
           L 95 322
           L 100 312
           L 105 270
           L 115 230
           L 130 145 Z"
      />
      {/* Right arm */}
      <path
        d="M 270 130
           L 300 230
           L 310 270
           L 315 310
           L 314 320
           L 305 322
           L 300 312
           L 295 270
           L 285 230
           L 270 145 Z"
      />
      {/* Left leg */}
      <path
        d="M 165 295
           L 155 380
           L 152 460
           L 154 540
           L 156 590
           L 188 590
           L 190 540
           L 188 460
           L 188 380
           L 188 295 Z"
      />
      {/* Right leg */}
      <path
        d="M 235 295
           L 245 380
           L 248 460
           L 246 540
           L 244 590
           L 212 590
           L 210 540
           L 212 460
           L 212 380
           L 212 295 Z"
      />
      {/* Feet */}
      <ellipse cx={172} cy={602} rx={22} ry={12} />
      <ellipse cx={228} cy={602} rx={22} ry={12} />

      {/* Subtle "back" indicator: a vertical center line on the back view */}
      {side === "back" && (
        <line
          x1={200}
          y1={120}
          x2={200}
          y2={290}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1}
          strokeDasharray="3 4"
        />
      )}
    </g>
  );
}
