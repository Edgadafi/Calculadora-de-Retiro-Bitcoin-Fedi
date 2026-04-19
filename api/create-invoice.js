const LNBITS_URL = process.env.LNBITS_URL || 'https://legend.lnbits.com';
const LNBITS_API_KEY = process.env.LNBITS_API_KEY || '';

const rateLimit = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    rateLimit.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > RATE_MAX;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Try again in 1 minute.' });
  }

  try {
    const { amount, memo } = req.body;

    if (!amount || typeof amount !== 'number' || amount < 1 || amount > 1_000_000) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const resp = await fetch(`${LNBITS_URL}/api/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': LNBITS_API_KEY,
      },
      body: JSON.stringify({ out: false, amount, memo: memo || 'Calculadora Retiro BTC Premium' }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(502).json({ error: 'Invoice creation failed', detail: text });
    }

    const data = await resp.json();
    return res.status(200).json({
      payment_hash: data.payment_hash,
      payment_request: data.payment_request,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
