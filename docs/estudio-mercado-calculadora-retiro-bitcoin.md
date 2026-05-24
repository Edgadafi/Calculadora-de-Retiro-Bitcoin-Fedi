# Estudio de mercado — Calculadora de Retiro con Bitcoin (Fedi)

---
version: 1.0
fecha: 2026-05-24
fuente: Análisis estratégico Gemini (mayo 2026)
estado: activo
---

## Resumen ejecutivo

El sistema de ahorro para el retiro en México (2025–2026) atraviesa un punto de inflexión: reformas legislativas, volatilidad económica y adopción de Bitcoin y Fedimint crean demanda por herramientas de soberanía financiera. La **Calculadora de Retiro con Bitcoin** como mini-app en **Fedi.xyz** no es solo proyección matemática; es respuesta a la erosión de confianza en instituciones centralizadas y a la necesidad de custodia comunitaria.

### Tres factores críticos (2026)

1. **Ventana política:** Ley de Infraestructura (abril 2026) permite a AFORE invertir hasta 30% en obra pública estatal → percepción de riesgo de mal manejo / “expropiación indirecta” → oportunidad para auto-custodia y custodia comunitaria.
2. **Custodia Fedi/Fedimint:** Resuelve miedo a pérdida de llaves y complejidad técnica. La calculadora debe enfatizar **Guardianes** y recuperación social.
3. **Distribución:** Integración nativa Fedi + Nostr + Lightning → viral, resistente a censura. Alianzas: **Casa Satoshi** (CDMX, San Cristóbal), **White Paper House** (Mérida), red **Maciej Cepnik** (Bitcoin Latam Report).

---

## Contexto previsional México (2025–2026)

| Indicador | Valor AFORE (2026) | Implicación |
|-----------|-------------------|-------------|
| Comisión promedio | 0.538% sobre saldo | Tendencia a mejorar rendimiento neto |
| Rendimiento real histórico | ~5.02% anual | Vulnerable a inflación |
| Tasa de reemplazo objetivo | ~70% salarios bajos | Difícil sin ahorro voluntario |
| Inversión en infraestructura | Hasta 30% portafolio | Desconfianza por nueva ley |
| Ahorro voluntario | < 2% activos totales | Oportunidad masiva para apps alternativas |

Reforma 2020 eleva aportes patronales (6.5% → 15% SBC para 2030), pero pensión media/baja sigue insuficiente. Bitcoin ~82% anual histórico (10 años) vs ~5% AFORE → la calculadora visualiza la disparidad.

---

## Buyer personas

### Privacy Advocate
- **Miedos:** Vigilancia estatal, congelamiento, pérdida de anonimato, Travel Rule FATF.
- **Aspira:** Retiro “invisible”, patrimonio en BTC, acceso sin identidad centralizada.
- **Fedi:** E-cash Chaum, Nostr, código abierto.

### Bitcoin Holder retail
- **Miedos:** Inflación, licuación del poder adquisitivo, complejidad de auto-custodia.
- **Aspira:** DCA validado, retiro digno, preservación de riqueza.
- **Fedi:** Guardianes, Stable Balance.

### Trabajador sindicalizado
- **Miedos:** Mal manejo estatal de fondos, bajas pensiones, uso político del ahorro.
- **Aspira:** Rendimiento > AFORE, transparencia, control gremial vía federación.
- **Fedi:** Federaciones locales, mini-apps de ahorro grupal.

| Perfil | Miedos | Aspiraciones | Factor Fedi |
|--------|--------|--------------|-------------|
| Privacy Advocate | Vigilancia, congelamiento | Soberanía, control de datos | E-cash, Nostr |
| Retail | Inflación, auto-custodia | DCA, retiro cómodo | Guardianes, Stable Balance |
| Sindicalizado | Expropiación, bajas pensiones | Rendimiento real, transparencia | Federaciones, facilidad |

---

## Ecosistema Fedi

- **Mods:** Mini-apps modulares → “SO para comunidades”. Calculadora puede ser motor de mods de ahorro grupal.
- **Guardianes:** Recuperación social ante pérdida de dispositivo; elimina punto único de falla humano.
- **Stable Balance:** Proyección en MXN / poder adquisitivo local con activo subyacente en BTC.
- **Código abierto (2026):** Auditable vs AFORE/bancos opacos.
- **G-Bot:** Federación en 3 pasos, ~$30 USD/mes → expansión orgánica del mercado.

---

## Panorama competitivo

| Característica | AFORE / bancos | CEX (Bitso, etc.) | Calculadora Fedi |
|----------------|----------------|-------------------|------------------|
| Activo | MXN fiat | Criptos / stables | Bitcoin (sats) |
| Privacidad | Nula (SAT) | Baja (KYC) | Alta (e-cash federada) |
| Custodia | Estatal | Terceros | Comunitaria (Guardianes) |
| Rendimiento | ~5% real | Variable | Alto histórico BTC |
| Resiliencia | Reformas políticas | Quiebras CEX | Censura-resistente |

**Ventajas vs tradicional:** inflación real ajustable, regla del 4%, unidad de cuenta escasa.  
**Ventajas vs CEX:** no custodia centralizada, privacidad, resistencia regulatoria local.

---

## Estrategia de alianzas y canales

### Físico / confianza
- **Casa Satoshi** (CDMX, San Cristóbal): talleres, validación experta.
- **White Paper House** (Mérida): federaciones piloto.
- **Maciej Cepnik / Bitcoin Latam Report:** recomendación en contenido de planificación financiera.

### Nostr
- Relays regionales (ej. `wss://relay.nostr.dev.br`).
- Badges / Proof of Savings en perfil (privacidad preservada).
- Social Savings basados en proyecciones de la calculadora.

### Lightning
- Micro-ahorro diario/semanal (ej. 1,000 sats/día).
- Remesas EE.UU. → MX como destino de ahorro retiro (costo < 0.1% vs ~6.2% tradicional).

---

## DAFO (SWOT)

**Fortalezas:** Integración Fedi, Fedimint, BTC puro, privacidad Chaumian.  
**Debilidades:** Dependencia de adopción Fedi, volatilidad percibida, curva educativa (federación/guardianes).  
**Oportunidades:** Crisis pensiones, Ley Infraestructura 2026, remesas, jóvenes 18–29 buscando alternativas, informal sin aportaciones AFORE (34% con cuenta pero sin cotizar).  
**Amenazas:** Regulación auto-custodia/KYC, liquidez Lightning, ETFs/cuentas reguladas EE.UU. compitiendo por capital sofisticado.

---

## Segmento objetivo prioritario

**“Excluidos” informales:** 34% ocupados informales con AFORE inactiva — entienden retiro pero el sistema formal no les convence. **Gig economy** (Uber, Rappi, Didi) sin IMSS regular.

---

## Modelado y producto

Fórmula base: capitalización compuesta con aportaciones $A_t$ y crecimiento $r$.

**Ejemplo:** $500 MXN/mes, BTC conservador 15% anual, inflación peso 5% → poder adquisitivo superior a subcuenta voluntaria AFORE en 20 años.

| Variable | AFORE voluntario | Bitcoin en Fedi |
|----------|------------------|-----------------|
| Aportación | $500 MXN | $500 MXN (sats) |
| Rendimiento | ~5% real | 15–30% conservador BTC |
| Disponibilidad | Restringida (65+) | Total (e-cash) |
| Riesgo político | Alto | Bajo (soberanía tecnológica) |

Variables que calculadoras tradicionales ignoran: inflación real LATAM, regla 4%, escasez de BTC, comparación AFORE vs BTC.

---

## Recomendaciones estratégicas inmediatas

1. **Campaña “Tu AFORE Soberana”** — capitalizar descontento Ley Infraestructura abril 2026.
2. **Certificación de federaciones** con Casa Satoshi (“amigables con el retiro”).
3. **Stable Balance como default UX** — proyección en MXN, ahorro en sats.
4. **Gig economy** — distribución en trabajadores de plataforma sin pensión formal.
5. **Micro-ahorro Lightning** — depósitos diarios/semanales sugeridos desde la calculadora.

---

## Conclusión

Market-Product Fit excepcional para México 2026: crisis confianza AFORE + madurez Fedimint + Lightning. El retiro LATAM vendrá de herramientas que devuelven poder al individuo y a la comunidad; esta calculadora es la interfaz de esa realidad.
