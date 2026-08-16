# Email corporativo @retirobtc.mx — Namecheap

> Destino humano de respaldo: `calculadora.retirobtc@gmail.com`.
> Dominio en Namecheap BasicDNS. Cobro del dominio: [`namecheap-billing.md`](./namecheap-billing.md).

## Pedido vivo (15 ago 2026, 20:55) — compra terminada

| Campo | Valor |
|-------|--------|
| Order ID | **211252243** |
| Recibo | `namecheap-order-211252243.pdf` |
| Producto | **Scale Email**, 1 mes, 5 mailboxes |
| Cobrado | **$0.00** (Account Funds) |
| Transaction ID | 256650766 |
| Decisión | Seguir con Private Email Scale (trial 30 días). El forwarding gratis **no** convive. |

Namecheap trata el trial como compra. MAILDEAL no aplica después del trial. Este dominio ya no puede volver a probar Private Email. Con Auto-Renew OFF no hay cobro el 16 sep: el plan simplemente caduca.

**Auto-Renew del email: OFF** (confirmado 16 ago 2026 en Product List → Email Subscriptions). Vence **16 sep 2026**; no se cobra solo. Ese día: Launch (~$14.88/año) o cancelar y pasar a forwarding. No aceptes Shared Hosting.

En trial el almacén baja (~200 MB) y no hay auto-forward: cada alias tiene que ser un **buzón real**.

### Alta ahora (orden)

1. Domain List → Manage `retirobtc.mx` → **Advanced DNS** → Mail Settings → **Private Email** → Save. Namecheap escribe MX (`mx1`/`mx2.privateemail.com`) y SPF. No los borres. Espera ~30 min.
2. Sidebar **Private Email** → Manage `retirobtc.mx` → **Create Mailbox** (el botón naranja de la confirmación).
3. Crea estos cuatro (minúsculas). El quinto slot déjalo libre.

| Buzón | Uso |
|-------|-----|
| `hola@retirobtc.mx` | Contacto público (landing, X, Fedi) |
| `rito@retirobtc.mx` | Escalamiento del agente |
| `contacto@retirobtc.mx` | Campañas / respaldo |
| `facturacion@retirobtc.mx` | CFDI (Vertical 3) |

No crees `noreply@`: eso lo opera Resend. Contraseña distinta por buzón; no la subas al repo.

Namecheap **rechaza** espacio, `\`, `&`, `+` y `'`. El `&` de la clave de `rito@` se tuvo que quitar. Para el resto usa solo `A–Z a–z 0–9 # ! @ $ % ^ * ( ) _ = -`.

4. Webmail: [https://privateemail.com](https://privateemail.com). Login = dirección completa + la clave que pusiste.
5. Prueba: escribe a `hola@` **desde otro correo** (no desde Gmail de destino). Responde desde el webmail para verificar envío.
6. Opcional después: Gmail → Cuentas → “Enviar como” `hola@` con SMTP `mail.privateemail.com` (465/587). El trial a veces limita forwarding; el SMTP sí suele funcionar.

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

## 5. Fallback si cancelas Scale: Email Forwarding (sin pagar)

El dominio ya está en **Namecheap BasicDNS**, que es el requisito. Con Scale activo **no** uses este camino: Private Email y forwarding no conviven.

1. Domain List → **Manage** `retirobtc.mx` → pestaña **Advanced DNS**
2. **Mail Settings** → elegir **Email Forwarding** → Save (Namecheap escribe los MX y un SPF; no lo borres)
3. Pestaña **Domain** → sección **Redirect Email** → **Add Forwarder**
4. Alias `hola` → Forward to `calculadora.retirobtc@gmail.com` → check
5. Repetir para `rito`, `contacto`, `facturacion`
6. **Add catch all** → la misma bandeja Gmail
7. Esperar ~1 hora. Probar enviando **desde otro correo**, no desde el Gmail de destino: Namecheap descarta esa prueba a propósito

Si más adelante contratas Private Email, hay que **apagar** estos forwarders: los dos servicios no conviven.

---

## 6. Qué hacer el 16 sep 2026

El trial Scale ya está comprado. Opciones:

- **Bajar a Launch** (~$14.88/año) si quieres seguir enviando como `@retirobtc.mx` con un solo buzón (`hola@`).
- **Cancelar** y pasar a Email Forwarding (§5) si solo necesitas recibir.
- No dejes Scale con Auto-Renew ON: ~$71.88/año para 5 buzones que hoy no usas.

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
