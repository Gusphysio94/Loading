import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { HistoryEntry } from "../lib/history";
import type { Severity } from "../types/tree";
import { trees } from "../data/trees";
import { cn } from "../lib/cn";
import { TrashIcon } from "./icons";
import { chronicityShort } from "../types/patient";

type StatsScreenProps = {
  history: HistoryEntry[];
  onClear: () => void;
};

const severityLabels: Record<Severity, string> = {
  success: "Charge tolérée",
  warning: "À ajuster",
  danger: "Stop / spécialiste",
  neutral: "Autre",
};

const severityColors: Record<Severity, string> = {
  success: "text-accent-success",
  warning: "text-accent-warning",
  danger: "text-accent-danger",
  neutral: "text-white/70",
};

const severityBg: Record<Severity, string> = {
  success: "bg-accent-success",
  warning: "bg-accent-warning",
  danger: "bg-accent-danger",
  neutral: "bg-white/40",
};

export function StatsScreen({ history, onClear }: StatsScreenProps) {
  const [confirming, setConfirming] = useState(false);

  const totals = useMemo(() => {
    const byTree: Record<string, number> = {};
    const bySeverity: Record<Severity, number> = {
      success: 0,
      warning: 0,
      danger: 0,
      neutral: 0,
    };
    let evaSum = 0;
    let evaCount = 0;

    for (const e of history) {
      byTree[e.treeId] = (byTree[e.treeId] ?? 0) + 1;
      bySeverity[e.severity] = (bySeverity[e.severity] ?? 0) + 1;
      if (typeof e.evaPeak === "number") {
        evaSum += e.evaPeak;
        evaCount++;
      }
    }

    return {
      total: history.length,
      byTree,
      bySeverity,
      evaAvg: evaCount > 0 ? evaSum / evaCount : null,
    };
  }, [history]);

  return (
    <motion.div
      key="stats"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex w-full max-w-3xl flex-col px-5 pb-12 pt-8 sm:pt-12"
    >
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
        Statistiques privées
      </span>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
        {history.length} évaluation{history.length > 1 ? "s" : ""} en mémoire
      </h2>
      <p className="mt-2 text-sm text-white/55">
        Stockées localement sur ton appareil — aucune donnée n'est transmise.
        Les 50 dernières évaluations sont conservées.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Total"
          value={String(totals.total)}
          accent="text-white"
        />
        <StatCard
          label="EVA moyenne"
          value={
            totals.evaAvg !== null ? totals.evaAvg.toFixed(1) + "/10" : "—"
          }
          accent="text-brand-pink"
        />
        <StatCard
          label="% charge tolérée"
          value={
            totals.total > 0
              ? Math.round(
                  ((totals.bySeverity.success ?? 0) / totals.total) * 100,
                ) + " %"
              : "—"
          }
          accent="text-accent-success"
        />
      </div>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
          Répartition par sévérité
        </h3>
        <div className="mt-4 space-y-3">
          {(["success", "warning", "danger"] as const).map((s) => {
            const count = totals.bySeverity[s] ?? 0;
            const pct = totals.total > 0 ? (count / totals.total) * 100 : 0;
            return (
              <div key={s}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className={cn("font-medium", severityColors[s])}>
                    {severityLabels[s]}
                  </span>
                  <span className="font-mono text-white/55">
                    {count} · {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className={cn("h-full rounded-full", severityBg[s])}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
          Par activité
        </h3>
        <div className="mt-4 space-y-3">
          {trees.map((t) => {
            const count = totals.byTree[t.id] ?? 0;
            const pct = totals.total > 0 ? (count / totals.total) * 100 : 0;
            return (
              <div key={t.id}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-white/85">
                    {t.shortTitle}
                  </span>
                  <span className="font-mono text-white/55">
                    {count} · {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="gradient-bg h-full rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {history.length > 0 && (
        <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Dernières évaluations
          </h3>
          <ul className="mt-3 divide-y divide-white/5">
            {history.slice(0, 8).map((e) => (
              <li key={e.id} className="flex items-center gap-3 py-2.5">
                <div
                  className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    severityBg[e.severity],
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-white/55">
                    <span>
                      {new Date(e.date).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-white/25">·</span>
                    <span>{e.treeTitle}</span>
                  </div>
                  <div className="truncate text-sm text-white/85">
                    {e.recommendationTitle}
                    {e.patientInitials && (
                      <span className="text-white/40"> · {e.patientInitials}</span>
                    )}
                    {e.evaPeak !== undefined && (
                      <span className="text-white/40"> · EVA {e.evaPeak}/10</span>
                    )}
                    {e.patientChronicity && (
                      <span className="text-white/40">
                        {" "}· {chronicityShort[e.patientChronicity]}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8">
        {confirming ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/70 transition hover:border-white/25 hover:bg-white/[0.08]"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => {
                onClear();
                setConfirming(false);
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-accent-danger/40 bg-accent-danger/15 px-4 py-3 text-sm font-semibold text-accent-danger transition hover:bg-accent-danger/20"
            >
              <TrashIcon className="h-4 w-4" />
              Confirmer la suppression
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs font-medium text-white/55 transition hover:border-accent-danger/30 hover:bg-accent-danger/[0.05] hover:text-accent-danger"
          >
            <TrashIcon className="h-3.5 w-3.5" />
            Effacer l'historique
          </button>
        )}
      </div>
    </motion.div>
  );
}

function StatCard(props: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
        {props.label}
      </div>
      <div
        className={cn(
          "mt-1 text-2xl font-black tracking-tight",
          props.accent,
        )}
      >
        {props.value}
      </div>
    </div>
  );
}
