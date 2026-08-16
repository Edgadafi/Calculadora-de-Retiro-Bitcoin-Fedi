# Pitch ejecutivo — retirobtc.mx

> Uso: reunión con ángel o estratégico BTC-LATAM (15–20 min).  
> Fecha de tracción: **16 agosto 2026**.  
> Pegar a Google Slides / Gamma; paleta navy `#1E2B58`, naranja `#F07D38`, oro `#F7B500`.  
> Tono: poder adquisitivo y libertad, no hype. Default de producto: **15%** BTC, no 82% histórico.

**Una frase:** México no confía en el AFORE; millones ahorran fuera del IMSS. `retirobtc.mx` es la interfaz para proyectar retiro en Bitcoin (sats) con custodia comunitaria, ya en producción, **sin custodiar fondos**.

**Disclaimer:** la proyección a 12 meses es **ilustración bottom-up**. Hoy no hay cobros Premium reales en `purchases`. En sala se presenta el escenario **neutral como plan**, no el positivo como *guidance*.

---

## 0. Completar antes de imprimir (5 min)

Copia este bloque a la lámina 10. Sin monto e instrumento, no se imprime el ask.

```
ASK
Monto:           _______________ MXN / USD
Instrumento:     [ ] equity  [ ] SAFE  [ ] revenue share  [ ] alianza / distribución (0 cash)
Uso primario:    GTM 90 días (campaña + contenido + talleres), no rewrite de producto
Qué pedimos además del capital: intros Casa Satoshi / White Paper House / Fedi catalog
Qué ofrecemos:   _______________
```

---

## 1. One-pager

### Problema

El retiro formal en México no convence: rendimiento real AFORE ~**5.02%**, ahorro voluntario **< 2%** de activos, y la Ley de Infraestructura (abr. 2026) permite hasta **~30%** del portafolio en obra pública. ~**34%** de ocupados informales tienen AFORE inactiva. El trabajo del usuario no es “comprar BTC”; es **ver si le alcanza**.

### Mercado (6 líneas)

- **TAM:** ocupados que deberían ahorrar para retiro (AFORE + informal). Ancla: voluntario < 2%; reemplazo objetivo ~70% inalcanzable sin voluntario.
- **SAM:** (a) retail que ya hace DCA y no tiene herramienta en español vs AFORE real; (b) informal / gig sin IMSS regular. Prioridad de producto: estos dos.
- **SOM (12 meses):** visitas a `retirobtc.mx/calc` + mini-app Fedi en MX/LATAM-ES convertibles a Premium. No es AUM. No custodiamos sats.
- Timing 2026: desconfianza AFORE + Fedi/Guardianes + Lightning/Nostr.
- Competimos con opacidad del AFORE y con CEX, no con otro exchange.
- Fuente: estudio interno 24 may 2026. En sala: “según nuestro estudio”. El **5.02%** sí es el default del producto.

### Producto

Mini-app Fedi + sitio standalone. Landing `/`, calculadora `/calc`, embudo `/brujula`, agente **Rito** 24/7. Proyección DCA, escenarios, regla del 4%, comparador AFORE vs BTC (15% base). Premium: PDF, escenarios, plan cifrado. Cobro: **Mercado Pago (MXN)** y Lightning. No somos AFORE, ni exchange, ni asesores.

### Tracción (16 ago 2026) — honesta

| Hecho | Estado |
|-------|--------|
| Producto en producción | `https://www.retirobtc.mx` |
| Config de cobro (catálogo) | `GET /api/p0-status` → `ready: true` |
| Webhook MP | URL `https://www.retirobtc.mx/api/mp-webhook`; solo Pagos (legacy); sin firma → 401 |
| Medición P0 | `POST /api/purchases` autenticado → 200; schema `retirobtc.purchases` |
| Ingresos medidos | **Cero cobros Premium reales** (sonda de activación borrada) |
| MRR | **No se cita** |

Stack listo para atribuir el primer peso o sat. Infra no es el cuello de botella.

### Snapshot financiero 12 meses (ilustrativo)

Precios: **20 MXN** mensual / **200 MXN** lifetime. Fee MP 3.5%. Tools 3,000 MXN/mes. Sin renovaciones de mensual (sesgo conservador). Mix 100% Mercado Pago.

| Escenario | Visitas M1 | Conv. | Mix lifetime | Bruto 12m | Resultado op. 12m |
|-----------|------------|-------|--------------|-----------|-------------------|
| Negativo | 1,500 | 0.8% | 10% | ~7.3k MXN | **−29k MXN** |
| **Neutral (plan)** | 6,000 | 2.5% | 30% | **~322k MXN** | **~+179k MXN** |
| Positivo | 15,000 | 5% | 45% | ~3.4M MXN | ~+3.1M MXN |

El downside de caja es acotado (no hay nómina ni inventario). El upside no es subir precio: es conversión y mix lifetime.

### Ask y riesgos

Ask: ver bloque de la sección 0. Uso: distribución 90 días, no un rewrite.

Riesgos: volatilidad percibida (default 15% + proyección en MXN); adopción Fedi (el sitio funciona solo); regulación (no custodiamos); tráfico (P0 ya mide). No prometemos pensión ni rendimiento histórico extremo.

---

## 2. Guion de 10 láminas (~15 min)

### Lámina 1 — Apertura (30 s)

**Título:** retirobtc.mx  
**Decir:** Calculadora de retiro en Bitcoin para México. Mini-app en Fedi y también standalone. No custodiamos: iluminamos.  
**No decir:** que somos un AFORE Bitcoin, ni “number go up”.

### Lámina 2 — Problema (90 s)

- Rendimiento real AFORE ~5.02% (el número que usa el producto).
- Ahorro voluntario < 2% de activos.
- Ley de Infraestructura 2026: hasta ~30% en obra pública → desconfianza.
- ~34% informales con AFORE inactiva; gig economy sin IMSS regular.
- **JTBD:** *¿me alcanza?* no *¿en qué exchange compro?*

### Lámina 3 — Estudio de mercado (2 min)

Pirámide TAM → SAM → SOM (detalle en sección 3). Personas: primero retail + informal; privacy y sindicalizado en fase 2. Competencia: AFORE opaco / CEX con KYC / calculadoras crypto sin AFORE ni Fedi. Wedge: la calculadora, no un exchange. Alianzas: Casa Satoshi, White Paper House, Aureo / Bitcoin Latam Report, catálogo Fedi.

### Lámina 4 — Producto + demo (90 s)

Ver checklist de demo al final de esta sección. URLs: `/`, `/calc`, `/brujula`. Comparador AFORE vs BTC. Premium PDF. Rails MP + Lightning.

### Lámina 5 — Tracción honesta (60 s)

Producto vivo. Pagos y webhook configurados. Rito. P0 de medición **viva**. **Cero cobros reales en `purchases`.** No hay MRR que mostrar. El siguiente hito comercial es el primer cobro atribuido.

### Lámina 6 — Modelo y unit economics (60 s)

Freemium. 20 / 200 MXN. Fee ~3.5%. Margen de software alto. **No hay AUM ni take-rate de custodia.** Aureo es referral, no comisión modelada. Lightning existe; el P&L ilustrativo es 100% MP para no mezclar volatilidad de sats.

### Lámina 7 — Tres escenarios a 12 meses (2 min)

Mismos drivers; cambia la ejecución GTM. **Neutral = plan. Positivo ≠ guidance. Negativo = stress.** Cifras en sección 4. Frase: *ilustración con supuestos; se valida con P0.*

### Lámina 8 — Uso de capital / 90 días (60 s)

Campaña «Tu AFORE Soberana»; catálogo Fedi; un taller en federación piloto; P1 contenido. El dinero compra distribución y contenido. Infra ya está (Vercel + schema `retirobtc` en plan Free).

### Lámina 9 — Riesgos (45 s)

| Riesgo | Mitigación |
|--------|------------|
| Volatilidad asusta al retail | Default 15%, escenarios, proyección en MXN |
| Adopción Fedi lenta | Standalone + PWA; no dependemos del catálogo para existir |
| Regulación / KYC | Calculadora ≠ custodia ≠ asesoría |
| No hay ingresos aún | P0 ya escribe `purchases`; el hueco es GTM, no medición |
| Ticket bajo (20 MXN) | Volumen LATAM + mix lifetime; no AUM |

### Lámina 10 — Ask y cierre (45 s)

Leer el bloque ASK. Cierre: *siguiente hito = primer cobro atribuido + 90 días de campaña.* Ofrecer follow-up técnico: repo + `GET /api/p0-status`.

### Objeciones (3 min)

**“No hay tracción.”** Correcto: producto y medición viven; el cobro real aún no. Por eso el ask es GTM, no un Series A. P0 evita discutir ingresos a ciegas el trimestre que viene.

**“20 MXN no es un negocio.”** El mensual es la puerta. El lifetime (200 MXN) y el mix mueven el ARPU (38 → 74 → 101 MXN). No modelamos AUM a propósito: no custodiamos.

**“¿Por qué no el 82% histórico?”** Porque asusta y no es el default del producto. Comparamos con AFORE real (~5%) y proyectamos 15% base. Credibilidad > hype.

**“¿Y si Fedi no despega?”** El sitio ya corre fuera de Fedi. Fedi es canal, no único runtime.

**“¿Esto es legal / necesitan licencia?”** No custodiamos, no ejecutamos órdenes, no prometemos pensión. Somos herramienta de proyección + cobro de software Premium.

**“El escenario positivo parece un hockey stick.”** No se presenta como guidance. El plan es el **neutral** (~322k MXN bruto / ~+179k op. en 12 meses, ilustrativo). El positivo muestra que el cuello es distribución y conversión, no costo de servir.

### Checklist demo 90 s (si hay laptop)

1. Abrir `https://retirobtc.mx/calc` en español, ventana estrecha (mobile-first).
2. Valores simples: ahorro inicial + DCA mensual, 15 años, retorno **15%**.
3. Mostrar saldo en **sats y MXN**.
4. Comparador **AFORE vs Bitcoin**.
5. Mencionar Premium (PDF / escenarios) y que se paga en MXN o sats.
6. Cierre verbal: *si no sabes por dónde empezar → /brujula*.

**No abrir** Vercel, Supabase ni paneles de pago.  
**Si no hay red:** screenshots en [`campana-maraton-wenlopez.md`](./campana-maraton-wenlopez.md) (`assets/screenshots/fedi/`).

---

## 3. Estudio de mercado

Fuente: [`estudio-mercado-calculadora-retiro-bitcoin.md`](./estudio-mercado-calculadora-retiro-bitcoin.md), v1.0, **24 mayo 2026**, análisis interno (Gemini). No es un dictamen CONSAR. En sala: “según nuestro estudio”. El rendimiento **~5.02%** sí está cableado en el producto (`AFORE_REAL_RATE` en `script.js`).

### Timing 2026 — tres palancas

1. **Ventana política.** Ley de Infraestructura (abril 2026): AFORE puede destinar hasta ~30% a obra pública → percepción de riesgo político / “expropiación indirecta”.
2. **Custodia comunitaria.** Fedi / Fedimint / Guardianes: recuperación social sin ser experto en llaves. La calculadora es la interfaz; la federación es el respaldo.
3. **Distribución nativa.** Mini-app Fedi + Lightning + Nostr. Alianzas: Casa Satoshi (CDMX, San Cristóbal), White Paper House (Mérida), red Maciej Cepnik / Bitcoin Latam Report.

### Pirámide TAM / SAM / SOM

No se reclama un porcentaje del AUM nacional. SOM es **software Premium**, no custodia.

**TAM — sistema previsional México.** Ocupados que deberían ahorrar para el retiro (cotizantes AFORE + informal). Anclas del estudio:

- Comisión promedio AFORE ~0.538% sobre saldo.
- Rendimiento real histórico ~5.02% anual (vulnerable a inflación).
- Tasa de reemplazo objetivo ~70% en salarios bajos: difícil sin voluntario.
- Ahorro voluntario **< 2%** de activos totales.
- Reforma 2020 sube aportes patronales (6.5% → 15% SBC a 2030); la pensión media/baja sigue insuficiente.

**SAM — quienes ya tienen el job-to-be-done y el sistema no les sirve.**

- **Retail BTC (DCA):** validar si el ritmo actual alcanza; miedo a licuación del peso y a la auto-custodia solitaria.
- **Informal / gig:** ~34% de ocupados informales con AFORE inactiva; Uber / Rappi / DiDi sin IMSS regular. Entienden “retiro”; no confían en el canal formal.

Privacy advocate y trabajador sindicalizado son SAM de **fase 2** (mensaje y features), no el volumen del MVP.

**SOM — 12 meses.** Usuarios de `https://retirobtc.mx/calc` y de la mini-app Fedi en español (México primero, LATAM después) que pueden pagar Premium. El techo del modelo financiero de este documento es ese embudo, no el mercado de pensiones.

### Personas (prioridad de desarrollo)

| # | Persona | Job-to-be-done | Mensaje |
|---|---------|----------------|---------|
| 1 | Bitcoin holder retail | Validar DCA y ver si alcanza | “Tus pesos se licúan; tus sats no” |
| 2 | Informal / gig | Ahorrar retiro sin IMSS/AFORE activa | “Retiro a tu ritmo, con tu comunidad” |
| 3 | Privacy (fase 2) | Modelar retiro fuera del radar estatal | Soberanía, no jerga |
| 4 | Sindicalizado (fase 2) | Comparar AFORE vs ahorro comunitario | Rendimiento real, reglas claras |

Copy: comunidad y Guardianes, no “sé tu propio banco solo”.

### Competencia

| Frente | Qué venden | Hueco | Nosotros |
|--------|------------|-------|----------|
| AFORE / bancos | Portafolio opaco, ~5% real, riesgo político | No visualizan BTC ni inflación LATAM con regla 4% | Comparador honesto; no prometemos 82% |
| CEX (Bitso et al.) | Compra y custodia KYC | Congelamiento, no son plan de retiro | **No custodiamos** |
| Calculadoras crypto genéricas | Math en USD | Sin AFORE, sin MXN-first, sin Fedi | Mini-app + brújula + dual rail MXN/sats |

El wedge es la **calculadora** (conciencia numérica). Comprar BTC se refiere a Aureo; no tomamos el spread.

### Alianzas GTM

Casa Satoshi, White Paper House, Aureo / Bitcoin Latam Report, catálogo Fedi, relays Nostr, campaña landing «Tu AFORE Soberana».

---

## 4. Proyección financiera — 12 meses, 3 escenarios

**Naturaleza:** ilustración bottom-up para la reunión. **No** es un forecast auditado. Hoy `retirobtc.purchases` está vacío. Etiqueta en lámina: *ilustración con supuestos; se valida con P0*.

**Horizonte:** septiembre 2026 – agosto 2027. Moneda: **MXN**. No se proyecta el precio de BTC como ingreso (no hay AUM). Mix de cobro en el modelo: **100% Mercado Pago**.

### Unit economics (fijos)

| Ítem | Valor | Nota |
|------|-------|------|
| Precio mensual | 20 MXN | Default `MERCADOPAGO_PRICE_MONTHLY_MXN` |
| Precio lifetime | 200 MXN | Default `MERCADOPAGO_PRICE_LIFETIME_MXN` |
| Fee checkout MP | 3.5% | Ilustrativo; no incluye IVA del fee |
| Costo variable resto | ≈ 0 | Serverless; no custodia |
| Reconocimiento | Mes del cobro | Lifetime **no** se anualiza (conservador) |
| Renovaciones mensual | **No modeladas** | Cada mes = conversiones *nuevas*; el MRR recurrente es upside omitido |
| Tools (opex base) | 3,000 MXN/mes | Punto medio 2–4k (Vercel, dominio, email post-trial, APIs) |

**ARPU por conversión**

- Negativo (90% mensual / 10% lifetime): **38 MXN**
- Neutral (70% / 30%): **74 MXN**
- Positivo (55% / 45%): **101 MXN**

### Fórmulas

```
visitas_m     = visitas_M1 × (1 + g)^(m − 1)
premium_m     = visitas_m × conversión
ingreso_bruto = premium_m × ARPU
ingreso_neto  = bruto × (1 − 0.035)
opex_m        = 3,000 + ads_m
resultado_op  = neto − opex_m
```

Cifras de dinero redondeadas al peso; visitas y premium del detalle anual en el anexo.

### Drivers por escenario

| Driver | Negativo (stress) | Neutral (plan) | Positivo (upside) |
|--------|-------------------|----------------|-------------------|
| Qué asume | Campaña no pega; Fedi no distribuye; orgánico bajo | Landing + un taller + catálogo Fedi | Casa Satoshi + P1 contenido + recap maratón |
| Visitas `/calc` M1 | 1,500 | 6,000 | 15,000 |
| Crecimiento mensual | +5% | +15% | +22% |
| Conversión free→premium | 0.8% | 2.5% | 5.0% |
| Mix lifetime | 10% | 30% | 45% |
| Ads / contenido | 0 | 8,000 MXN/mes | 15,000 MXN/mes |
| Opex total / mes | 3,000 | 11,000 | 18,000 |

### Resultados — M1, M6, M12 y acumulado 12 meses

**Negativo**

| | Visitas | Premium | Bruto | Neto | Opex | Resultado op. |
|--|---------|---------|-------|------|------|----------------|
| M1 | 1,500 | 12 | 456 | 440 | 3,000 | −2,560 |
| M6 | 1,914 | 15 | 582 | 562 | 3,000 | −2,438 |
| M12 | 2,566 | 21 | 780 | 753 | 3,000 | −2,247 |
| **12 meses** | **23,876** | **191** | **7,258** | **7,004** | **36,000** | **−28,996** |

Lectura: cientos de MXN de ingreso al mes. El proyecto sobrevive como herramienta y marca. El cash burn es el de tools (~3k/mes), no el de una operación con nómina.

**Neutral (plan — el que se presenta)**

| | Visitas | Premium | Bruto | Neto | Opex | Resultado op. |
|--|---------|---------|-------|------|------|----------------|
| M1 | 6,000 | 150 | 11,100 | 10,712 | 11,000 | −288 |
| M6 | 12,068 | 302 | 22,326 | 21,545 | 11,000 | +10,545 |
| M12 | 27,914 | 698 | 51,642 | 49,834 | 11,000 | +38,834 |
| **12 meses** | **174,010** | **4,350** | **321,919** | **310,651** | **132,000** | **+178,651** |

Lectura: casi empate en M1 (ads 8k vs primer tramo de conversión). A partir de M2 el resultado operativo es positivo en este ilustrativo. KPI de conversión del brief (2–5%): aquí se usa **2.5%**, la mitad baja del rango. Crecimiento de visitas **+15%**, recortado vs el +20% post-campaña del brief.

**Positivo (upside — no es guidance)**

| | Visitas | Premium | Bruto | Neto | Opex | Resultado op. |
|--|---------|---------|-------|------|------|----------------|
| M1 | 15,000 | 750 | 75,750 | 73,099 | 18,000 | +55,099 |
| M6 | 40,541 | 2,027 | 204,730 | 197,565 | 18,000 | +179,565 |
| M12 | 133,675 | 6,684 | 675,058 | 651,430 | 18,000 | +633,430 |
| **12 meses** | **673,105** | **33,655** | **3,399,183** | **3,280,211** | **216,000** | **+3,064,211** |

Lectura: el upside viene de **más visitas × 5% conv. × más lifetime**, no de subir el precio. Sirve para mostrar que el costo de servir no escala; el cuello es distribución. No se lee en sala como forecast.

### Interpretación (cuatro líneas)

1. El **negativo** acota el downside: sin campaña, el hueco es ~29k MXN en 12 meses de tools, no una quiebra operativa.
2. El **neutral** es el plan: ~322k MXN brutos y ~+179k operativos ilustrativos si GTM 90 días funciona a medias.
3. El **positivo** no se promete; muestra palanca de conversión y mix.
4. Ningún escenario incluye AUM, merch, CFDI ni renovaciones de mensual — si esas líneas aparecen, son extra.

### Sensibilidad (neutral, M1)

Base M1: 6,000 visitas × 2.5% × 74 MXN = **11,100 MXN** brutos.

| Shock | Bruto M1 | Delta vs base |
|-------|----------|----------------|
| Conversión **+1 pp** (a 3.5%) | 15,540 | **+4,440** (+40%) |
| Conversión **−1 pp** (a 1.5%) | 6,660 | **−4,440** |
| Visitas M1 **+5%** | 11,655 | +555 (+5%) |
| Visitas M1 **−5%** | 10,545 | −555 |

**±1 pp de conversión mueve más el P&L de M1 que ±5% de tráfico.** Por eso P0 (medir el cobro) y P2 (nurture / conversión) valen más que un rewrite de la calculadora.

### Qué no entra al modelo

AUM; take-rate de compra BTC (Aureo); Lightning en el P&L; merch / cold wallets (P3); CFDI (P4); ronda de equity; IVA del fee MP; nómina; renovaciones del plan mensual.

---

## 5. Anexo: fuentes, fórmulas y lo que no se afirma

### Fuentes

| Dato | Fuente | Cómo decirlo |
|------|--------|----------------|
| AFORE ~5.02% real | Estudio 24 may 2026 **y** `AFORE_REAL_RATE` en `script.js` | “El número que usa el producto” |
| Voluntario < 2%; comisión 0.538%; reemplazo ~70%; 30% obra pública; 34% informal AFORE inactiva | Estudio interno 24 may 2026 | “Según nuestro estudio” — no “según CONSAR” |
| Default proyección BTC 15% | Brief de producto / UX | Conservador a propósito; **no** 82% histórico |
| Precios 20 / 200 MXN | `README.md` env defaults | Precios de lista actuales |
| Conversión 2–5% | KPI del product brief | El plan usa 2.5% |
| Tracción 16 ago 2026 | Activación P0 en vivo | Cero filas reales en `purchases` |
| Alianzas | Brief + estudio | Pipeline, no contratos firmados en este doc |

Estudio completo: [`estudio-mercado-calculadora-retiro-bitcoin.md`](./estudio-mercado-calculadora-retiro-bitcoin.md). Producto: [`product-brief.md`](./product-brief.md). Medición: [`activar-p0-produccion.md`](./activar-p0-produccion.md).

### Detalle mensual (redondeo de visita al entero más cercano en tablas de sala)

Ver sección 4 para M1/M6/M12. Acumulados usados en el one-pager salen de sumar los 12 meses **sin** redondear mes a mes el premium (float × ARPU), luego redondear el total al peso.

**Negativo** (g=5%, conv=0.8%, ARPU=38, opex=3,000): bruto 12m 7,258; neto 7,004; op. −28,996.  
**Neutral** (g=15%, conv=2.5%, ARPU=74, opex=11,000): bruto 12m 321,919; neto 310,651; op. +178,651.  
**Positivo** (g=22%, conv=5%, ARPU=101, opex=18,000): bruto 12m 3,399,183; neto 3,280,211; op. +3,064,211.

### Qué SÍ se afirma

- Producto live en `https://www.retirobtc.mx`.
- No custodia de fondos.
- Default 15%; comparación vs ~5% AFORE.
- P0 de medición activa; Rito; dual rail MXN/sats.
- Mercado TAM/SAM/SOM con fuente mayo 2026.
- Tres escenarios **ilustrativos**.

### Qué NO se afirma

- 82% histórico como caso base.
- Promesa de pensión, rendimiento o “AFORE Bitcoin”.
- MRR, DAU, usuarios o ingresos actuales.
- Que P0 ya tiene cobros reales.
- DNS `agents.retirobtc.mx` (no usar).
- El escenario positivo como *guidance* o forecast auditado.
- Contratos cerrados con Casa Satoshi / Fedi / Aureo.
- Comisión por compra de BTC.
- Necesidad de plan Pro de Supabase o de despertar el proyecto iLATAM.

### Follow-up de due diligence (si lo piden)

Repo: `https://github.com/Edgadafi/Calculadora-de-Retiro-Bitcoin-Fedi`  
Sonda pública (sin secretos): `GET https://www.retirobtc.mx/api/p0-status`  
No compartir `INTERNAL_API_SECRET`, `SUPABASE_SERVICE_ROLE_KEY` ni la clave del webhook.
