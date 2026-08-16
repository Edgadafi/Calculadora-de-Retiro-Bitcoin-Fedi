import { NextRequest } from 'next/server';
import { isSupabaseConfigured } from '@/lib/config';
import { getSupabase, type ContentDraftRow, type LegalAlertRow } from '@/lib/db/supabase';
import { generateContentForAlert } from '@/lib/agents/content-generator';
import { enqueueBufferUpdate, isBufferConfigured } from '@/lib/buffer';
import { matchesSecret } from '@/lib/http/shared-secret';

function assertAdmin(req: NextRequest): boolean {
  return matchesSecret(req.headers.get('x-admin-secret'), process.env.ADMIN_SECRET);
}

export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return Response.json({ drafts: [], warning: 'Supabase not configured' });
  }

  const status = req.nextUrl.searchParams.get('status') || 'draft';
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('content_drafts')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({
    drafts: data as ContentDraftRow[],
    bufferConfigured: isBufferConfigured(),
  });
}

export async function POST(req: NextRequest) {
  if (!assertAdmin(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return Response.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { draftId, action } = body as {
    draftId?: string;
    action?: 'queue' | 'reject' | 'regenerate';
  };

  if (!draftId || !action) {
    return Response.json({ error: 'draftId and action required' }, { status: 400 });
  }

  const supabase = getSupabase();
  const { data: draft, error } = await supabase
    .from('content_drafts')
    .select('*')
    .eq('id', draftId)
    .single();

  if (error || !draft) {
    return Response.json({ error: 'Draft not found' }, { status: 404 });
  }

  try {
    if (action === 'reject') {
      const { error: upd } = await supabase
        .from('content_drafts')
        .update({ status: 'rejected', updated_at: new Date().toISOString(), error: null })
        .eq('id', draftId);
      if (upd) throw new Error(upd.message);
      return Response.json({ ok: true });
    }

    if (action === 'regenerate') {
      if (!draft.alert_id) {
        return Response.json({ error: 'El borrador no tiene alerta asociada' }, { status: 400 });
      }
      const { data: alert, error: alertErr } = await supabase
        .from('legal_alerts')
        .select('*')
        .eq('id', draft.alert_id)
        .single();
      if (alertErr || !alert) {
        return Response.json({ error: 'Alerta no encontrada' }, { status: 404 });
      }
      await generateContentForAlert(alert as LegalAlertRow);
      return Response.json({ ok: true });
    }

    if (action === 'queue') {
      if (draft.status !== 'draft') {
        return Response.json({ error: 'Sólo se encola un borrador en draft' }, { status: 400 });
      }
      const result = await enqueueBufferUpdate(draft.body);
      if ('skipped' in result) {
        return Response.json(
          {
            ok: false,
            skipped: result.skipped,
            error: 'Configura BUFFER_ACCESS_TOKEN y BUFFER_PROFILE_ID para encolar en Buffer',
          },
          { status: 503 }
        );
      }
      const { error: upd } = await supabase
        .from('content_drafts')
        .update({
          status: 'queued',
          buffer_update_id: result.id,
          error: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', draftId);
      if (upd) throw new Error(upd.message);
      return Response.json({ ok: true, bufferUpdateId: result.id });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Action failed';
    console.error('[admin/content]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
