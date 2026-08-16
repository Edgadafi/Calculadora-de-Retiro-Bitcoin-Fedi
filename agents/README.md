# Agentes IA — retirobtc.mx

Servicio **Next.js 15 + TypeScript** desplegado en `https://retirobtc-agents.vercel.app` (proyecto Vercel separado del front estático). `agents.retirobtc.mx` no tiene DNS.

## Vertical 1 (MVP)

| Agente | Endpoint / UI |
|--------|----------------|
| **Rito** | `POST /api/chat` + [`public/widget/rito.js`](public/widget/rito.js) |
| **Captura leads** | `POST /api/leads` |
| **Investigador legal** | Cron `GET /api/cron/legal-monitor` |
| **Admin alertas** | [`/admin/alerts`](app/admin/alerts/page.tsx) |

## Medición de ingresos (fase P0)

| Endpoint | Rol |
|----------|-----|
| `POST /api/purchases` | Ingesta interna de compras. Lo llama sólo el proyecto raíz con `X-Internal-Secret`; upsert idempotente por `(provider, external_id)`. |
| `GET /api/admin/revenue?days=30` | Reporte con `X-Admin-Secret`: MRR, ingreso por canal, conversión lead a Premium y campañas. |

MXN y sats se reportan por separado: no guardamos el tipo de cambio del momento del cobro, así que sumarlos daría un total falso.

```bash
curl -s "https://retirobtc-agents.vercel.app/api/admin/p0-status" \
  -H "X-Admin-Secret: $ADMIN_SECRET"

curl -s "https://retirobtc-agents.vercel.app/api/admin/revenue?days=30" \
  -H "X-Admin-Secret: $ADMIN_SECRET"
```

Activación en producción: [`../docs/activar-p0-produccion.md`](../docs/activar-p0-produccion.md).

## Setup local

```bash
cd agents
cp .env.example .env.local
# Rellenar GOOGLE_GENERATIVE_AI_API_KEY (Rito), OPENAI_API_KEY (embeddings RAG), SUPABASE_*, RESEND_*, ADMIN_SECRET, CRON_SECRET, INTERNAL_API_SECRET
npm install
npm run dev
```

Front estático: `agents-config.js` apunta a `http://localhost:3000` en local.

## Supabase

Ejecutar [`supabase/schema.sql`](supabase/schema.sql) en el SQL Editor (habilitar extensión `vector`).

### Compartir un proyecto en el plan gratuito

El plan gratuito da **2 proyectos activos por cuenta**, no por organización: el límite se cuenta sobre todas las organizaciones donde seas Owner o Admin, así que crear organizaciones nuevas no lo evita. Los proyectos **pausados no cuentan**.

Si ya tienes los 2 cupos ocupados, no hace falta pagar un tercero: este servicio puede vivir en un **esquema propio** dentro de un proyecto existente.

1. En `supabase/schema.sql`, sustituir las dos líneas marcadas con «ESQUEMA DESTINO» según indica el encabezado del archivo (por ejemplo `retirobtc`)
2. Ejecutar el script
3. Settings → API → **Exposed schemas**: añadir el esquema
4. Variables de entorno del servicio: `SUPABASE_DB_SCHEMA=retirobtc`

El cliente fija el esquema una sola vez en [`lib/db/supabase.ts`](lib/db/supabase.ts), así que todos los `.from()` y el `.rpc()` de RAG lo heredan sin tocar el resto del código.

Ventaja adicional: el script otorga privilegios **sólo a `service_role`**, nunca a `anon`. En el esquema `public` de Supabase el rol anónimo tiene privilegios por defecto, de modo que sin RLS cualquiera con la llave anónima podría leer leads, chats y compras. El script activa RLS sobre las nueve tablas por si las dejas en `public`; la llave de servicio omite RLS por diseño, así que el servicio sigue funcionando igual.

Indexar KB inicial: panel admin → «Re-indexar KB» o:

```bash
curl -X POST https://retirobtc-agents.vercel.app/api/knowledge/ingest \
  -H "Content-Type: application/json" \
  -H "X-Admin-Secret: $ADMIN_SECRET" \
  -d '{"action":"seed"}'
```

## Deploy Vercel

1. Nuevo proyecto Vercel con **Root Directory** = `agents`
2. Variables de entorno desde `.env.example`
3. Cron configurado en [`vercel.json`](vercel.json) (14:00 UTC ≈ 08:00 CDMX)
4. Host actual: `retirobtc-agents.vercel.app`. DNS `agents.retirobtc.mx` es opcional.

## Seguridad

- CORS: solo `retirobtc.mx` y `*.fedi.xyz`
- Rate limit: 20 msg/h chat, 3 leads/día/email
- Alertas legales: revisión humana antes de RAG
- PII redactada en logs de chat
- Secretos (`ADMIN_SECRET`, `INTERNAL_API_SECRET`) comparados en tiempo constante
- `purchases` no guarda correo ni dato de tarjeta: la atribución se resuelve vía `lead_id`

Documentación completa: [`../docs/agentes-ia-arquitectura.md`](../docs/agentes-ia-arquitectura.md)
