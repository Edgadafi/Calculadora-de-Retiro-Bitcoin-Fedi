# Product brief — Calculadora de Retiro Bitcoin (Fedi)

> Fuente completa: [`estudio-mercado-calculadora-retiro-bitcoin.md`](./estudio-mercado-calculadora-retiro-bitcoin.md)

Documento operativo para desarrollo, diseño y go-to-market. Actualizar cuando cambien decisiones de producto.

---

## 1. Qué es y por qué ahora (2026)

Mini-app en **Fedi.xyz** que proyecta retiro con **Bitcoin (sats)**, comparando escenarios frente al sistema AFORE tradicional. No es solo matemática: es herramienta de **soberanía financiera** y **custodia comunitaria** (Fedimint / Guardianes).

**Timing:** Ley de Infraestructura (abr. 2026, hasta 30% AFORE en obra pública) + rendimiento real AFORE ~5% vs narrativa BTC + madurez Lightning/Nostr.

---

## 2. Propuesta de valor (una línea)

*Visualiza tu retiro en una moneda que no se imprime, con la seguridad de tu comunidad — sin ser experto en llaves privadas.*

---

## 3. URLs y arquitectura de producto

| Superficie | URL | Rol |
|------------|-----|-----|
| Landing | `https://retirobtc.mx/` | Institucional, confianza, SEO |
| Calculadora (Mini App Fedi) | `https://retirobtc.mx/calc` | Core product |
| Brújula | `https://retirobtc.mx/brujula` | Embudo educativo / segmentación |

---

## 4. Personas (prioridad de desarrollo)

| # | Persona | Job-to-be-done | Mensaje clave |
|---|---------|----------------|---------------|
| 1 | **Bitcoin Holder retail** | Validar DCA y ver si alcanza para jubilarse | “Tus pesos se licúan; tus sats no” |
| 2 | **Informal / gig economy** | Ahorrar retiro sin IMSS/AFORE activa | “Retiro formal-comunitario a tu ritmo” |
| 3 | **Privacy Advocate** | Modelar retiro fuera del radar estatal | “Retiro invisible, patrimonio soberano” |
| 4 | **Trabajador sindicalizado** | Comparar AFORE vs ahorro comunitario BTC | “Rendimiento real, reglas claras” |

**Usuario primario MVP:** retail + informal (mayor volumen). Privacy y sindicalizado en mensajes y features fase 2.

---

## 5. Diferenciadores vs competencia

- **vs AFORE/bancos:** inflación real configurable, regla 4%, BTC como reserva escasa, sin supuestos optimistas del banco central.
- **vs CEX:** no custodia centralizada, e-cash/privacidad federada, resistencia a congelamiento regulatorio.
- **vs calculadoras crypto genéricas:** integración Fedi, Guardianes, Stable Balance, Nostr/Lightning nativos.

---

## 6. Decisiones de producto ya tomadas

| Decisión | Estado |
|----------|--------|
| Stack frontend vanilla (HTML/CSS/JS) | ✅ Implementado |
| Mini App Fedi en `/calc` | ✅ |
| Freemium + Premium (PDF, escenarios, plan cifrado) | ✅ |
| Pagos Premium: Mercado Pago (MXN) + Lightning/WebLN | ✅ |
| Multi-idioma (ES, EN, PT, FR) | ✅ |
| Precio BTC vía CoinGecko | ✅ |
| Regla del 4% y múltiples escenarios | ✅ |
| Brújula como embudo educativo | ✅ |
| Enlace a Aureo para comprar BTC | ✅ |

**No reabrir sin confirmación explícita:** enfoque Bitcoin puro (no altcoins), Fedi como canal principal, México/LATAM como mercado inicial.

---

## 7. Features — Must / Should / Could

### Must (alineado al estudio + repo actual)
- Proyección con aportación inicial + DCA mensual
- Comparación de escenarios (conservador / base / optimista)
- Regla del 4% para retiro sostenible
- Mostrar resultados en fiat local **y** BTC/sats
- Export PDF (Premium)
- Compartir proyección (growth loop)
- Integración `window.fedi` (moneda preferida)
- WebLN para pagos Premium

### Should (próximas iteraciones según estudio)
- **Comparador AFORE vs Bitcoin** (side-by-side con defaults del estudio: 5.02% vs 15–30%)
- **Default UX “Stable Balance”:** proyección en MXN con ahorro subyacente en sats
- Sugerencias de **micro-ahorro Lightning** (1,000 sats/día, semanal)
- Copy educativo sobre **Guardianes** y recuperación comunitaria
- **Nostr:** compartir badge / proof of savings (sin exponer datos sensibles)
- Campaña landing **“Tu AFORE Soberana”** (narrativa Ley Infraestructura 2026)
- Segmentación en brújula hacia las 4 personas

### Could (fase 2+)
- Mod de ahorro grupal (aportación sugerida por objetivos comunitarios)
- Integración remesas → ahorro retiro
- Certificación “federación amigable con retiro” (Casa Satoshi)
- Federaciones piloto (Mérida / White Paper House)

---

## 8. Modelo de negocio

| Plan | Precio referencia | Notas |
|------|-------------------|-------|
| Free | $0 | Calculadora básica, 1 escenario |
| Premium mensual | MXN vía Mercado Pago (~$20 MXN en env) | PDF, escenarios, plan cifrado |
| Premium lifetime | MXN vía Mercado Pago (~$200 MXN en env) | |
| Lightning | Sats vía WebLN | Alternativa si `PAYMENT_USE_MERCADOPAGO = false` |

Monetización secundaria futura: alianzas educativas (Casa Satoshi), federaciones certificadas, contenido patrocinado responsable.

---

## 9. Go-to-market (90 días)

| Fase | Acción | Canal |
|------|--------|-------|
| 1 | Campaña “Tu AFORE Soberana” | Landing, X, Telegram BTC LATAM |
| 2 | Envío catálogo Fedi Mini Apps | `retirobtc.mx/calc` |
| 3 | Talleres + demo en federación piloto | Casa Satoshi, White Paper House |
| 4 | Contenido Maciej / Bitcoin Latam Report | Podcast, Nostr |
| 5 | Challenge “comparte tu proyección” | Botón compartir + relays Nostr |
| 6 | Enfoque gig economy | Copy y ads en comunidades Uber/Rappi BTC |

---

## 10. KPIs

| Métrica | Objetivo inicial |
|---------|------------------|
| Visitas únicas `/calc` | Baseline + 20% mensual post-campaña |
| Conversión free → premium | 2–5% |
| Retención 7 días | > 15% |
| Shares / proof of savings | Trackear en localStorage + eventos |
| Revenue MXN + sats | Por canal de pago |
| Completitud brújula → calc | Embudo brújula → registro de plan |

---

## 11. Riesgos y mitigaciones

| Riesgo | Mitigación en producto |
|--------|------------------------|
| Volatilidad BTC asusta al retail | Default proyección en MXN (Stable Balance), escenarios conservadores |
| Curva Fedi/guardianes | Copy en brújula + tooltips; no asumir conocimiento técnico |
| Dependencia adopción Fedi | Landing standalone + PWA; funciona sin Fedi |
| Regulación / KYC | No custodiar fondos; calculadora ≠ exchange |
| Lightning liquidez baja | Mercado Pago como rail alternativo ya implementado |

---

## 12. Estado actual vs roadmap

| Área | Hoy | Siguiente |
|------|-----|-----------|
| Core calc | ✅ | Comparador AFORE vs BTC ✅ |
| Premium / pagos | ✅ MP + WebLN | Optimizar conversión |
| Fedi integration | ✅ prefs | Copy guardianes |
| Nostr | Parcial (NIP-78 guardar plan) | Badges / share |
| Marketing narrative | Genérico | **«Tu AFORE Soberana»** ✅ en landing |
| Stable Balance UX | Parcial (multi-moneda) | Default MXN + narrativa |
| Alianzas | En README | Outreach Casa Satoshi |

---

## 13. Principios de UX/copy

- Hablar de **poder adquisitivo** y **libertad**, no de “number go up”.
- Comparar con **AFORE real** (~5%), no prometer 82% histórico como default.
- Enfatizar **comunidad y recuperación**, no “sé tu propio banco solo”.
- Privacidad como beneficio, no como jerga técnica.
- Mobile-first; audiencia LATAM, español primero.

---

## 14. Backlog derivado (tickets sugeridos)

1. ~~`feat: comparador AFORE vs Bitcoin en resultados`~~ ✅
2. ~~`content: campaña landing Tu AFORE Soberana`~~ ✅
3. `ux: default proyección MXN + tooltip Stable Balance`
4. `feat: sugerencia micro-ahorro Lightning (monto/día)`
5. `content: sección Guardianes en brújula o help`
6. `feat: Nostr badge compartible (sin PII)`
7. `growth: UTM + tracking embudo brújula → calc → premium`
