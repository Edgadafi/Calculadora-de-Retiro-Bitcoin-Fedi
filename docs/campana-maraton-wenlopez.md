# Campaña — Maratón Bitcoiner (10 jul 2026)

Evento: [wenlopezn.com/maraton](https://wenlopezn.com/maraton) — 12 h en vivo, Salita Bitcoiner × Fedi (X + YouTube).

## Bloque asignado

| Campo | Valor |
|-------|--------|
| Horario | **12:00–13:30** (CDMX) |
| Tema | Productos bitcoiners en México |
| Panel | Bitsave · Aureo (Maciej) · ArcadiaB · **retirobtc.mx** |
| Co-host | Emily |

**Tiempo por producto:** ~15–20 min. Demo calc **≤3 min**.

## URLs con tracking

| Uso | URL |
|-----|-----|
| Demo en vivo | `https://retirobtc.mx/calc?utm_source=maraton-wenlopez&utm_medium=live&initial=500&contribution=100&years=15&return=15&currency=USD` |
| Recap post-evento | `https://retirobtc.mx/calc?utm_source=maraton-recap&utm_medium=social` |
| Brújula (embudo) | `https://retirobtc.mx/brujula?utm_source=maraton-wenlopez&utm_medium=live` |
| Compartir (UTM automático) | Si el usuario entró con `utm_source=maraton-wenlopez`, el botón compartir incluye `utm_source=share-maraton` |

## Guion demo (≤3 min)

1. Abrir URL demo (valores pre-cargados + auto-cálculo).
2. Mostrar saldo en **sats** y **MXN/USD**.
3. Mencionar **regla del 4%** (premium o explicación verbal).
4. Comparador **AFORE vs BTC** si hay tiempo.
5. Cierre: *"Si no sabes por dónde empezar → retirobtc.mx/brujula"*

## Introducción (~30 s)

> retirobtc.mx es la calculadora de retiro en Bitcoin para México: proyectas en sats cuánto podrías tener si ahorras como hoy, comparas con el AFORE real y ves si te alcanza la regla del 4%. No custodiamos — iluminamos. Mini-app en Fedi, gratis, en español.

## Posicionamiento en el panel

- **Aureo** = cómo comprar BTC → **retirobtc.mx** = para qué y cuánto alcanza.
- Frase: *"Compras en Aureo, modelas en retirobtc.mx."*

## Preguntas guía — respuestas

### 1. ¿Problema específico y por qué Bitcoin?

Millones en México planean retiro con AFORE o nada (informales sin IMSS). Rendimiento real ~5%, inflación licúa poder adquisitivo; la Ley de Infraestructura 2026 aumenta desconfianza. No hay herramienta simple en español para **visualizar** retiro en reserva escasa sin prometer rentabilidad bancaria.

Bitcoin es reserva digital verificable y portable; no custodiamos — damos **conciencia numérica** en sats.

### 2. ¿Fricción en México? ¿Reto más grande?

Regulación ambigua (no somos asesores ni custodios), educación (BTC = casino en la cabeza del usuario), pagos MP + Lightning.

Reto: traducir Fedimint/Guardianes/Lightning a UX **mobile-first en español** sin perder rigor → mini-app Fedi + proyección conservadora + brújula.

### 3. ¿Usuario real y cómo llegas?

Retail DCA + informal/gig sin AFORE. Default en MXN; no asumimos que todos conocen sats.

Canales: catálogo Fedi, *Tu AFORE Soberana*, maratón (Wen/Emily), Nostr/Telegram LATAM, Aureo, brújula.

### 4. ¿Producto en 2 años?

Mini-app en federaciones LATAM; comparador AFORE vivo; micro-ahorro Lightning; agente **Rito** para dudas educativas; miles de proyecciones compartidas.

## Agregar mini-app en Fedi (pegar en chat del stream)

```
¿Cómo probar retirobtc.mx en Fedi?
1. Abre Fedi → ícono Mini apps
2. Toca + y pega: https://retirobtc.mx/calc
3. Guardar → abrir desde tu catálogo personal
```

El listado oficial en catalog.fedi.xyz puede tardar; la URL directa funciona hoy.

## Checklist pre-live (11:45)

- [ ] URL demo abre con resultado en <10 s
- [ ] Precio BTC visible (CoinGecko o fallback)
- [ ] Rito carga o `?rito=0` si falla
- [ ] Bio X con link UTM
- [ ] Screenshot listo para Emily
- [ ] Ícono Fedi: `https://retirobtc.mx/assets/logo-fedi-512.png`

## Coordinación

| Persona | Acción |
|---------|--------|
| Emily | Link demo + 1 screenshot antes del bloque |
| Wen | Opcional: actualizar tarjeta a ícono brújula v2 |
| Maciej | Mencionar complemento on-ramp → proyección |

---

# Kit post-marathon

## Thread recap X (5 posts)

1. **Problema:** AFORE ~5% real + inflación → por qué modelar en sats.
2. **Demo:** link `?utm_source=maraton-recap` + captura de resultado.
3. **Panel:** Aureo compra, retirobtc.mx proyecta — ecosistema MX.
4. **Gracias:** @Wenlopezn @Emily + comunidad Fedi.
5. **CTA:** `retirobtc.mx/brujula` si no sabes por dónde empezar.

## Post fijado

Texto sugerido:

> Calcula tu retiro en Bitcoin (gratis, español, mini-app Fedi). Proyección conservadora, comparador AFORE, regla del 4%.
> 👉 https://retirobtc.mx/calc?utm_source=maraton-recap

## Leads y métricas

- Revisar tráfico con UTM `maraton-wenlopez`, `share-maraton`, `maraton-recap`.
- Leads vía agente Rito → `retirobtc-agents.vercel.app` / Supabase si configurado.

## Clip Reel

Pedir a Wen timestamp del bloque 12:00–13:30 para corte 60 s (demo + hook AFORE).
