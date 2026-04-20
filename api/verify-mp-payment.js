import { MercadoPagoConfig, Payment } from 'mercadopago';

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
    const externalReference = data.external_reference;

    if (status !== 'approved') {
      return res.status(400).json({
        error: 'Payment not approved',
        status,
      });
    }

    if (externalReference !== 'monthly' && externalReference !== 'lifetime') {
      return res.status(400).json({ error: 'Invalid external_reference' });
    }

    return res.status(200).json({
      plan: externalReference,
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
