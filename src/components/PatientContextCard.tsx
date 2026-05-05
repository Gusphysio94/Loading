import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PatientContext, Chronicity } from "../types/patient";
import { chronicityLabels, chronicityShort, hasContext } from "../types/patient";
import { labelFor } from "../types/bodyMap";
import { cn } from "../lib/cn";
import { ChevronRightIcon } from "./icons";

type PatientContextCardProps = {
  context: PatientContext;
  onChange: (ctx: PatientContext) => void;
  onClear: () => void;
  onOpenBodyMap: () => void;
};

const chronicityOptions: Chronicity[] = ["aigu", "subaigu", "chronique"];

export function PatientContextCard({
  context,
  onChange,
  onClear,
  onOpenBodyMap,
}: PatientContextCardProps) {
  const filled = hasContext(context);
  const [open, setOpen] = useState(filled);
  const zoneCount = context.bodyZones?.length ?? 0;

  const summary = [
    context.initials ? `${context.initials}` : null,
    context.location ? context.location : null,
    zoneCount > 0
      ? `${zoneCount} zone${zoneCount > 1 ? "s" : ""}`
      : null,
    context.chronicity ? chronicityShort[context.chronicity] : null,
  ]
    .filter(Boolean)
    .join(" · ");

  function update(patch: Partial<PatientContext>) {
    onChange({ ...context, ...patch });
  }

  return (
    <div className="surface mt-7 overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-white/70">
          <UserIcon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
            Contexte patient (optionnel)
          </div>
          <div className="text-sm font-medium text-white/85">
            {filled ? summary : "Initiales · localisation · chronicité"}
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
            <div className="space-y-4 border-t border-white/8 px-5 pb-5 pt-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Initiales / code patient
                </label>
                <input
                  type="text"
                  inputMode="text"
                  maxLength={12}
                  placeholder="ex. M.D. ou P0042"
                  value={context.initials ?? ""}
                  onChange={(e) =>
                    update({ initials: e.target.value || undefined })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-brand-pink/60 focus:bg-white/[0.06] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Localisation de la douleur
                </label>
                <input
                  type="text"
                  inputMode="text"
                  maxLength={60}
                  placeholder="ex. tendon d'Achille D, épaule G"
                  value={context.location ?? ""}
                  onChange={(e) =>
                    update({ location: e.target.value || undefined })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-brand-pink/60 focus:bg-white/[0.06] focus:outline-none"
                />

                <button
                  type="button"
                  onClick={onOpenBodyMap}
                  className="group mt-2 flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-left text-xs font-medium text-white/65 transition hover:border-brand-pink/40 hover:bg-brand-pink/[0.06] hover:text-white/90"
                >
                  <BodyIcon className="h-4 w-4 text-brand-pink/70 group-hover:text-brand-pink" />
                  {zoneCount > 0
                    ? `${zoneCount} zone${zoneCount > 1 ? "s" : ""} sélectionnée${zoneCount > 1 ? "s" : ""} sur le schéma`
                    : "Sélectionner sur le schéma corporel"}
                  <span className="ml-auto text-white/35 group-hover:text-brand-pink/70">
                    →
                  </span>
                </button>

                {zoneCount > 0 && context.bodyZones && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {context.bodyZones.map((id) => (
                      <span
                        key={id}
                        className="rounded-full border border-brand-coral/30 bg-brand-coral/[0.08] px-2 py-0.5 text-[10px] font-medium text-brand-coral"
                      >
                        {labelFor(id)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Chronicité
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {chronicityOptions.map((c) => {
                    const active = context.chronicity === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() =>
                          update({ chronicity: active ? undefined : c })
                        }
                        className={cn(
                          "rounded-xl border px-2 py-2.5 text-xs font-medium transition-colors",
                          active
                            ? "border-brand-pink/60 bg-brand-pink/[0.12] text-white"
                            : "border-white/10 bg-white/[0.025] text-white/65 hover:border-white/20 hover:bg-white/[0.05] hover:text-white/85",
                        )}
                      >
                        <div className="font-semibold">
                          {chronicityShort[c]}
                        </div>
                        <div className="mt-0.5 text-[10px] text-white/40">
                          {chronicityLabels[c].replace(/^[^(]+/, "").replace(/[()]/g, "")}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {filled && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-xs font-medium text-white/45 hover:text-white/80 hover:underline"
                >
                  Effacer le contexte
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BodyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="4" r="2" />
      <path d="M9 7h6l-1 5v8h-1.5v-5h-1V20H10v-8L9 7z" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
