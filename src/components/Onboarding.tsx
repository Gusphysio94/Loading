import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/cn";

type OnboardingProps = {
  onClose: () => void;
};

type Slide = {
  eyebrow: string;
  title: string;
  description: string;
  bullets?: string[];
  Visual: React.ComponentType;
};

const slides: Slide[] = [
  {
    eyebrow: "Bienvenue",
    title: "Loading — gestion de charge guidée",
    description:
      "Un cadre décisionnel inspiré des principes EBP de gestion de charge basée sur la douleur. Quelques clics pour passer du symptôme rapporté à une recommandation actionnable.",
    Visual: WelcomeVisual,
  },
  {
    eyebrow: "Comment ça marche",
    title: "3 situations, 1 logique commune",
    description:
      "Tu choisis la situation clinique (exercice, course à pied, sport), l'app guide ton patient question par question, et restitue une conduite à tenir.",
    bullets: [
      "Pendant la séance · seuil EVA 4/10",
      "Modulations à tester immédiatement",
      "Re-évaluation post-séance + à 24 h",
    ],
    Visual: FlowVisual,
  },
  {
    eyebrow: "Local & privé",
    title: "Tout reste sur ton appareil",
    description:
      "Aucune donnée patient n'est envoyée. Tu peux exporter le résumé d'une éval (copier · partager · imprimer en PDF) pour le coller dans le dossier ou le donner au patient.",
    bullets: [
      "Récap des réponses copiable",
      "Contexte patient optionnel (initiales / chronicité)",
      "Historique anonyme des 50 dernières évals",
    ],
    Visual: PrivacyVisual,
  },
];

export function Onboarding({ onClose }: OnboardingProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const slide = slides[index];
  const isLast = index === slides.length - 1;

  function next() {
    if (isLast) {
      onClose();
      return;
    }
    setDirection(1);
    setIndex((i) => i + 1);
  }

  function prev() {
    if (index === 0) return;
    setDirection(-1);
    setIndex((i) => i - 1);
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-night-500/95 backdrop-blur-xl">
      <div className="absolute inset-0 stars-bg pointer-events-none opacity-60" />

      <div className="relative flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2">
          <div className="gradient-bg h-2 w-2 rounded-full" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
            Premier lancement
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-white/55 transition hover:bg-white/[0.06] hover:text-white"
        >
          Passer
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-5">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 24 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: -d * 24 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="mx-auto mb-8 flex h-44 w-full items-center justify-center sm:h-52">
                <slide.Visual />
              </div>

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-pink">
                {slide.eyebrow}
              </span>
              <h2 className="mt-2 text-3xl font-black leading-[1.05] tracking-tight text-white sm:text-4xl">
                {slide.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/70">
                {slide.description}
              </p>

              {slide.bullets && (
                <ul className="mt-5 space-y-2">
                  {slide.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-white/75"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative flex items-center justify-between gap-4 px-5 pb-7 pt-4">
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 rounded-full transition-all",
                i === index
                  ? "w-6 bg-gradient-to-r from-brand-coral via-brand-pink to-brand-violet"
                  : "w-1.5 bg-white/20",
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {index > 0 && (
            <button
              type="button"
              onClick={prev}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/75 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
            >
              Retour
            </button>
          )}
          <motion.button
            type="button"
            onClick={next}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="gradient-bg rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/20 transition hover:shadow-xl hover:shadow-brand-violet/30"
          >
            {isLast ? "C'est parti" : "Suivant"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function WelcomeVisual() {
  return (
    <svg viewBox="0 0 240 200" className="h-full w-auto" aria-hidden>
      <defs>
        <linearGradient id="ob-g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF5470" />
          <stop offset="50%" stopColor="#F04EA0" />
          <stop offset="100%" stopColor="#A64BFF" />
        </linearGradient>
      </defs>
      <circle
        cx="120"
        cy="100"
        r="68"
        fill="none"
        stroke="url(#ob-g1)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray="260 400"
        transform="rotate(-90 120 100)"
      />
      <circle cx="120" cy="100" r="14" fill="url(#ob-g1)" />
      <circle cx="68" cy="40" r="3" fill="white" opacity="0.6" />
      <circle cx="180" cy="60" r="2" fill="white" opacity="0.4" />
      <circle cx="200" cy="160" r="2.5" fill="white" opacity="0.5" />
      <circle cx="40" cy="150" r="2" fill="white" opacity="0.45" />
    </svg>
  );
}

function FlowVisual() {
  return (
    <svg viewBox="0 0 240 200" className="h-full w-auto" aria-hidden>
      <defs>
        <linearGradient id="ob-g2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF5470" />
          <stop offset="100%" stopColor="#A64BFF" />
        </linearGradient>
      </defs>
      <path
        d="M 30 100 Q 80 100 80 60 Q 80 40 120 40"
        fill="none"
        stroke="url(#ob-g2)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M 30 100 L 120 100"
        fill="none"
        stroke="url(#ob-g2)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 30 100 Q 80 100 80 140 Q 80 160 120 160"
        fill="none"
        stroke="url(#ob-g2)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M 120 40 L 210 40"
        fill="none"
        stroke="#34d399"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M 120 100 L 210 100"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M 120 160 L 210 160"
        fill="none"
        stroke="#f87171"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="30" cy="100" r="9" fill="url(#ob-g2)" />
      <circle cx="120" cy="40" r="6" fill="rgba(255,255,255,0.7)" />
      <circle cx="120" cy="100" r="6" fill="rgba(255,255,255,0.7)" />
      <circle cx="120" cy="160" r="6" fill="rgba(255,255,255,0.7)" />
      <circle cx="210" cy="40" r="9" fill="#34d399" />
      <circle cx="210" cy="100" r="9" fill="#fbbf24" />
      <circle cx="210" cy="160" r="9" fill="#f87171" />
    </svg>
  );
}

function PrivacyVisual() {
  return (
    <svg viewBox="0 0 240 200" className="h-full w-auto" aria-hidden>
      <defs>
        <linearGradient id="ob-g3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF5470" />
          <stop offset="100%" stopColor="#A64BFF" />
        </linearGradient>
      </defs>
      <rect
        x="80"
        y="50"
        width="80"
        height="100"
        rx="16"
        fill="none"
        stroke="url(#ob-g3)"
        strokeWidth="3"
      />
      <rect
        x="92"
        y="62"
        width="56"
        height="76"
        rx="6"
        fill="rgba(255,255,255,0.04)"
      />
      <line
        x1="100"
        y1="78"
        x2="140"
        y2="78"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="92"
        x2="132"
        y2="92"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="106"
        x2="138"
        y2="106"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="120"
        x2="124"
        y2="120"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="120" cy="34" r="14" fill="url(#ob-g3)" />
      <path
        d="M 113 34 L 118 39 L 127 30"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
