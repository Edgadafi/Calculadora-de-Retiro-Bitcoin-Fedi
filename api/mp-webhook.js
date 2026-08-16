/**
 * Webhook / IPN de Mercado Pago (notification_url en la preferencia).
 *
 * Consulta el pago por id con nuestro propio access token y registra la compra
 * en el servicio de agentes (fase P0: medición de ingresos). Esa segunda consulta
 * es lo que impide que un aviso forjado invente un cobro.
 *
 * La activación de Premium en el cliente sigue dependiendo del retorno a la app
 * con `payment_id` (verify-mp-payment) o de «Verificar pago» en el modal: este
 * webhook mide, no otorga acceso.
 *
 * Semántica de respuesta: 200 para lo que no hay que reintentar (avisos ajenos,
 * datos incompletos) y 5xx sólo cuando un pago real no se pudo registrar, para
 * que Mercado Pago reintente.
 */
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { recordPurchase, sanitizeUtm } from './_lib/purchases.js';
import { parseExternalReference } from './_lib/plan.js';
import { verifyMercadoPagoSignature } from './_lib/mp-signature.js';

function getAccessToken() {
  return (
    process.env.MERCADOPAGO_ACCESS_TOKEN
    || process.env.MERCADOPAGO_ACCESS_TOKEN_TEST
    || ''
  );
}

/**
 * Límite por IP, holgado a propósito. Mercado Pago notifica desde un rango
 * acotado de direcciones, así que un límite estrecho descartaría avisos legítimos
 * en una ráfaga; con el volumen de ventas de este producto, 60 por minuto sobra.
 * Como en los demás endpoints de pago, el contador vive en la instancia
 * serverless: acota abuso, no es una cuota exacta.
 */
const rateLimit = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 60;

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

/** Extrae el id del pago de las variantes de formato que envía Mercado Pago. */
function extractPaymentId(req) {
  const query = req.query || {};
  const body = (req.body && typeof req.body === 'object') ? req.body : {};

  const candidates = [
    body?.data?.id,
    query['data.id'],
    query.id,
    body?.id,
    body?.resource,
  ];

  for (const candidate of candidates) {
    if (candidate == null) continue;
    // `resource` puede llegar como URL completa del recurso.
    const value = String(candidate).trim().split('/').filter(Boolean).pop() || '';
    if (/^\d+$/.test(value)) return value;
  }
  return '';
}

function isPaymentNotification(req) {
  const query = req.query || {};
  const body = (req.body && typeof req.body === 'object') ? req.body : {};
  const kind = String(body.type || body.topic || query.type || query.topic || '').toLowerCase();
  // Sin tipo declarado se intenta igual: algunas pruebas manuales no lo envían.
  return kind === '' || kind === 'payment';
}

const STATUS_MAP = {
  approved: 'approved',
  authorized: 'pending',
  pending: 'pending',
  in_process: 'pending',
  in_mediation: 'pending',
  rejected: 'rejected',
  cancelled: 'rejected',
  refunded: 'refunded',
  charged_back: 'refunded',
};

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.socket?.remoteAddress
    || 'unknown';
  if (isRateLimited(ip)) {
    // 429 sin cuerpo: Mercado Pago reintentará, y el abuso no llega a la API de MP.
    return res.status(429).send('Too Many Requests');
  }

  const paymentId = extractPaymentId(req);

  try {
    console.info('[mp-webhook]', {
      method: req.method,
      paymentId: paymentId || null,
      type: req.body?.type || req.body?.topic || req.query?.type || req.query?.topic || null,
    });
  } catch (_) { /* el log nunca debe tumbar el webhook */ }

  if (!isPaymentNotification(req) || !paymentId) {
    // Aviso de otro recurso (merchant_order, plan, etc.) o sin id utilizable.
    return res.status(200).send('OK');
  }

  /**
   * La validación va antes de consultar a Mercado Pago: así una petición sin firma
   * válida nunca cuesta una llamada a su API ni una escritura. Sin secreto
   * configurado en cualquier despliegue se falla cerrado, porque el endpoint
   * quedaría abierto; en local se omite.
   */
  const signature = verifyMercadoPagoSignature(req, paymentId);
  if (!signature.valid) {
    if (!signature.configured) {
      console.error(
        '[mp-webhook] falta MERCADOPAGO_WEBHOOK_SECRET: no se registran cobros. '
        + 'Configúralo en Mercado Pago → Webhooks y en las variables del proyecto.'
      );
      // 503 y no 401: es configuración nuestra, y así Mercado Pago reintenta
      // y los avisos pueden registrarse en cuanto se defina el secreto.
      return res.status(503).send('Webhook secret not configured');
    }
    console.warn('[mp-webhook] firma inválida', signature.reason);
    return res.status(401).send('Invalid signature');
  }

  const accessToken = getAccessToken();
  if (!accessToken) {
    console.error('[mp-webhook] falta MERCADOPAGO_ACCESS_TOKEN');
    // Error de configuración nuestro: conviene el reintento de Mercado Pago.
    return res.status(500).send('Missing access token');
  }

  let payment;
  try {
    const client = new MercadoPagoConfig({ accessToken });
    payment = await new Payment(client).get({ id: paymentId });
  } catch (err) {
    console.error('[mp-webhook] no se pudo consultar el pago', err?.message || err);
    return res.status(502).send('Could not fetch payment');
  }

  const status = STATUS_MAP[payment?.status] || null;
  const { plan, correlationId } = parseExternalReference(payment?.external_reference);
  const currency = String(payment?.currency_id || '').toUpperCase();
  const amount = Number(payment?.transaction_amount);

  // Sin plan, moneda soportada o importe válido no hay fila que escribir, y
  // reintentar no lo va a arreglar: se responde 200 para cortar el ciclo.
  if (!status || !plan || currency !== 'MXN' || !Number.isFinite(amount)) {
    console.warn('[mp-webhook] pago no registrable', {
      paymentId,
      status: payment?.status,
      plan,
      currency,
    });
    return res.status(200).send('OK');
  }

  const metadata = (payment?.metadata && typeof payment.metadata === 'object') ? payment.metadata : {};

  const result = await recordPurchase({
    provider: 'mercadopago',
    externalId: String(payment.id),
    plan,
    amount,
    currency: 'MXN',
    status,
    correlationId: correlationId || undefined,
    payerEmail: payment?.payer?.email || undefined,
    utm: sanitizeUtm(metadata),
    paidAt: payment?.date_approved || payment?.date_created || undefined,
  });

  if (!result.ok && !result.skipped) {
    // Pago real que no se pudo registrar: que Mercado Pago reintente.
    return res.status(503).send('Could not record purchase');
  }

  return res.status(200).send('OK');
}
