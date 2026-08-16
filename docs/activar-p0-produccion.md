# Activar P0 en producción

> Medición de ingresos: cada cobro Premium (MXN o sats) queda en `purchases` y sale en `/api/admin/revenue`.
> Sonda 16 ago 2026, 01:49 UTC. Complementa [`roadmap-agentico-ingresos.md`](./roadmap-agentico-ingresos.md).
> PR [#1](https://github.com/Edgadafi/Calculadora-de-Retiro-Bitcoin-Fedi/pull/1) merged (`416d388`).

## Qué hay en vivo hoy

| Pieza | Host | Estado |
|-------|------|--------|
| Front + APIs de pago | `https://www.retirobtc.mx` | **P0 root ready.** `GET /api/p0-status` → 200, las cuatro banderas `true`. Webhook sin firma → **401 Invalid signature** (secreto vivo). |
| Agentes | `https://retirobtc-agents.vercel.app` | Rutas P0 existen. `POST /api/purchases` con el secreto del catálogo → **401**: `INTERNAL_API_SECRET` no está vivo en agentes (falta variable o Redeploy). Tabla `purchases` pendiente. |
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

## 2. Tabla `purchases` en Supabase (sin Pro)

Org **Shill Sarkeys**, plan Free: 2 activos (`elcanario.com.mx`, `remesa-blink`). **Retiro iLATAM** pausado no cuenta; reactivarlo pide Pro. No lo actives. No pagues.

P0 usa el proyecto **donde ya corre Rito** (el de `SUPABASE_URL` en `retirobtc-agents`). En SQL Editor de cada activo:

```sql
select table_schema, table_name
from information_schema.tables
where table_name in ('leads', 'purchases')
order by 1, 2;
```

Sonda 16 ago: **ninguno** de los dos activos tiene `leads`/`purchases`. Rito apunta al iLATAM pausado. No lo despiertes.

Camino Free: en **un** activo (recomendado: `elcanario.com.mx`) corre [`../agents/supabase/schema-shared-retirobtc.sql`](../agents/supabase/schema-shared-retirobtc.sql). Crea el esquema `retirobtc` y no toca `public` de esa app. Luego Exposed schemas + env (abajo).

## 3. Variables en Vercel (los dos proyectos)

En Settings → Environment Variables **no hay pestaña Production/Preview**. El entorno se lee **bajo el nombre** de cada fila (`Production and Preview`, o dos filas). Al crear una:

1. **Add Environment Variable**
2. Key / Value. Sensitive ON está bien
3. Dropdown **Environments**: debe incluir **Production** y **Preview**. Si solo dice Preview, ábrelo y marca Production
4. **Branch**: no toques “Select a Custom Preview Branch”. Vacío = todas las preview. Si eliges una rama, el secreto no llega a Production
5. Save

Una sola fila con “Production and Preview” (como `GOOGLE_GENERATIVE_AI_API_KEY`) es lo correcto. No dupliques como `OPENAI_API_KEY`.

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
