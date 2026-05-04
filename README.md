# Loading

App d'aide à la décision clinique pour kinésithérapeutes : gérer la charge des patients en quelques clics, en fonction de la douleur rapportée.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion (transitions)
- vite-plugin-pwa (installable hors-ligne)

## Lancer en local

```bash
npm install
npm run dev
```

Ouvre `http://localhost:5173`.

## Build production

```bash
npm run build
npm run preview
```

## Déploiement Vercel

1. Pousse le projet sur GitHub.
2. Sur [vercel.com](https://vercel.com) → "New Project" → importer le repo.
3. Vercel détecte automatiquement Vite (`vercel.json` est déjà configuré).
4. L'app est en ligne sur `loading-<hash>.vercel.app` en ~30 s.

Alternative CLI :

```bash
npm i -g vercel
vercel
```

## Structure

```
src/
  components/         écrans (Home, Question, Modulation, Recommandation, Header, Breadcrumb)
  data/trees.ts       les 3 arbres décisionnels (exercice, course, sport)
  types/tree.ts       types Question/Modulation/Recommendation
  lib/cn.ts           helper className
  index.css           tokens Tailwind v4 + utilitaires (gradient-text, stars-bg…)
  main.tsx
  App.tsx             machine d'état (history-based navigation)
```

## Ajouter ou modifier un arbre

Tout est centralisé dans [`src/data/trees.ts`](src/data/trees.ts). Chaque arbre est un graphe de nœuds typés (`question` / `modulation` / `recommendation`). Pour ajouter une situation, dupliquer un arbre existant et l'ajouter au tableau `trees` exporté.
