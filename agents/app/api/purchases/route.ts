import { NextRequest } from 'next/server';
import { z } from 'zod';
import { isInternalApiConfigured, isSupabaseConfigured } from '@/lib/config';
import { getSupabase } from '@/lib/db/supabase';
import { matchesSecret } from '@/lib/http/shared-secret';

/**
 * Ingesta interna de compras Premium (fase P0).
 *
 * Sólo la llama el proyecto raíz (`api/mp-webhook.js`, `api/check-payment.js`)
 * tras confirmar el pago contra el proveedor. No es un endpoint público: el
 * importe y el plan que recibe ya vienen validados contra Mercado Pago o LNbits,
 * y el secreto compartido evita que un tercero inyecte ingresos falsos.
 */

const utmSchema = z.record(z.string().max(40), z.string().max(200));

const purchaseSchema = z.object({
  provider: z.enum(['mercadopago', 'lightning']),
  externalId: z.string().min(1).max(128),
  plan: z.enum(['monthly', 'lifetime']),
  amount: z.number().nonnegative().finite(),
  currency: z.enum(['MXN', 'SAT']),
  status: z.enum(['approved', 'pending', 'rejected', 'refunded']),
  correlationId: z.string().max(64).optional(),
  /** Sólo se usa para resolver el lead; nunca se almacena en `purchases`. */
  payerEmail: z.string().email().max(254).optional(),
  utm: utmSchema.optional(),
  paidAt: z.string().datetime().optional(),
});

function assertInternal(req: NextRequest): boolean {
  if (!isInternalApiConfigured()) return false;
  return matchesSecret(req.headers.get('x-internal-secret'), process.env.INTERNAL_API_SECRET);
}

export async function POST(req: NextRequest) {
  if (!assertInternal(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return Response.json({ ok: false, skipped: true, reason: 'supabase_not_configured' });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = purchaseSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    provider,
    externalId,
    plan,
    amount,
    currency,
    status,
    correlationId,
    payerEmail,
    utm,
    paidAt,
  } = parsed.data;

  const supabase = getSupabase();

  // Atribución: se busca el lead por correo pero sólo se guarda su id, para no
  // duplicar PII en la tabla de ingresos.
  let leadId: string | null = null;
  if (payerEmail) {
    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', payerEmail.toLowerCase().trim())
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    leadId = lead?.id ?? null;
  }

  const row = {
    provider,
    external_id: externalId,
    plan,
    amount,
    currency,
    status,
    correlation_id: correlationId ?? null,
    lead_id: leadId,
    utm: utm ?? null,
    paid_at: paidAt ?? (status === 'approved' ? new Date().toISOString() : null),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('purchases')
    .upsert(row, { onConflict: 'provider,external_id' })
    .select('id')
    .single();

  if (error) {
    console.error('[purchases]', error.message);
    return Response.json({ error: 'No se pudo registrar la compra' }, { status: 500 });
  }

  return Response.json({ ok: true, id: data.id, leadLinked: Boolean(leadId) });
}
