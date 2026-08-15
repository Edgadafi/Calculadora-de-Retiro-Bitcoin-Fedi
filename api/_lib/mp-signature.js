import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Validación de la firma de notificaciones de Mercado Pago.
 *
 * Es defensa contra notificaciones basura: la protección real contra ingresos
 * falsos es que el webhook vuelve a consultar el pago por id con nuestro propio
 * access token, así que un aviso forjado no puede inventar un cobro.
 *
 * Si `MERCADOPAGO_WEBHOOK_SECRET` no está configurado, la validación se omite
 * para no romper instalaciones existentes.
 */

/** @returns {{skipped: boolean, valid: boolean, reason?: string}} */
export function verifyMercadoPagoSignature(req, dataId) {
  const secret = (process.env.MERCADOPAGO_WEBHOOK_SECRET || '').trim();
  if (!secret) return { skipped: true, valid: true };

  const signature = req.headers['x-signature'];
  const requestId = req.headers['x-request-id'];
  if (typeof signature !== 'string' || !signature) {
    return { skipped: false, valid: false, reason: 'missing_signature' };
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

  if (!ts || !v1) return { skipped: false, valid: false, reason: 'malformed_signature' };

  // Mercado Pago normaliza el id a minúsculas en el manifiesto.
  const id = String(dataId || '').toLowerCase();
  const manifest = `id:${id};request-id:${requestId || ''};ts:${ts};`;
  const expected = createHmac('sha256', secret).update(manifest).digest('hex');

  const a = Buffer.from(v1, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return { skipped: false, valid: false, reason: 'signature_mismatch' };

  return {
    skipped: false,
    valid: timingSafeEqual(a, b),
    reason: 'signature_mismatch',
  };
}
