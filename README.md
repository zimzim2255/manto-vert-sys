# Manto Vert Sys

Vite + React (TypeScript) app for generating documents (Devis / Facture / Bon de Commande / Bon de Livraison).

## Requirements
- Node.js >= 18

## Local development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy to Vercel
1. Push this repository to GitHub.
2. In Vercel: **New Project** → import the GitHub repo.
3. Vercel settings:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `build`

`vercel.json` is included to ensure SPA routing works (refresh on routes).
