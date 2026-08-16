# Activar P0 en producción

> Medición de ingresos: cada cobro Premium (MXN o sats) queda en `purchases` y sale en `/api/admin/revenue`.
> Sonda 16 ago 2026, 01:49 UTC. Complementa [`roadmap-agentico-ingresos.md`](./roadmap-agentico-ingresos.md).
> PR [#1](https://github.com/Edgadafi/Calculadora-de-Retiro-Bitcoin-Fedi/pull/1) merged (`416d388`).

## Qué hay en vivo hoy

| Pieza | Host | Estado |
|-------|------|--------|
| Front + APIs de pago | `https://www.retirobtc.mx` | Prod `416d388`. `p0-status` → **503**: faltan `INTERNAL_API_SECRET` y `MERCADOPAGO_WEBHOOK_SECRET`. Token MP OK. Webhook sin firma → 503. |
| Agentes | `https://retirobtc-agents.vercel.app` | Production `416d388` (01:48 UTC). `POST /api/purchases` → **401 Unauthorized**. Chat/leads OK. Falta secreto interno + tabla `purchases`. |
| `agents.retirobtc.mx` | — | **Sin DNS.** No usarlo. |

Este agente **no puede** escribir variables en Vercel ni ejecutar SQL en Supabase: el MCP de Vercel no está autenticado y no hay `SUPABASE_SERVICE_ROLE_KEY` en el entorno. Los clics de abajo son tuyos.

## 1. Deploy de `retirobtc-agents` desde `main` — hecho

`POST https://retirobtc-agents.vercel.app/api/purchases` responde **401**. GitHub: environment `Production – retirobtc-agents` en `416d388`.

<details>
<summary>Cómo se llegó (por si hay que repetirlo)</summary>

El catálogo ya desplegó `main`. `retirobtc-agents` es **otro** proyecto y **no está enganchado a Git**: la lista de Deployments son `vercel deploy` de **julio** (`CnV42okuf`, etc.). **No les des Redeploy**: volverías a subir el código viejo, sin `/api/purchases`.

1. En `retirobtc-agents` → **Settings → Git** (o pestaña **Connect**) → conecta `Edgadafi/Calculadora-de-Retiro-Bitcoin-Fedi`
2. **Root Directory no está en Git ni en Deployments.** Ve a **Settings → General** (o **Build and Deployment**) → sección **Root Directory** → Edit → escribe `agents` → Save. Framework: Next.js.
3. Production Branch = `main`
4. **Después** de guardar Root Directory: Deployments → **Create Deployment** → `main` → Production. Si ya se disparó un deploy del repo entero, cancélalo: habría intentado buildar el catálogo, no `agents/`.
5. El Preview `e56260c` (rama de docs) falló en 2 s: el comentario de Vercel en GitHub traía `"rootDirectory":null`, o sea buildó la raíz del repo como Next.js y no encontró `app/`. Production de julio **no** se tocó. No le des Redeploy a esa fila roja.
6. Comprueba Root Directory otra vez (debe leer `agents`, no vacío ni `/agents`) y despliega **`main`**, no la rama `cursor/p0-post-merge-sonda-63ab`.
7. Previews Ready (`0104d91`, `251d1d1`) con `rootDirectory: agents`. Sonda 01:45 UTC: `retirobtc-agents.vercel.app/api/purchases` **sigue 404** (`x-vercel-cache: HIT`, `last-modified: 14 ago`). GitHub no tiene environment Production de agentes hoy: el Promote no cambió el alias. Create Deployment → branch **`main`** → marcar Production.
8. Comprueba: `POST https://retirobtc-agents.vercel.app/api/purchases` debe devolver **401**, no 404

Opcional: en Ignored Build Step → “Only build if there are changes in a folder” → `agents`, para no rebuildar Rito cuando solo cambia el front.
</details>

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
