import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  AGENTS_BASE_URL,
  GUIDE_TOKEN_TTL_DAYS,
  PRIVACY_NOTICE_VERSION,
  RATE_LIMITS,
  isSupabaseConfigured,
} from '@/lib/config';
import { getSupabase } from '@/lib/db/supabase';
import { sendGuideEmail } from '@/lib/email/resend';
import { assertAllowedOrigin, handleOptions, jsonWithCors } from '@/lib/http/cors';
import { generateToken, getClientIp, hashIp } from '@/lib/privacy/hash';
import { checkRateLimit } from '@/lib/privacy/rate-limit';

const leadSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  bitcoinFamiliarity: z.union([z.string(), z.number()]).optional(),
  source: z.string().max(64).default('brujula-guia'),
  consent: z.literal(true),
  utm: z.record(z.string(), z.string()).optional(),
});

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req);
}

export async function POST(req: NextRequest) {
  try {
    assertAllowedOrigin(req);
  } catch {
    return jsonWithCors(req, { error: 'Origin not allowed' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWithCors(req, { error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return jsonWithCors(req, { error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, bitcoinFamiliarity, source, utm } = parsed.data;
  const emailNorm = email.toLowerCase().trim();
  const ip = getClientIp(req);
  const ipHash = hashIp(ip);

  const allowed = await checkRateLimit(
    `lead:email:${emailNorm}`,
    RATE_LIMITS.leadsPerDayPerEmail,
    24 * 60 * 60 * 1000
  );
  if (!allowed) {
    return jsonWithCors(req, { error: 'Demasiadas solicitudes para este correo. Intenta mañana.' }, { status: 429 });
  }

  const guideToken = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + GUIDE_TOKEN_TTL_DAYS);

  let leadId: string | null = null;

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    const familiarity =
      bitcoinFamiliarity === '' || bitcoinFamiliarity === undefined
        ? null
        : Number(bitcoinFamiliarity);

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        name: name.trim(),
        email: emailNorm,
        bitcoin_familiarity: Number.isFinite(familiarity) ? familiarity : null,
        source,
        utm: utm ?? null,
        guide_token: guideToken,
        guide_token_expires_at: expiresAt.toISOString(),
      })
      .select('id')
      .single();

    if (leadError) {
      console.error('[leads]', leadError);
      return jsonWithCors(req, { error: 'No se pudo registrar el lead' }, { status: 500 });
    }

    leadId = lead.id;

    await supabase.from('consent_records').insert({
      lead_id: leadId,
      email: emailNorm,
      privacy_notice_version: PRIVACY_NOTICE_VERSION,
      ip_hash: ipHash,
      user_agent: req.headers.get('user-agent')?.slice(0, 512) ?? null,
    });
  }

  const guideUrl = `${AGENTS_BASE_URL}/api/guide/download?token=${guideToken}`;
  const emailResult = await sendGuideEmail({ to: emailNorm, name: name.trim(), guideUrl });

  if (!emailResult.ok) {
    return jsonWithCors(req, { error: 'Lead registrado pero falló el envío de correo' }, { status: 502 });
  }

  return jsonWithCors(req, {
    ok: true,
    message: 'Guía enviada — revisa tu correo',
    emailSkipped: emailResult.skipped ?? false,
  });
}
