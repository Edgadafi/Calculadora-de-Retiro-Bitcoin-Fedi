import { MercadoPagoConfig, Payment } from 'mercadopago';
import { recordPurchase, sanitizeUtm } from './_lib/purchases.js';
import { parseExternalReference } from './_lib/plan.js';

function getAccessToken() {
  return (
    process.env.MERCADOPAGO_ACCESS_TOKEN
    || process.env.MERCADOPAGO_ACCESS_TOKEN_TEST
    || ''
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    return res.status(500).json({ error: 'Missing MERCADOPAGO_ACCESS_TOKEN' });
  }

  const { payment_id: paymentId } = req.body || {};
  const id = paymentId != null ? String(paymentId).trim() : '';
  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid payment_id' });
  }

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);
    const data = await payment.get({ id });

    const status = data.status;

    if (status !== 'approved') {
      return res.status(400).json({
        error: 'Payment not approved',
        status,
      });
    }

    // Acepta el formato nuevo `<plan>:<correlationId>` y el antiguo `<plan>`.
    const { plan, correlationId } = parseExternalReference(data.external_reference);

    if (!plan) {
      return res.status(400).json({ error: 'Invalid external_reference' });
    }

    // Registro redundante con el webhook: el upsert es idempotente y así la
    // compra queda medida aunque la notificación no haya llegado.
    const amount = Number(data.transaction_amount);
    if (String(data.currency_id || '').toUpperCase() === 'MXN' && Number.isFinite(amount)) {
      const metadata = (data.metadata && typeof data.metadata === 'object') ? data.metadata : {};
      await recordPurchase({
        provider: 'mercadopago',
        externalId: String(data.id),
        plan,
        amount,
        currency: 'MXN',
        status: 'approved',
        correlationId: correlationId || undefined,
        payerEmail: data?.payer?.email || undefined,
        utm: sanitizeUtm(metadata),
        paidAt: data.date_approved || data.date_created || undefined,
      });
    }

    return res.status(200).json({
      plan,
      payment_id: data.id,
      status: data.status,
    });
  } catch (err) {
    console.error('verify-mp-payment:', err);
    return res.status(502).json({
      error: 'Could not verify payment',
      message: err.message || String(err),
    });
  }
}
