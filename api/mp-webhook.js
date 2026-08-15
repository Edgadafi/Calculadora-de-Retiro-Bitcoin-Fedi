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

  const signature = verifyMercadoPagoSignature(req, paymentId);
  if (!signature.valid) {
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
