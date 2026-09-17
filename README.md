# Lattice Admin

SaaS owner dashboard for Lattice. Separate from the construction app repo.

## Run

```bash
npm install
npm run dev
```

http://localhost:5180/ · demo: `sazzad@lattice.build` / `lattice`

## Vercel

- Build: `npm run build`
- Output: `dist`
- SPA: `vercel.json`
- Env: `.env.example` (`VITE_API_BASE`, `VITE_USE_MOCK_API`)

## Structure

```
src/
  main.tsx / App.tsx
  router/
  pages/           # route screens only
  components/
    ui/ layout/ shared/ dashboard/
  store/
  services/        # api + endpoints (backend-ready)
  hooks/
  lib/             # utils, seed, factories, status
  types/ config/ constants/
  styles/ assets/
```
