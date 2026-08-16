# Activar P0 en producción

> Medición de ingresos: cada cobro Premium (MXN o sats) queda en `purchases` y sale en `/api/admin/revenue`.
> Sonda post-merge 16 ago 2026, 01:26 UTC. Complementa [`roadmap-agentico-ingresos.md`](./roadmap-agentico-ingresos.md).
> PR [#1](https://github.com/Edgadafi/Calculadora-de-Retiro-Bitcoin-Fedi/pull/1) merged (`416d388`).

## Qué hay en vivo hoy (después del merge)

| Pieza | Host | Estado |
|-------|------|--------|
| Front + APIs de pago | `https://www.retirobtc.mx` | Prod en `416d388`. `GET /api/p0-status` → **503** `{ agentsUrl: true, mpToken: true, internalSecret: false, webhookSecret: false }`. Webhook sin firma → **503** (fail-closed; ya no 200). |
| Agentes (Rito, leads, alertas) | `https://retirobtc-agents.vercel.app` | Chat/leads vivos. **`/api/purchases` y `/api/admin/p0-status` siguen en 404** — este proyecto no se redesplegó con el merge del catálogo. |
| `agents.retirobtc.mx` | — | **Sin DNS.** No usarlo. |

Este agente **no puede** escribir variables en Vercel ni ejecutar SQL en Supabase: el MCP de Vercel no está autenticado y no hay `SUPABASE_SERVICE_ROLE_KEY` en el entorno. Los clics de abajo son tuyos.

## 1. Deploy de `retirobtc-agents` desde `main` (no Redeploy)

El catálogo ya desplegó `main`. `retirobtc-agents` es **otro** proyecto y **no está enganchado a Git**: la lista de Deployments son `vercel deploy` de **julio** (`CnV42okuf`, etc.). **No les des Redeploy**: volverías a subir el código viejo, sin `/api/purchases`.

1. En `retirobtc-agents` → **Settings → Git** (o pestaña **Connect**) → conecta `Edgadafi/Calculadora-de-Retiro-Bitcoin-Fedi`
2. **Root Directory** = `agents`
3. Production Branch = `main`
4. Deployments → **Create Deployment** → branch `main` → Production  
   (si Git no se puede conectar: en tu máquina `git checkout main && cd agents && npx vercel --prod`)
5. Comprueba: `POST https://retirobtc-agents.vercel.app/api/purchases` debe devolver **401**, no 404

## 2. Tabla `purchases` en Supabase

Si Vertical 1 ya corre (leads, chat, alertas), no relances el schema completo. En SQL Editor pega [`../agents/supabase/migrations/20260816_purchases.sql`](../agents/supabase/migrations/20260816_purchases.sql) y Run.

Si el proyecto está vacío, usa [`../agents/supabase/schema.sql`](../agents/supabase/schema.sql).

Dos cupos free ocupados: esquema propio + `SUPABASE_DB_SCHEMA` (encabezado del schema).

## 3. Variables en Vercel (los dos proyectos)

Genera un secreto de 24+ caracteres, una sola vez:

```bash
openssl rand -base64 32
```

| Variable | Proyecto raíz (`calculadora-de-retiro-bitcoin-fedi-catalogo`) | Proyecto `retirobtc-agents` | Entornos |
|----------|---------------------------------------------------------------|-----------------------------|----------|
| `INTERNAL_API_SECRET` | el mismo valor | el mismo valor | Production **y** Preview |
| `MERCADOPAGO_WEBHOOK_SECRET` | clave de MP → Webhooks | no | Production **y** Preview |
| `AGENTS_BASE_URL` | opcional; default `https://retirobtc-agents.vercel.app` | no | — |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | no (la llave no va en el root) | ya deberían existir | Production |
| `ADMIN_SECRET` | no | ya debería existir (panel alertas) | Production |

Después de guardar variables, **Redeploy** los dos proyectos. Vercel no inyecta env nuevas en el deployment ya servido.

## 4. Webhook de Mercado Pago

Dashboard MP → Webhooks:

1. URL: `https://www.retirobtc.mx/api/mp-webhook`
2. Evento: `payment`
3. Copia la clave secreta a `MERCADOPAGO_WEBHOOK_SECRET`

Sin este secreto, el webhook nuevo responde **503** y MP reintenta. El cobro y el acceso Premium no se bloquean; sólo se retrasa el registro.

## 5. Verificar

```bash
# Root: 200 si las cuatro banderas están en true
curl -sS https://www.retirobtc.mx/api/p0-status

# Agentes: 200 si Supabase + secreto interno + tabla purchases
curl -sS https://retirobtc-agents.vercel.app/api/admin/p0-status \
  -H "X-Admin-Secret: $ADMIN_SECRET"

# Ingresos (vacío es correcto hasta el primer cobro)
curl -sS "https://retirobtc-agents.vercel.app/api/admin/revenue?days=30" \
  -H "X-Admin-Secret: $ADMIN_SECRET"
```

Cierre: un pago de prueba en cada rail (MP y Lightning) aparece **una sola vez** en `purchases`.

## Qué no hacer

- No recargar Account Funds de Namecheap ni reactivar RelateSocial
- No poner `SUPABASE_SERVICE_ROLE_KEY` en el proyecto raíz
- No apuntar `AGENTS_BASE_URL` a `https://agents.retirobtc.mx`
