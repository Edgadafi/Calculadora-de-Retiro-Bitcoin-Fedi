import { createHash } from 'crypto';

export function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || 'retirobtc-privacy';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}

export function getClientIp(req: Request): string | null {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? null;
  return req.headers.get('x-real-ip');
}

export function redactEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '[redacted]';
  const visible = local.slice(0, 2);
  return `${visible}***@${domain}`;
}

export function redactPii(text: string): string {
  return text
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email]')
    .replace(/\b\d{10,}\b/g, '[number]');
}

export function generateToken(): string {
  return createHash('sha256')
    .update(`${Date.now()}-${Math.random()}-${process.env.GUIDE_TOKEN_SECRET || 'guide'}`)
    .digest('hex');
}
