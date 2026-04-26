/**
 * Webhook / IPN de Mercado Pago (notification_url en la preferencia).
 *
 * Hoy: responde 200 y deja trazas; la activación de premium en el cliente sigue
 * dependiendo del retorno a la app con `payment_id` (verify-mp-payment) o de
 * “Verificar pago” con un payment_id en el modal.
 *
 * Próxima evolución (si el producto lo requiere):
 * - Validar origen y firma según la documentación de notificaciones de MP.
 * - Obtener el pago por id, reutilizar la misma lógica que verify-mp-payment.
 * - Persistir estado en Vercel KV, Supabase u otra capa, y vincular a identidad
 *   o enviar al usuario un enlace de “recuperar acceso” (implica diseño
 *   antifraude y almacenamiento, no activar premium solo por notificación
 *   sin correlación con el usuario final).
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
