/**
 * Registro de compras Premium en el servicio de agentes (fase P0).
 *
 * El proyecto raíz no habla directo con Supabase a propósito: la llave de
 * servicio vive sólo en el proyecto `agents/`. Aquí sólo se reenvía el hecho ya
 * confirmado contra el proveedor de pago, autenticado con un secreto compartido.
 */

const REQUEST_TIMEOUT_MS = 8000;

/**
 * URL real del servicio en producción. `agents.retirobtc.mx` no tiene DNS;
 * el front ya apunta a este host en `agents-config.js`.
 */
export const DEFAULT_AGENTS_BASE_URL = 'https://retirobtc-agents.vercel.app';

function getAgentsBaseUrl() {
  const raw = process.env.AGENTS_BASE_URL || process.env.AGENTS_INTERNAL_URL || '';
  const trimmed = raw.trim().replace(/\/$/, '');
  if (trimmed) return trimmed;
  // En cualquier deploy de Vercel (prod y preview) usamos el host vivo.
  // En local no adivinamos: sin variable el registro se omite a propósito.
  if (process.env.VERCEL_ENV) return DEFAULT_AGENTS_BASE_URL;
  return '';
}

function getInternalSecret() {
  return (process.env.INTERNAL_API_SECRET || '').trim();
}

/**
 * Estado de la tubería de ingesta, sin filtrar secretos.
 * Lo usa GET /api/p0-status para verificar la activación en prod.
 */
export function getP0IngestStatus() {
  const agentsUrl = getAgentsBaseUrl();
  const secret = getInternalSecret();
  const webhookSecret = (process.env.MERCADOPAGO_WEBHOOK_SECRET || '').trim();
  const mpToken = Boolean(
    (process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN_TEST || '').trim()
  );

  return {
    agentsUrlConfigured: Boolean(agentsUrl),
    internalSecretConfigured: secret.length >= 24,
    webhookSecretConfigured: Boolean(webhookSecret),
    mercadoPagoTokenConfigured: mpToken,
    ready: Boolean(agentsUrl) && secret.length >= 24 && Boolean(webhookSecret) && mpToken,
  };
}

/** Sólo se propagan claves UTM conocidas, con longitud acotada. */
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

export function sanitizeUtm(raw) {
  if (!raw || typeof raw !== 'object') return undefined;
  const out = {};
  for (const key of UTM_KEYS) {
    const value = raw[key];
    if (typeof value === 'string' && value.trim()) {
      out[key] = value.trim().slice(0, 200);
    }
  }
  return Object.keys(out).length ? out : undefined;
}

/** Identificador de correlación generado en el cliente: sólo para atribución. */
export function sanitizeCorrelationId(raw) {
  if (typeof raw !== 'string') return undefined;
  const value = raw.trim();
  return /^[A-Za-z0-9_-]{8,64}$/.test(value) ? value : undefined;
}

/**
 * Reenvía la compra al servicio de agentes.
 *
 * Nunca lanza: devuelve el resultado para que quien llama decida si conviene
 * fallar (y provocar reintento del proveedor) o simplemente registrar el aviso.
 *
 * @returns {Promise<{ok: boolean, skipped?: boolean, reason?: string, status?: number}>}
 */
export async function recordPurchase(purchase) {
  const baseUrl = getAgentsBaseUrl();
  const secret = getInternalSecret();

  if (!baseUrl || !secret) {
    return { ok: false, skipped: true, reason: 'agents_not_configured' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const resp = await fetch(`${baseUrl}/api/purchases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Secret': secret,
      },
      body: JSON.stringify(purchase),
      signal: controller.signal,
    });

    if (!resp.ok) {
      const detail = await resp.text().catch(() => '');
      console.error('[purchases] ingest failed', resp.status, detail.slice(0, 300));
      return { ok: false, reason: 'ingest_failed', status: resp.status };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[purchases] ingest error', message);
    return { ok: false, reason: 'network_error' };
  } finally {
    clearTimeout(timer);
  }
}
