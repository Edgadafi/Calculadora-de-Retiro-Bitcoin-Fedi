const LNBITS_URL = process.env.LNBITS_URL || 'https://legend.lnbits.com';
const LNBITS_API_KEY = process.env.LNBITS_API_KEY || '';

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
    return res.status(200).json({ paid: !!data.paid });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
