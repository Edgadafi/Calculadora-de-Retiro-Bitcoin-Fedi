export const PRIVACY_NOTICE_VERSION = '2026-05';

export const AGENTS_BASE_URL =
  process.env.AGENTS_BASE_URL?.replace(/\/$/, '') ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ||
  'https://retirobtc.mx,https://www.retirobtc.mx,http://localhost:3000,http://127.0.0.1:3000,http://127.0.0.1:5500'
)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

export const RATE_LIMITS = {
  chatPerHour: Number(process.env.RATE_LIMIT_CHAT_PER_HOUR || 20),
  leadsPerDayPerEmail: Number(process.env.RATE_LIMIT_LEADS_PER_DAY || 3),
} as const;

export const GUIDE_TOKEN_TTL_DAYS = 7;

export const LEGAL_KEYWORDS = [
  'AFORE',
  'CNBV',
  'fintech',
  'pensiones',
  'retiro',
  'IMSS',
  'ISSSTE',
  'SAR',
  'INFONAVIT',
  'Bitcoin',
  'activos virtuales',
];

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Esquema Postgres donde viven las tablas del servicio.
 *
 * Por defecto `public`, como en un proyecto Supabase dedicado. Si el proyecto se
 * comparte con otra app (el plan gratuito permite 2 proyectos activos por cuenta),
 * apuntar aquí a un esquema propio aísla las tablas sin pagar un proyecto extra.
 * El esquema debe estar en Settings → API → Exposed schemas.
 */
export const SUPABASE_SCHEMA = (process.env.SUPABASE_DB_SCHEMA || 'public').trim() || 'public';

/** Modelo Gemini para Rito y resúmenes legales (override opcional). */
export const RITO_CHAT_MODEL = process.env.RITO_CHAT_MODEL || 'gemini-2.5-flash';

/** Ignora placeholders vacíos (`""`) que Vercel puede devolver como valor. */
function isValidApiKey(value: string | undefined): boolean {
  if (!value) return false;
  const trimmed = value.trim().replace(/^["']|["']$/g, '');
  return trimmed.length >= 8;
}

export function isGeminiConfigured(): boolean {
  return isValidApiKey(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
}

export function isOpenAIConfigured(): boolean {
  return isValidApiKey(process.env.OPENAI_API_KEY);
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Secreto compartido con el proyecto raíz para la ingesta de compras.
 * Exige 24 caracteres o más: este endpoint escribe datos de ingresos.
 */
export function isInternalApiConfigured(): boolean {
  const value = process.env.INTERNAL_API_SECRET?.trim();
  return Boolean(value && value.length >= 24);
}

/** Precios de referencia para estimar MRR cuando el importe no viene del proveedor. */
export const PREMIUM_PRICES_MXN = {
  monthly: Number(process.env.MERCADOPAGO_PRICE_MONTHLY_MXN || 20),
  lifetime: Number(process.env.MERCADOPAGO_PRICE_LIFETIME_MXN || 200),
} as const;
