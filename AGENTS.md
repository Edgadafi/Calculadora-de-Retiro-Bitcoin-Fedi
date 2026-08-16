# AGENTS.md

## Cursor Cloud specific instructions

This repository holds **two independent projects** that deploy as separate Vercel projects:

1. **Root static site** (repo root) — the core product: a vanilla HTML/CSS/JS Bitcoin retirement calculator ("Calculadora de Retiro Bitcoin", a Fedi Mini App). Plus serverless payment functions in `api/*` (Mercado Pago / Lightning).
2. **`agents/`** — a Next.js 16 + TypeScript service (Rito chatbot, lead capture, RAG, revenue tracking). See [`agents/README.md`](agents/README.md) and [`agents/AGENTS.md`](agents/AGENTS.md) (note: Next.js 16 has breaking changes vs. older versions).

Dependencies for both projects are installed by the startup update script (`npm install` at the root and in `agents/`), so you normally do not need to reinstall.

### Runtime / version notes
- `.nvmrc` pins Node 18, but the VM runs Node 22, which satisfies both the root (`engines.node >=18`) and Next.js 16 (needs Node >= 20). No version switching is required.
- Both projects use **npm** (each has its own `package-lock.json`). There is no root workspace linking them.

### Running the core product (calculator) — no secrets needed
The free calculator is fully client-side. Serve the repo root statically and open the file routes (production Vercel maps these to `/`, `/calc`, `/brujula`):
```bash
python3 -m http.server 8080
# http://127.0.0.1:8080/index.html  (landing)
# http://127.0.0.1:8080/calc/index.html  (calculator SPA — the actual Fedi Mini App)
# http://127.0.0.1:8080/brujula.html  (education funnel)
```
The `api/*` serverless payment endpoints (Mercado Pago Checkout Pro) are **not** exercised by a plain static server — they require `npx vercel dev` plus Mercado Pago credentials (see `.env.example`). They are optional and only needed to test the paid Premium flow.

### Running the agents service
Standard scripts (see `agents/package.json`): `npm run dev` (Next dev, defaults to port 3000), `npm run build`, `npm run lint`. Run these from `agents/`.
- `build` and `dev` start **without** any env vars, but runtime features (Rito chat, `/api/leads`, RAG, revenue) need secrets from `agents/.env.example`: `GOOGLE_GENERATIVE_AI_API_KEY`, `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `ADMIN_SECRET`, `CRON_SECRET`, `INTERNAL_API_SECRET`. Supabase also needs the schema applied (`agents/supabase/schema.sql`, requires the `vector` extension).
- `next dev` prints a benign "multiple lockfiles / inferred workspace root" warning because the root `package-lock.json` also exists; it is harmless.
- If you run the static site and the agents service at the same time, keep them on different ports (e.g. static on 8080, agents on 3000).

### Lint / test notes
- `agents` lint (`npm run lint`) currently reports **1 pre-existing error** (`react-hooks/set-state-in-effect` in `app/admin/alerts/page.tsx`) and 1 unused-var warning. These are existing code issues, not environment problems.
- Neither project defines a test suite; the root project has no npm scripts at all.
