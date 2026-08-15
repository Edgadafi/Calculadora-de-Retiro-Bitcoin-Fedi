# Arquitectura — Ecosistema de Agentes IA retirobtc.mx

> Vertical 1 implementada. Verticales 2 (Growth) y 3 (Back-Office) planificadas para fases posteriores.
> Orden de construcción priorizado por impacto en ingresos: [`roadmap-agentico-ingresos.md`](./roadmap-agentico-ingresos.md).

## Organigrama

### Vertical 1 — Front-Office (MVP ✅)

| Agente | Implementación |
|--------|----------------|
| **Rito** | Chat streaming Gemini Flash + RAG pgvector. Widget en landing, calc, brújula. |
| **Captura leads** | `POST /api/leads` desde formulario guía `/brujula`. Resend + token guía PDF. |
| **Investigador jurídico** | Cron diario DOF RSS → `legal_alerts` → revisión humana → ingest KB. |

### Vertical 1.5 — Pendiente

- Agente Generador de Contenido (TikTok/X/SEO) alimentado por alertas aprobadas.
- Fase **P1** del [roadmap de ingresos](./roadmap-agentico-ingresos.md#6-p1--generador-de-contenido-vertical-15): publica vía Buffer, con revisión humana previa.

### Vertical 2 — Pendiente

- Prospección/calificación de leads (scoring brújula + calc) → fase **P2** del [roadmap](./roadmap-agentico-ingresos.md#7-p2--prospección-y-calificación-vertical-2a).
- Ventas e-commerce (requiere tienda cold wallets) → fase **P3** del [roadmap](./roadmap-agentico-ingresos.md#8-p3--tienda-y-agente-de-ventas-vertical-2b).

### Vertical 3 — Pendiente

- Contabilidad multi-moneda (MXN + sats)
- Facturación CFDI
- Ambas en fase **P4** del [roadmap](./roadmap-agentico-ingresos.md#9-p4--contabilidad-y-facturación-vertical-3): dependen de que P0 registre transacciones.

### Prerrequisito transversal — Medición de ingresos (P0 ✅)

Los pagos Premium ya se persisten en la tabla `purchases`, con atribución por UTM y vínculo opcional al lead que originó la compra. Sin esto, el scoring de Vertical 2 no tendría conversiones reales contra las que validarse y el agente contable de Vertical 3 no tendría fuente de datos.

| Pieza | Rol |
|-------|-----|
| [`api/mp-webhook.js`](../api/mp-webhook.js) | Reconsulta el pago por id con nuestro access token y registra la compra |
| [`api/verify-mp-payment.js`](../api/verify-mp-payment.js) | Registro redundante en el retorno del checkout |
| [`api/check-payment.js`](../api/check-payment.js) | Registra el cobro Lightning con plan e importe que reporta LNbits |
| [`agents/app/api/purchases/route.ts`](../agents/app/api/purchases/route.ts) | Ingesta interna con secreto compartido y upsert idempotente |
| [`agents/app/api/admin/revenue/route.ts`](../agents/app/api/admin/revenue/route.ts) | MRR, ingreso por canal, conversión lead a Premium |

Decisión de arquitectura: la llave de servicio de Supabase vive **sólo** en el proyecto `agents/`. El proyecto raíz reenvía el hecho ya confirmado contra el proveedor mediante `INTERNAL_API_SECRET`, en lugar de tener acceso directo a la base.

Detalle de la fase en [P0 del roadmap](./roadmap-agentico-ingresos.md#5-p0--medición-de-ingresos-y-atribución).

## Diagrama de flujo (MVP)

```mermaid
flowchart TB
  User[Usuario retirobtc.mx]
  Brujula[brujula.html formulario guía]
  Widget[Rito widget]
  LeadsAPI["/api/leads"]
  ChatAPI["/api/chat"]
  Supabase[(Supabase)]
  Resend[Resend email]
  Cron[Cron DOF]
  Admin["/admin/alerts"]
  RAG[RAG pgvector]

  User --> Brujula
  User --> Widget
  Brujula --> LeadsAPI
  Widget --> ChatAPI
  LeadsAPI --> Supabase
  LeadsAPI --> Resend
  ChatAPI --> RAG
  ChatAPI --> Supabase
  Cron --> Admin
  Admin --> RAG
```

## Stack

| Capa | Tecnología |
|------|------------|
| Front | HTML/JS estático (repo raíz) — **sin migrar a Next.js** |
| Agentes | Next.js 16 App Router, TypeScript, Vercel AI SDK |
| LLM | Gemini 2.0 Flash (chat), OpenAI text-embedding-3-small (RAG) |
| DB | Supabase Postgres + pgvector |
| Email | Resend |
| Deploy | Dos proyectos Vercel: raíz + `agents/` |

## Archivos clave

| Ruta | Rol |
|------|-----|
| [`agents/app/api/chat/route.ts`](../agents/app/api/chat/route.ts) | Rito streaming |
| [`agents/app/api/leads/route.ts`](../agents/app/api/leads/route.ts) | Captura leads |
| [`agents/app/api/purchases/route.ts`](../agents/app/api/purchases/route.ts) | Ingesta de compras (P0) |
| [`agents/app/api/admin/revenue/route.ts`](../agents/app/api/admin/revenue/route.ts) | Reporte de ingresos (P0) |
| [`api/_lib/purchases.js`](../api/_lib/purchases.js) | Reenvío raíz → agentes |
| [`agents/lib/agents/rito.ts`](../agents/lib/agents/rito.ts) | System prompt |
| [`agents/lib/rag/`](../agents/lib/rag/) | Chunking, embeddings, búsqueda |
| [`agents/public/widget/rito.js`](../agents/public/widget/rito.js) | Widget embed |
| [`agents-config.js`](../agents-config.js) | URL del servicio (prod vs local) |
| [`rito-loader.js`](../rito-loader.js) | Carga dinámica del widget |
| [`brujula-quiz.js`](../brujula-quiz.js) | Integración leads API |

## Política Rito

- Tono empático, institucional, pedagógico.
- **No** asesoría fiscal/legal vinculante — disclaimer en cada sesión.
- **No** procesar PII financiera ni datos de pago.
- RAG obligatorio para temas legales; alertas DOF solo tras aprobación humana.
- Escalamiento: `calculadora.retirobtc@gmail.com`.

## Privacidad (INAI)

- Consentimiento registrado en `consent_records` con versión de aviso (`2026-05`).
- IP almacenada como hash SHA-256.
- Mensajes de chat redactados (emails/números).
- Retención chat: 90 días (configurable en Supabase policies).

## Variables de entorno

Ver [`agents/.env.example`](../agents/.env.example).

## KPIs Vertical 1

1. Conversión brújula → lead válido
2. P95 primera respuesta Rito &lt; 3 s
3. % conversaciones sin escalamiento humano
4. Tiempo alerta legal → KB indexada

## Próximos pasos operativos

1. Crear proyecto Supabase y ejecutar `schema.sql`
2. Desplegar `agents/` en Vercel con subdominio `agents.retirobtc.mx`
3. Configurar Resend con dominio verificado
4. Seed KB desde admin
5. Reemplazar placeholder PDF en `agents/public/guia-retiro-mexico.pdf`

Una vez operativa Vertical 1, el siguiente paso es la fase P0 (medición de ingresos) del [roadmap de ingresos](./roadmap-agentico-ingresos.md#10-recomendación-de-arranque), no un agente nuevo.
