import { MercadoPagoConfig, Preference } from 'mercadopago';

const rateLimit = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 10;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    rateLimit.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
}

function getBaseUrl(req) {
  const env = process.env.APP_BASE_URL;
  if (env) return env.replace(/\/$/, '');
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  if (host) return `${proto}://${host}`;
  return '';
}

function getAccessToken() {
  return (
    process.env.MERCADOPAGO_ACCESS_TOKEN
    || process.env.MERCADOPAGO_ACCESS_TOKEN_TEST
    || ''
  );
}

function planItem(plan) {
  if (plan === 'monthly') {
    return {
      id: 'premium-monthly',
      title: 'Premium mensual — Calculadora de Retiro Bitcoin',
      unit_price: Number(process.env.MERCADOPAGO_PRICE_MONTHLY_MXN) || 20,
    };
  }
  return {
    id: 'premium-lifetime',
    title: 'Premium de por vida — Calculadora de Retiro Bitcoin',
    unit_price: Number(process.env.MERCADOPAGO_PRICE_LIFETIME_MXN) || 200,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.socket?.remoteAddress
    || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Try again in 1 minute.' });
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    return res.status(500).json({
      error: 'Missing MERCADOPAGO_ACCESS_TOKEN (or MERCADOPAGO_ACCESS_TOKEN_TEST)',
    });
  }

  const { plan } = req.body || {};
  if (plan !== 'monthly' && plan !== 'lifetime') {
    return res.status(400).json({ error: 'Invalid plan. Use monthly or lifetime.' });
  }

  const baseUrl = getBaseUrl(req);
  if (!baseUrl) {
    return res.status(500).json({
      error: 'Set APP_BASE_URL in Vercel or open the app via a public URL so back_urls can be built.',
    });
  }

  const item = planItem(plan);
  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);

  const body = {
    items: [
      {
        id: item.id,
        title: item.title,
        quantity: 1,
        currency_id: 'MXN',
        unit_price: item.unit_price,
      },
    ],
    external_reference: plan,
    back_urls: {
      success: `${baseUrl}/`,
      failure: `${baseUrl}/`,
      pending: `${baseUrl}/`,
    },
    auto_return: 'approved',
    notification_url: `${baseUrl}/api/mp-webhook`,
  };

  try {
    const result = await preference.create({ body });
    const id = result.id;
    const initPoint = result.init_point;
    const sandboxInitPoint = result.sandbox_init_point;

    if (!id || (!initPoint && !sandboxInitPoint)) {
      return res.status(502).json({
        error: 'Invalid preference response',
        detail: result,
      });
    }

    return res.status(200).json({
      id,
      init_point: initPoint,
      sandbox_init_point: sandboxInitPoint,
    });
  } catch (err) {
    console.error('MercadoPago preference.create:', err);
    return res.status(502).json({
      error: 'Could not create preference',
      message: err.message || String(err),
    });
  }
}
