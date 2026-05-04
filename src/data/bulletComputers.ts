import type { SessionInputs } from "../types/session";
import { formatPace, paceFromSlower } from "../types/session";

export type BulletComputer = (inputs: SessionInputs) => string[];

function fmtNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export const bulletComputers: Record<string, BulletComputer> = {
  // -----------------------------------------------------------------
  // EXERCISE TREE
  // -----------------------------------------------------------------
  exercise_mod1: (inputs) => {
    const e = inputs.exercise;
    const out: string[] = [];

    if (e?.load !== undefined) {
      const reduced = Math.max(1, Math.round(e.load * 0.7));
      out.push(`Charge : ${fmtNum(e.load)} kg → ${fmtNum(reduced)} kg (-30 %)`);
    } else {
      out.push("Moins lourd : -30 % de la charge");
    }

    if (e?.reps !== undefined) {
      const reduced = Math.max(1, Math.round(e.reps * 0.5));
      out.push(`Répétitions : ${e.reps} → ${reduced} par série (-50 %)`);
    } else {
      out.push("Moins de répétitions (-50 %)");
    }

    if (e?.amplitude === "full" || e?.amplitude === undefined) {
      out.push("Amplitude partielle (50-70 % du ROM)");
    } else {
      out.push("Maintenir l'amplitude partielle déjà en place");
    }

    out.push("Tempo lent : 3-0-2 (descente contrôlée 3 s)");

    return out;
  },

  exercise_mod2: (inputs) => {
    const e = inputs.exercise;
    const out: string[] = [];

    if (e?.load !== undefined) {
      const low = Math.round(e.load * 0.7);
      const high = Math.round(e.load * 0.8);
      out.push(`Charge : ${fmtNum(e.load)} kg → ${fmtNum(low)}-${fmtNum(high)} kg (-20-30 %)`);
    } else {
      out.push("Charge : -20 à -30 %");
    }

    out.push("Ajuster la technique d'exécution (qualité > quantité)");

    if (e?.sets !== undefined && e.sets > 1) {
      out.push(`Séries : ${e.sets} → ${e.sets - 1} (retirer une série)`);
    } else {
      out.push("Retirer une série");
    }

    out.push("Ralentir le mouvement (tempo 3-0-2 ou 4-0-2)");

    if (e?.reps !== undefined) {
      const reduced = Math.max(1, Math.round(e.reps * 0.7));
      out.push(`Répétitions : ${e.reps} → ${reduced} par série (-30 %)`);
    } else {
      out.push("Réduire le nombre de répétitions");
    }

    out.push("Ou refaire la même séance sans changer les modalités, pour observer");
    return out;
  },

  // -----------------------------------------------------------------
  // RUNNING TREE
  // -----------------------------------------------------------------
  running_mod1: (inputs) => {
    const r = inputs.running;
    const out: string[] = [];

    out.push("Marche 2 minutes (pause active)");

    if (r?.pace !== undefined) {
      const easyPace = paceFromSlower(r.pace, 60);
      out.push(
        `Reprise allure fondamentale : ~${easyPace} (+1 min/km vs ${formatPace(r.pace)})`,
      );
    } else {
      out.push("Reprise à allure fondamentale (zone 1-2, conversation possible)");
    }

    return out;
  },

  running_mod2: (inputs) => {
    const r = inputs.running;
    const out: string[] = [];

    if (r?.sessionType === "longue") {
      if (r.distance !== undefined) {
        const low = Math.round(r.distance * 0.7 * 10) / 10;
        const high = Math.round(r.distance * 0.8 * 10) / 10;
        out.push(
          `Sortie longue : ${fmtNum(r.distance)} km → ${fmtNum(low)}-${fmtNum(high)} km (-20-30 %)`,
        );
      } else {
        out.push("Sortie longue : -20 à -30 % du volume prévu");
      }
    } else if (r?.sessionType === "intervalle") {
      if (r.intervals !== undefined) {
        const reduced = Math.max(1, Math.floor(r.intervals / 2));
        out.push(`Intervalles : ${r.intervals} → ${reduced} (÷ 2)`);
      } else {
        out.push("Intervalles : diviser le nombre par 2");
      }
    } else if (r?.sessionType === "denivele") {
      if (r.elevation !== undefined) {
        const reduced = Math.round(r.elevation / 2);
        out.push(`D+ : ${r.elevation} m → ${reduced} m (÷ 2)`);
      }
      if (r.pace !== undefined) {
        const slower = paceFromSlower(r.pace, 60);
        out.push(
          `Allure en D+ : ${formatPace(r.pace)} → ${slower} (+1 min/km)`,
        );
      } else {
        out.push("Baisser l'allure en D+ de +1 min/km");
      }
    } else {
      // No specific session type — show all 3 generic recommendations
      out.push("Sortie longue : -20 à 30 % du volume prévu");
      out.push("Sortie intervalles : ÷ 2 le nombre de répétitions");
      out.push(
        "Sortie en dénivelé : ÷ 2 la distance de D+ et/ou +1 min/km en montée",
      );
    }

    return out;
  },

  // -----------------------------------------------------------------
  // SPORT TREE
  // -----------------------------------------------------------------
  sport_mod1: (inputs) => {
    const s = inputs.sport;
    const out: string[] = [];
    out.push("Éviter les phases d'intensité (sprints, contacts forts)");
    out.push("Focus sur les gestes techniques contrôlés");
    if (s?.sportType === "collectif") {
      out.push("Privilégier les exercices techniques en stations");
    }
    if (s?.sportType === "raquette") {
      out.push("Éviter les frappes max, rester sur drives contrôlés");
    }
    return out;
  },

  sport_mod2: (inputs) => {
    const s = inputs.sport;
    const out: string[] = [];

    out.push(
      "Arrêter l'entraînement et/ou faire de la mobilité douce jusqu'à la fin de la séance",
    );

    if (s?.duration !== undefined) {
      const low = Math.round(s.duration * 0.7);
      const high = Math.round(s.duration * 0.8);
      out.push(
        `Durée : ${s.duration} min → ${low}-${high} min sur les prochaines séances (-20-30 %)`,
      );
    } else {
      out.push("Réduire la durée des prochaines séances de -20-30 %");
    }

    out.push("Technique > intensité sur 2-3 séances");

    if (s?.hasMatchSoon) {
      out.push("⚠️ Reporter le prochain match (1-2 semaines)");
    } else {
      out.push("Éviter les matchs temporairement");
    }

    return out;
  },
};
