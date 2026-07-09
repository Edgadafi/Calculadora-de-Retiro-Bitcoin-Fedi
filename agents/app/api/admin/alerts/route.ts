import { NextRequest } from 'next/server';
import { isSupabaseConfigured } from '@/lib/config';
import { getSupabase, LegalAlertRow } from '@/lib/db/supabase';
import { approveLegalAlert, rejectLegalAlert } from '@/lib/agents/legal-researcher';

function assertAdmin(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get('x-admin-secret') === secret;
}

export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return Response.json({ alerts: [], warning: 'Supabase not configured' });
  }

  const status = req.nextUrl.searchParams.get('status') || 'pending_review';
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('legal_alerts')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ alerts: data as LegalAlertRow[] });
}

export async function POST(req: NextRequest) {
  if (!assertAdmin(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { alertId, action, reviewedBy = 'admin' } = body as {
    alertId: string;
    action: 'approve' | 'reject';
    reviewedBy?: string;
  };

  if (!alertId || !action) {
    return Response.json({ error: 'alertId and action required' }, { status: 400 });
  }

  try {
    if (action === 'approve') await approveLegalAlert(alertId, reviewedBy);
    else await rejectLegalAlert(alertId, reviewedBy);
    return Response.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Action failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
