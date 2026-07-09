# Agentes IA — retirobtc.mx

Servicio **Next.js 15 + TypeScript** desplegado en `agents.retirobtc.mx` (proyecto Vercel separado del front estático).

## Vertical 1 (MVP)

| Agente | Endpoint / UI |
|--------|----------------|
| **Rito** | `POST /api/chat` + [`public/widget/rito.js`](public/widget/rito.js) |
| **Captura leads** | `POST /api/leads` |
| **Investigador legal** | Cron `GET /api/cron/legal-monitor` |
| **Admin alertas** | [`/admin/alerts`](app/admin/alerts/page.tsx) |

## Setup local

```bash
cd agents
cp .env.example .env.local
# Rellenar OPENAI_API_KEY, SUPABASE_*, RESEND_*, ADMIN_SECRET, CRON_SECRET
npm install
npm run dev
```

Front estático: `agents-config.js` apunta a `http://localhost:3000` en local.

## Supabase

Ejecutar [`supabase/schema.sql`](supabase/schema.sql) en el SQL Editor (habilitar extensión `vector`).

Indexar KB inicial: panel admin → «Re-indexar KB» o:

```bash
curl -X POST https://agents.retirobtc.mx/api/knowledge/ingest \
  -H "Content-Type: application/json" \
  -H "X-Admin-Secret: $ADMIN_SECRET" \
  -d '{"action":"seed"}'
```

## Deploy Vercel

1. Nuevo proyecto Vercel con **Root Directory** = `agents`
2. Variables de entorno desde `.env.example`
3. Cron configurado en [`vercel.json`](vercel.json) (14:00 UTC ≈ 08:00 CDMX)
4. DNS: `agents.retirobtc.mx` → proyecto Vercel

## Seguridad

- CORS: solo `retirobtc.mx` y `*.fedi.xyz`
- Rate limit: 20 msg/h chat, 3 leads/día/email
- Alertas legales: revisión humana antes de RAG
- PII redactada en logs de chat

Documentación completa: [`../docs/agentes-ia-arquitectura.md`](../docs/agentes-ia-arquitectura.md)
