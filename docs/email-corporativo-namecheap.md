# Email corporativo @retirobtc.mx — Namecheap

> Captura de planes (16 ago 2026) y decisión de arranque **gratuito**.
> Destino actual de contacto: `calculadora.retirobtc@gmail.com`.
> El dominio usa Namecheap BasicDNS, requisito del reenvío gratis.

---

## 1. Qué viste en la página de planes

Esa pantalla (`namecheap.com/hosting/email/?trial-plans`) es **Private Email**, correo con buzón propio. El toggle de arriba tiene dos modos:

| Toggle | Qué es en realidad |
|--------|--------------------|
| **Free trial** | 30 días a $0, luego cobra el plan anual. No es gratis permanente. |
| **Bill yearly** (la captura) | Precio con promo `MAILDEAL`, primer año. La renovación vuelve al precio lleno. |

Ninguno de los tres recuadros (Scale / Expand / Launch) es la opción gratuita permanente.

---

## 2. Tabla de planes de pago (Bill yearly + MAILDEAL)

Precios de la captura, facturación anual, promo aplicada. La renovación es el precio sin descuento.

| Plan | Mailboxes | Precio promo | Primer año | Renovación | Almacenamiento | Aliases / mailbox |
|------|-----------|--------------|------------|------------|----------------|-------------------|
| **Launch** | 1 | $0.99/mes (antes $1.24) | $11.88 | $14.88/año | 5 GB | 10 |
| **Expand** (Best value) | 3 | $2.50/mes (antes $3.49) | $29.98 | $41.88/año | 30 GB | 50 |
| **Scale** | 5 | $3.99/mes (antes $5.99) | $47.88 | $71.88/año | 75 GB | Ilimitados |

Todos incluyen: asistente IA, webmail + calendario, anti-spam y 2FA. Scale añade “Premium email delivery”.

Condiciones de Namecheap (ago 2026):

- `MAILDEAL` solo aplica al **primer año** y a la cantidad de mailboxes por defecto, no a buzones extra
- Trial de 30 días: Launch hasta 5 por cuenta; Expand/Scale 1 por cuenta; una vez por dominio
- En trial el almacén baja a ~200 MB y **no hay auto-forward ni redirect**
- Private Email y el reenvío gratis **no se pueden usar a la vez**

---

## 3. La opción gratuita (prioridad)

Namecheap no da buzón permanente a $0. Lo que sí es gratis para siempre, y ya lo incluye el dominio, es **Email Forwarding**:

| | Email Forwarding (gratis) | Private Email trial | Private Email de pago |
|--|---------------------------|---------------------|------------------------|
| Costo | $0, ilimitado en el tiempo | $0 por 30 días | Desde $11.88/año |
| Recibir en `@retirobtc.mx` | Sí | Sí | Sí |
| Enviar como `@retirobtc.mx` | No (el alias es virtual) | Sí | Sí |
| Buzón / webmail | No | Sí (200 MB) | Sí |
| Aliases | Hasta 100 | 1 mailbox en trial | Según plan |
| Convive con el otro | No | No | No |

Límite: hasta 100 reenvíos. El catch-all (`*@retirobtc.mx`) solo puede ir a **una** bandeja.

Por eso el trial no es la opción prioritaria: a los 30 días o pagas, o pierdes el `@`, y mientras tanto no puedes reenviar. El forwarding no caduca y no toca Account Funds.

### Lo que no cubre el forwarding

No puedes *enviar* desde `hola@retirobtc.mx`. El destinatario escribe a esa dirección y el mensaje llega a Gmail; la respuesta sale de `calculadora.retirobtc@gmail.com` salvo que más adelante actives “Enviar como” con un buzón de pago.

Para este momento eso basta: el contacto público ya es Gmail, y Resend (guía de `/brujula`) es otro canal, transaccional, que no sustituye el MX.

---

## 4. Cuentas corporativas a crear (fase gratis)

Todas reenvían a `calculadora.retirobtc@gmail.com` hasta que haya un buzón de pago.

| Alias | Dirección | Uso |
|-------|-----------|-----|
| `hola` | hola@retirobtc.mx | Contacto público (landing, X, Fedi) |
| `rito` | rito@retirobtc.mx | Escalamiento del agente (hoy `calculadora.retirobtc@gmail.com`) |
| `contacto` | contacto@retirobtc.mx | Alias de respaldo / campañas |
| `facturacion` | facturacion@retirobtc.mx | CFDI y conciliación (Vertical 3, más adelante) |
| `*` (catch-all) | *@retirobtc.mx | Errores de tipeo; una sola bandeja destino |

No crear `noreply@` aquí: ese dominio de envío lo opera Resend, no el MX de Namecheap.

---

## 5. Cómo activarlo (sin pagar)

El dominio ya está en **Namecheap BasicDNS**, que es el requisito.

1. Domain List → **Manage** `retirobtc.mx` → pestaña **Advanced DNS**
2. **Mail Settings** → elegir **Email Forwarding** → Save (Namecheap escribe los MX y un SPF; no lo borres)
3. Pestaña **Domain** → sección **Redirect Email** → **Add Forwarder**
4. Alias `hola` → Forward to `calculadora.retirobtc@gmail.com` → check
5. Repetir para `rito`, `contacto`, `facturacion`
6. **Add catch all** → la misma bandeja Gmail
7. Esperar ~1 hora. Probar enviando **desde otro correo**, no desde el Gmail de destino: Namecheap descarta esa prueba a propósito

Si más adelante contratas Private Email, hay que **apagar** estos forwarders: los dos servicios no conviven.

---

## 6. Cuándo sí pagar

Subir a **Launch** ($11.88 el primer año, $14.88 al renovar) solo cuando haga falta **enviar** como `@retirobtc.mx` (facturas, nurture de P2, o “Enviar como” en Gmail). Un mailbox alcanza; Expand/Scale son para equipo, no para hoy.

No actives el trial “por probar”: consume la única prueba del dominio, limita el almacenamiento y te deja sin forwarding. Si a los 30 días Account Funds sigue en cero, se cancela igual que RelateSocial.

---

## 7. Relación con el resto del stack

| Canal | Quién lo opera | No mezclar con |
|-------|----------------|----------------|
| Recepción `@retirobtc.mx` | Namecheap Email Forwarding | Private Email |
| Contacto humano (Rito) | Gmail `calculadora.retirobtc@gmail.com` | — |
| Guía / leads `/brujula` | Resend en `agents/` | MX de Namecheap |
| Cobros Premium | Mercado Pago / Lightning | Correo |

---

*Captura de precios: 16 ago 2026 · Fuente: Namecheap Private Email, toggle Bill yearly, promo MAILDEAL.*
