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

En la captura del 16 ago 2026 la Mastercard •••• 3144 aparece como **DEFAULT FOR APPS**. Eso cubre el Marketplace (Relate y similares), **no** el auto-renew de `retirobtc.mx`.

Namecheap separa los defaults. Hay que marcar la misma tarjeta para renovaciones de dominio:

1. En esa misma fila, flecha junto a **EDIT** → **Edit Defaults**
2. Activa **Use for auto-renewal** (o el checkbox de servicios/dominios, no solo Apps)
3. Guarda. La etiqueta debería pasar a algo como default para auto-renew / all services, no solo “FOR APPS”

Si el default de dominios queda en Account Funds y el saldo sigue en $0, el cobro de mayo 2027 falla aunque Auto-Renew esté ON.

No recargues Funds “por si acaso”: Relate se canceló precisamente porque el cobro iba al monedero vacío. La tarjeta como default de **auto-renew** es el arreglo. La tarjeta vence en may 2030, después de la renovación de 2027: en esa fecha no hay problema de caducidad.

## Qué no reactivar

- RelateSocial (~$9.88/mes): sin API, duplica Gemini, no aplica la guía de marca. Ver [`roadmap-agentico-ingresos.md`](./roadmap-agentico-ingresos.md).
- Private Email trial: 30 días y luego cobra. El arranque de `@retirobtc.mx` es **Email Forwarding** a $0. Ver [`email-corporativo-namecheap.md`](./email-corporativo-namecheap.md).
