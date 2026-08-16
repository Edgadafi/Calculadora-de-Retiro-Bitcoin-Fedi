import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Validación de la firma de notificaciones de Mercado Pago.
 *
 * Cumple dos funciones. La primera es autenticar el aviso: sin ella el endpoint
 * queda abierto y cada petición cuesta una consulta a la API de Mercado Pago, así
 * que en producción se falla cerrado si falta el secreto. La segunda es defensa en
 * profundidad frente a avisos forjados, aunque de eso ya se encarga el webhook al
 * reconsultar el pago por id con nuestro propio access token.
 *
 * Fuera de producción se omite para no estorbar en local y en preview.
 */

/** Vercel define VERCEL_ENV en cada despliegue; preview no se trata como producción. */
function isProduction() {
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === 'production';
  return process.env.NODE_ENV === 'production';
}

/**
 * @returns {{valid: boolean, configured: boolean, skipped: boolean, reason?: string}}
 *   `configured: false` distingue nuestra falta de configuración de una firma
 *   inválida, para poder responder con códigos distintos.
 */
export function verifyMercadoPagoSignature(req, dataId) {
  const secret = (process.env.MERCADOPAGO_WEBHOOK_SECRET || '').trim();

  if (!secret) {
    if (isProduction()) {
      return { valid: false, configured: false, skipped: false, reason: 'secret_not_configured' };
    }
    return { valid: true, configured: false, skipped: true };
  }

  const signature = req.headers['x-signature'];
  const requestId = req.headers['x-request-id'];
  if (typeof signature !== 'string' || !signature) {
    return { valid: false, configured: true, skipped: false, reason: 'missing_signature' };
  }

  let ts = '';
  let v1 = '';
  for (const part of signature.split(',')) {
    const [rawKey, rawValue] = part.split('=');
    const key = rawKey?.trim();
    const value = rawValue?.trim();
    if (key === 'ts') ts = value || '';
    if (key === 'v1') v1 = value || '';
  }

  if (!ts || !v1 || !/^\d+$/.test(ts)) {
    return { valid: false, configured: true, skipped: false, reason: 'malformed_signature' };
  }

  /**
   * Manifiesto según la plantilla de Mercado Pago. El id va en minúsculas, y los
   * segmentos cuyo valor no llega se omiten por completo en lugar de quedar
   * vacíos: dejarlos vacíos rechazaría firmas legítimas cuando no viene
   * `x-request-id`, y perderíamos el registro de un cobro real.
   *
   * No se acota la antigüedad del `ts`: Mercado Pago reintenta una notificación
   * durante horas y no está garantizado que refresque la firma en cada intento,
   * así que una ventana estricta descartaría reintentos legítimos. El reenvío de
   * un aviso capturado sólo produce un upsert idempotente.
   */
  const segments = [`id:${String(dataId || '').toLowerCase()};`];
  if (typeof requestId === 'string' && requestId) segments.push(`request-id:${requestId};`);
  segments.push(`ts:${ts};`);

  const expected = createHmac('sha256', secret).update(segments.join('')).digest('hex');

  const a = Buffer.from(v1, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) {
    return { valid: false, configured: true, skipped: false, reason: 'signature_mismatch' };
  }

  return {
    valid: timingSafeEqual(a, b),
    configured: true,
    skipped: false,
    reason: 'signature_mismatch',
  };
}
