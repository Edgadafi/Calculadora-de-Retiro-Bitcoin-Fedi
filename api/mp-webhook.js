/**
 * Webhook/IPN de Mercado Pago (notificaciones de pago).
 * Configura la misma URL en el panel de tu aplicación MP si hace falta.
 * Por ahora solo registra el evento; la activación de premium se hace
 * vía verify-mp-payment al volver del checkout (back_urls).
 */
export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const query = req.query || {};
    const body = req.body || {};
    console.info('[mp-webhook]', { method: req.method, query, bodyType: typeof body });
  } catch (e) {
    console.error('[mp-webhook]', e);
  }

  return res.status(200).send('OK');
}
