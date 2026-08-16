# Namecheap — dominio y cobro automático

> Estado operativo al 16 ago 2026. Complementa [`email-corporativo-namecheap.md`](./email-corporativo-namecheap.md).

## Dominio `retirobtc.mx`

| Campo | Valor |
|-------|--------|
| Estado | ACTIVE |
| Vigencia | 17 may 2026 → **17 may 2027** |
| Auto-Renew | ON |
| Método de Auto Renewal (dominio) | **Default** |
| Payment methods | Mastercard •••• 3144, vence may 2030, ACTIVE |
| Default de esa tarjeta | **DEFAULT** en Payment Cards (estrella). **Use for auto-renewal = ON** (checkbox marcado y bloqueado: es la única tarjeta). En Apps sigue pudiendo decir “DEFAULT FOR APPS”; no contradice esto. |
| Account Funds | **$0.00**, ACTIVE |
| Privacidad WHOIS | ON, también con Auto-Renew |
| Nameservers | Namecheap BasicDNS |

RelateSocial (cancelado por fondos en cero) era otro producto. El dominio no se tocó.

## Qué significa Auto Renewal = Default

Namecheap no cobra “Default” como si fuera un medio. Significa: usa el medio por defecto de la cuenta, en este orden ([docs Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/10564/2207/can-i-set-up-automatic-billing-for-my-namecheap-services/)):

1. Account Funds
2. Si no alcanza, la **tarjeta marcada como default** (estrella)
3. Si falla, las tarjetas de respaldo en el orden que definiste

Con Funds en $0 el paso 1 no cobra nada y pasa a la tarjeta. Por eso **no hace falta recargar el monedero** para que el dominio se renueve en mayo 2027.

PayPal no sirve para auto-renew de dominios, solo tarjeta o Funds.

## Default de la 3144 (confirmado 16 ago 2026)

En [Payment Cards](https://ap.www.namecheap.com/profile/billing/PaymentCards) la Mastercard es la única, con estrella **DEFAULT**. En **Edit Card Defaults**:

- Dropdown **MC-3144** gris (“Cannot edit default card”)
- **Use for auto-renewal** marcado y gris

Eso no es un error: con una sola tarjeta Namecheap no deja quitar el default ni desmarcar auto-renew. El dominio `retirobtc.mx` (Auto-Renew ON, método Default) **sí puede** cobrar la 3144 en mayo 2027 si Funds siguen en $0.

No pulses Save (no hay nada editable). Cancel. No agregues una segunda tarjeta “para desbloquear”. No recargues Funds.

La tarjeta vence en may 2030, después de esa renovación.

El Auto-Renew de **Scale Email** es otro switch (Private Email → OFF). No lo mezcles con este.

## Pedido de email (15 ago 2026) — compra terminada

Order **211252243**: Scale Email 1 mes, 5 buzones, **$0.00** a Funds. Recibo `namecheap-order-211252243.pdf`. Decisión: usar el trial (Private Email), no forwarding. **Auto-Renew del email OFF** o ~14 sep cobra ~$71.88/año. El Auto-Renew del **dominio** es otro switch. Detalle en [`email-corporativo-namecheap.md`](./email-corporativo-namecheap.md).

## Qué no reactivar

- RelateSocial (~$9.88/mes): sin API, duplica Gemini, no aplica la guía de marca. Ver [`roadmap-agentico-ingresos.md`](./roadmap-agentico-ingresos.md).
- Shared Hosting “FREE 30 days” (banner del checkout de email): mismo patrón que Relate.
- Private Email Scale: trial activo (pedido 211252243). Auto-Renew del **email** OFF; el 14 sep decide Launch o cancelar. Ver [`email-corporativo-namecheap.md`](./email-corporativo-namecheap.md).
