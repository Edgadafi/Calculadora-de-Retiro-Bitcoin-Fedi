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
| Default de esa tarjeta | **DEFAULT FOR APPS** (Marketplace). Falta confirmarla para auto-renew de dominios. |
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

## Chequeo que sí falta

La Mastercard •••• 3144 como **DEFAULT FOR APPS** cubre el Marketplace, no el dominio. **EDIT** de esa fila no muestra auto-renew: Namecheap lo esconde en otro menú ([docs](https://www.namecheap.com/support/knowledgebase/article.aspx/10564/2207/can-i-set-up-automatic-billing-for-my-namecheap-services/)).

1. Sal de “Manage Payment Methods” (página de Apps). Ve a **Profile → Billing → Payment Cards → Manage**:  
   [ap.www.namecheap.com/profile/billing/PaymentCards](https://ap.www.namecheap.com/profile/billing/PaymentCards)
2. En la 3144, **no pulses EDIT**. Pulsa la **flecha ▾ a la derecha de EDIT** → **Edit Defaults**
3. Marca **Use for auto-renewal** → Save Changes

`EDIT` solo cambia nombre, apodo y “default for Apps”. Por eso no sale el checkbox.

Si esa flecha no existe o Edit Defaults no aparece: Domain List → Manage `retirobtc.mx` → en Auto Renewal, cambia el método de **Default** a la Mastercard 3144 (si el dropdown lo lista). No recargues Funds.

La tarjeta vence en may 2030, después de la renovación de 2027.

## Pedido de email (15 ago 2026) — compra terminada

Order **211252243**: Scale Email 1 mes, 5 buzones, **$0.00** a Funds. Recibo `namecheap-order-211252243.pdf`. Decisión: usar el trial (Private Email), no forwarding. **Auto-Renew del email OFF** o ~14 sep cobra ~$71.88/año. El Auto-Renew del **dominio** es otro switch. Detalle en [`email-corporativo-namecheap.md`](./email-corporativo-namecheap.md).

## Qué no reactivar

- RelateSocial (~$9.88/mes): sin API, duplica Gemini, no aplica la guía de marca. Ver [`roadmap-agentico-ingresos.md`](./roadmap-agentico-ingresos.md).
- Shared Hosting “FREE 30 days” (banner del checkout de email): mismo patrón que Relate.
- Private Email Scale: trial activo (pedido 211252243). Auto-Renew del **email** OFF; el 14 sep decide Launch o cancelar. Ver [`email-corporativo-namecheap.md`](./email-corporativo-namecheap.md).
