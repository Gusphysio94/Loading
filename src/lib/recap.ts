import type { BehaviorAdvice, RecapEntry, Tree } from "../types/tree";
import type { PatientContext } from "../types/patient";
import { chronicityLabels, hasContext } from "../types/patient";
import type { SessionInputs } from "../types/session";
import { hasAnyInput, formatPace, loadAU, zoneFromAU, zoneLabels } from "../types/session";

export function buildRecap(
  tree: Tree,
  history: string[],
  evaValues: Record<string, number> = {},
): RecapEntry[] {
  const entries: RecapEntry[] = [];
  for (let i = 0; i < history.length - 1; i++) {
    const node = tree.nodes[history[i]];
    if (!node) continue;
    if (node.kind === "recommendation") continue;
    const nextId = history[i + 1];

    if (node.kind === "eva") {
      const value = evaValues[node.id];
      if (value === undefined) continue;
      entries.push({
        label: node.recap ?? node.title,
        answer: `${value}/10`,
        kind: "eva",
      });
      continue;
    }

    const choice = node.choices.find((c) => c.next === nextId);
    if (!choice) continue;
    entries.push({
      label: node.recap ?? node.title,
      answer: choice.label,
      kind: node.kind,
      bullets: node.kind === "modulation" ? node.bullets : undefined,
    });
  }
  return entries;
}

function formatSessionInputsText(inputs: SessionInputs | null | undefined): string[] {
  if (!inputs || !hasAnyInput(inputs)) return [];
  const lines: string[] = ["", "Détails de la séance :"];
  const e = inputs.exercise;
  if (e) {
    if (e.exerciseName) lines.push(`• Exercice : ${e.exerciseName}`);
    const params: string[] = [];
    if (e.load !== undefined) params.push(`${e.load} kg`);
    if (e.sets !== undefined && e.reps !== undefined)
      params.push(`${e.sets}×${e.reps}`);
    else if (e.reps !== undefined) params.push(`${e.reps} reps`);
    if (e.tempo) params.push(`tempo ${e.tempo}`);
    if (e.amplitude)
      params.push(`amplitude ${e.amplitude === "full" ? "complète" : "partielle"}`);
    if (params.length) lines.push(`• Paramètres : ${params.join(" · ")}`);
  }
  const r = inputs.running;
  if (r) {
    if (r.sessionType) lines.push(`• Type de sortie : ${r.sessionType}`);
    const params: string[] = [];
    if (r.distance !== undefined) params.push(`${r.distance} km`);
    if (r.duration !== undefined) params.push(`${r.duration} min`);
    if (r.pace !== undefined) params.push(formatPace(r.pace));
    if (r.elevation !== undefined) params.push(`${r.elevation} m D+`);
    if (r.intervals !== undefined) params.push(`${r.intervals} intervalles`);
    if (params.length) lines.push(`• Paramètres : ${params.join(" · ")}`);
  }
  const s = inputs.sport;
  if (s) {
    if (s.sport) lines.push(`• Sport : ${s.sport}`);
    const params: string[] = [];
    if (s.sportType) params.push(s.sportType);
    if (s.duration !== undefined) params.push(`${s.duration} min`);
    if (s.hasMatchSoon !== undefined)
      params.push(`match prévu : ${s.hasMatchSoon ? "oui" : "non"}`);
    if (params.length) lines.push(`• Paramètres : ${params.join(" · ")}`);
  }
  const ps = inputs.postSession;
  if (
    ps &&
    ps.srpe !== undefined &&
    ps.actualDuration !== undefined
  ) {
    const au = loadAU(ps.srpe, ps.actualDuration);
    const zone = zoneLabels[zoneFromAU(au)];
    lines.push(
      `• Charge interne (Foster) : ${ps.srpe}/10 × ${ps.actualDuration} min = ${au} UA · ${zone}`,
    );
  }
  return lines;
}

function formatBehaviorText(behavior: BehaviorAdvice | undefined): string[] {
  if (!behavior) return [];
  const lines: string[] = [];
  if (behavior.toDo && behavior.toDo.length) {
    lines.push("");
    lines.push("À faire :");
    for (const it of behavior.toDo) lines.push(`  ✓ ${it}`);
  }
  if (behavior.toAvoid && behavior.toAvoid.length) {
    lines.push("");
    lines.push("À éviter :");
    for (const it of behavior.toAvoid) lines.push(`  ✗ ${it}`);
  }
  if (behavior.selfCare) {
    lines.push("");
    lines.push(`Auto-soin : ${behavior.selfCare}`);
  }
  if (behavior.alertSigns && behavior.alertSigns.length) {
    lines.push("");
    lines.push("Critères d'alerte (recontacter) :");
    for (const it of behavior.alertSigns) lines.push(`  ⚠ ${it}`);
  }
  return lines;
}

export function formatRecapAsText(args: {
  tree: Tree;
  recap: RecapEntry[];
  recommendationTitle: string;
  recommendationMessage: string;
  recommendationBehavior?: BehaviorAdvice;
  recommendationPatientScript?: string;
  patientContext?: PatientContext | null;
  sessionInputs?: SessionInputs | null;
  date?: Date;
}): string {
  const date = args.date ?? new Date();
  const dateStr = date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const lines: string[] = [];
  lines.push("LOADING — Évaluation gestion de charge");
  lines.push(`Activité : ${args.tree.title}`);
  lines.push(`Date : ${dateStr}`);

  if (args.patientContext && hasContext(args.patientContext)) {
    if (args.patientContext.initials) {
      lines.push(`Patient : ${args.patientContext.initials}`);
    }
    if (args.patientContext.location) {
      lines.push(`Localisation : ${args.patientContext.location}`);
    }
    if (args.patientContext.chronicity) {
      lines.push(
        `Chronicité : ${chronicityLabels[args.patientContext.chronicity]}`,
      );
    }
  }

  for (const l of formatSessionInputsText(args.sessionInputs)) {
    lines.push(l);
  }

  lines.push("");
  lines.push("Réponses :");

  for (const e of args.recap) {
    if (e.kind === "modulation") {
      lines.push(`• ${e.label} — c'est mieux ? ${e.answer}`);
      if (e.bullets && e.bullets.length) {
        for (const b of e.bullets) {
          lines.push(`    – ${b}`);
        }
      }
    } else if (e.kind === "eva") {
      lines.push(`• ${e.label} : ${e.answer}`);
    } else {
      lines.push(`• ${e.label} : ${e.answer}`);
    }
  }

  lines.push("");
  lines.push(`Conclusion : ${args.recommendationTitle}`);
  lines.push(args.recommendationMessage);

  for (const l of formatBehaviorText(args.recommendationBehavior)) {
    lines.push(l);
  }

  if (args.recommendationPatientScript) {
    lines.push("");
    lines.push("À dire au patient :");
    lines.push(`« ${args.recommendationPatientScript} »`);
  }

  lines.push("");
  lines.push("— Loading by Castel Physio");
  return lines.join("\n");
}

export type ShareResult = "shared" | "copied" | "unsupported" | "error";

export async function shareOrCopy(text: string, title: string): Promise<ShareResult> {
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share({ title, text });
      return "shared";
    } catch (e) {
      if ((e as DOMException)?.name === "AbortError") return "shared";
    }
  }
  return copyToClipboard(text);
}

export async function copyToClipboard(text: string): Promise<ShareResult> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return "copied";
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return "copied";
  } catch {
    return "error";
  }
}
