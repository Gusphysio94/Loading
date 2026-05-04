import type { RecapEntry, Tree } from "../types/tree";
import type { PatientContext } from "../types/patient";
import { chronicityLabels, hasContext } from "../types/patient";

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

export function formatRecapAsText(args: {
  tree: Tree;
  recap: RecapEntry[];
  recommendationTitle: string;
  recommendationMessage: string;
  patientContext?: PatientContext | null;
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
