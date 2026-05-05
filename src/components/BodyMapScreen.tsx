import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  bodyRegions,
  regionsById,
  triageZonesForRegions,
  type BodySide,
} from "../types/bodyMap";
import { triageZoneLabels } from "../types/triage";
import { cn } from "../lib/cn";
import { SkeletonFigure } from "./anatomy/SkeletonFigure";

type BodyMapScreenProps = {
  initial?: string[];
  /** Save zones only (legacy use). */
  onSave: (zoneIds: string[]) => void;
  /** Save zones + start the regional red-flag triage. */
  onSaveAndTriage?: (zoneIds: string[]) => void;
  onCancel: () => void;
};

export function BodyMapScreen({
  initial = [],
  onSave,
  onSaveAndTriage,
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

  const selectedIds = useMemo(() => [...selected], [selected]);
  const selectedFront = selectedIds.filter((id) => id.startsWith("f_"));
  const selectedBack = selectedIds.filter((id) => id.startsWith("b_"));
  const triageZones = useMemo(
    () => triageZonesForRegions(selectedIds),
    [selectedIds],
  );

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
        Triage en accès direct · localisation
      </span>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        Où la douleur se manifeste-t-elle ?
      </h2>
      <p className="mt-2 text-sm text-white/55">
        Touche les zones douloureuses sur le squelette. La sélection détermine
        le screening de drapeaux rouges spécifiques à la région.
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

      <div className="surface-strong mt-5 overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] px-2 py-3 sm:px-4 sm:py-4">
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

      {triageZones.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-3 rounded-xl border border-brand-violet/25 bg-brand-violet/[0.06] px-4 py-3"
        >
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-violet/85">
            Zones à screener ({triageZones.length})
          </div>
          <div className="mt-1 text-sm text-white/85">
            {triageZones.map((z) => triageZoneLabels[z]).join(" · ")}
          </div>
        </motion.div>
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
        {onSaveAndTriage ? (
          <motion.button
            type="button"
            onClick={() => onSaveAndTriage(selectedIds)}
            disabled={selected.size === 0}
            whileHover={{ y: selected.size === 0 ? 0 : -1 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition",
              selected.size === 0
                ? "cursor-not-allowed border border-white/10 bg-white/[0.04] text-white/35"
                : "gradient-bg shadow-brand-violet/20 hover:shadow-xl hover:shadow-brand-violet/30",
            )}
          >
            {selected.size === 0
              ? "Sélectionne au moins 1 zone"
              : `Lancer le screening RF · ${triageZones.length} zone${triageZones.length > 1 ? "s" : ""}`}
          </motion.button>
        ) : (
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
        )}
      </div>

      {onSaveAndTriage && (
        <button
          type="button"
          onClick={() => onSave(selectedIds)}
          className="mt-3 text-center text-xs text-white/40 transition hover:text-white/70 hover:underline"
        >
          Enregistrer la localisation sans lancer le screening
        </button>
      )}
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
      aria-label={`Squelette anatomique — vue ${side === "front" ? "antérieure" : "postérieure"}`}
    >
      <defs>
        <linearGradient id="region-active" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF5470" />
          <stop offset="100%" stopColor="#F04EA0" />
        </linearGradient>
        <radialGradient id="region-active-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255, 84, 112, 0.55)" />
          <stop offset="100%" stopColor="rgba(255, 84, 112, 0)" />
        </radialGradient>
      </defs>

      {/* Anatomical skeleton */}
      <SkeletonFigure side={side} />

      {/* Glow halos for selected regions (drawn before hit zones for layering) */}
      {regions.map((r) => {
        if (!selected.has(r.id)) return null;
        return (
          <ellipse
            key={`glow_${r.id}`}
            cx={r.cx}
            cy={r.cy}
            rx={r.rx * 1.25}
            ry={r.ry * 1.25}
            fill="url(#region-active-glow)"
            pointerEvents="none"
          />
        );
      })}

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
              fill={isSelected ? "url(#region-active)" : "rgba(255,255,255,0.001)"}
              fillOpacity={isSelected ? 0.5 : 1}
              stroke={isSelected ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.10)"}
              strokeWidth={isSelected ? 1.6 : 0.6}
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
