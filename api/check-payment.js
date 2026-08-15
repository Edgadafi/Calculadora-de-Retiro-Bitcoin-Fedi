import { recordPurchase, sanitizeCorrelationId } from './_lib/purchases.js';
import { parsePlanFromMemo } from './_lib/plan-memo.js';

const LNBITS_URL = process.env.LNBITS_URL || 'https://legend.lnbits.com';
const LNBITS_API_KEY = process.env.LNBITS_API_KEY || '';

/**
 * LNbits devuelve el detalle del pago anidado en `details` según la versión.
 * El importe llega en milisatoshis y puede venir negativo en pagos salientes.
 */
function extractPaymentDetails(data) {
  const details = (data && typeof data.details === 'object' && data.details) || data || {};
  const amountMsat = Number(details.amount);
  const sats = Number.isFinite(amountMsat) ? Math.round(Math.abs(amountMsat) / 1000) : null;
  const extra = (details.extra && typeof details.extra === 'object') ? details.extra : {};

  return {
    memo: typeof details.memo === 'string' ? details.memo : '',
    sats,
    extra,
    paidAt: Number.isFinite(Number(details.time))
      ? new Date(Number(details.time) * 1000).toISOString()
      : undefined,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { hash } = req.query;

  if (!hash || typeof hash !== 'string' || hash.length < 16) {
    return res.status(400).json({ error: 'Invalid payment hash' });
  }

  try {
    const resp = await fetch(`${LNBITS_URL}/api/v1/payments/${hash}`, {
      headers: { 'X-Api-Key': LNBITS_API_KEY },
    });

    if (!resp.ok) {
      return res.status(502).json({ error: 'Payment check failed' });
    }

    const data = await resp.json();
    const paid = !!data.paid;

    /**
     * Registro de ingresos (fase P0). El cliente sondea este endpoint cada 3 s,
     * y el upsert por (provider, external_id) hace que repetirlo no duplique la
     * fila. Un fallo al registrar no debe bloquear la activación de Premium.
     */
    if (paid) {
      const { memo, sats, extra, paidAt } = extractPaymentDetails(data);
      const plan = parsePlanFromMemo(memo) || (extra.plan === 'monthly' || extra.plan === 'lifetime' ? extra.plan : null);

      if (plan && sats && sats > 0) {
        await recordPurchase({
          provider: 'lightning',
          externalId: hash,
          plan,
          amount: sats,
          currency: 'SAT',
          status: 'approved',
          correlationId: sanitizeCorrelationId(extra.correlation_id),
          paidAt,
        });
      } else {
        console.warn('[check-payment] pago sin plan o importe utilizable', { hash, plan, sats });
      }
    }

    return res.status(200).json({ paid });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
