import { NextRequest } from 'next/server';
import { isSupabaseConfigured, PREMIUM_PRICES_MXN } from '@/lib/config';
import { getSupabase, PurchaseRow } from '@/lib/db/supabase';
import { matchesSecret } from '@/lib/http/shared-secret';

/**
 * Reporte de ingresos (fase P0).
 *
 * MXN y sats se reportan por separado a propósito: sumarlos exigiría un tipo de
 * cambio del momento del cobro que no guardamos, y mezclarlos daría un total falso.
 */

function assertAdmin(req: NextRequest): boolean {
  return matchesSecret(req.headers.get('x-admin-secret'), process.env.ADMIN_SECRET);
}

function parseDays(raw: string | null): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 30;
  return Math.min(Math.max(Math.trunc(n), 1), 365);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return Response.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const days = parseDays(req.nextUrl.searchParams.get('days'));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('purchases')
    .select('provider, plan, amount, currency, status, lead_id, utm, paid_at, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[revenue]', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as Pick<
    PurchaseRow,
    'provider' | 'plan' | 'amount' | 'currency' | 'status' | 'lead_id' | 'utm' | 'paid_at' | 'created_at'
  >[];
  const approved = rows.filter((r) => r.status === 'approved');

  const byProvider = { mercadopago: { count: 0, mxn: 0, sats: 0 }, lightning: { count: 0, mxn: 0, sats: 0 } };
  const byPlan = { monthly: 0, lifetime: 0 };
  const campaigns = new Map<string, { count: number; mxn: number; sats: number }>();
  const convertedLeads = new Set<string>();

  for (const r of approved) {
    const bucket = byProvider[r.provider];
    bucket.count += 1;
    if (r.currency === 'MXN') bucket.mxn += Number(r.amount);
    else bucket.sats += Number(r.amount);

    byPlan[r.plan] += 1;
    if (r.lead_id) convertedLeads.add(r.lead_id);

    const key = r.utm?.utm_campaign || r.utm?.utm_source || 'sin-atribucion';
    const entry = campaigns.get(key) ?? { count: 0, mxn: 0, sats: 0 };
    entry.count += 1;
    if (r.currency === 'MXN') entry.mxn += Number(r.amount);
    else entry.sats += Number(r.amount);
    campaigns.set(key, entry);
  }

  // MRR: sólo suscripciones mensuales aprobadas en los últimos 30 días. Si el
  // importe no vino del proveedor se usa el precio de referencia configurado.
  const mrrSince = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const mrrMxn = approved
    .filter((r) => r.plan === 'monthly' && r.currency === 'MXN')
    .filter((r) => new Date(r.paid_at ?? r.created_at).getTime() >= mrrSince)
    .reduce((sum, r) => sum + (Number(r.amount) || PREMIUM_PRICES_MXN.monthly), 0);

  const { count: leadsCreated } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', since);

  return Response.json({
    window: { days, since },
    totals: {
      purchases: rows.length,
      approved: approved.length,
      mxn: round2(byProvider.mercadopago.mxn + byProvider.lightning.mxn),
      sats: Math.round(byProvider.mercadopago.sats + byProvider.lightning.sats),
    },
    mrrMxn: round2(mrrMxn),
    byProvider: {
      mercadopago: { ...byProvider.mercadopago, mxn: round2(byProvider.mercadopago.mxn) },
      lightning: { ...byProvider.lightning, sats: Math.round(byProvider.lightning.sats) },
    },
    byPlan,
    attribution: {
      leadsCreated: leadsCreated ?? 0,
      convertedLeads: convertedLeads.size,
      /**
       * Aproximación: un lead captado antes de la ventana puede convertir dentro
       * de ella, así que la tasa no es una cohorte estricta.
       */
      leadToPremiumRate:
        leadsCreated && leadsCreated > 0 ? round2((convertedLeads.size / leadsCreated) * 100) : null,
      unattributedApproved: approved.filter((r) => !r.lead_id).length,
    },
    topCampaigns: [...campaigns.entries()]
      .map(([key, v]) => ({ campaign: key, count: v.count, mxn: round2(v.mxn), sats: Math.round(v.sats) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  });
}
