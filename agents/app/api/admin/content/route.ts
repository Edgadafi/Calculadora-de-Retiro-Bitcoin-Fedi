import { NextRequest } from 'next/server';
import { isSupabaseConfigured } from '@/lib/config';
import { getSupabase, type ContentDraftRow, type LegalAlertRow } from '@/lib/db/supabase';
import {
  CONTENT_STATUSES,
  generateContentForAlert,
  type ContentStatus,
} from '@/lib/agents/content-generator';
import { enqueueBufferUpdate, isBufferConfigured } from '@/lib/buffer';
import { matchesSecret } from '@/lib/http/shared-secret';

const ACTIONS = ['queue', 'reject', 'regenerate'] as const;
type Action = (typeof ACTIONS)[number];

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

  const status = (req.nextUrl.searchParams.get('status') || 'draft') as ContentStatus;
  if (!CONTENT_STATUSES.includes(status)) {
    return Response.json(
      { error: `status inválido. Usa uno de: ${CONTENT_STATUSES.join(', ')}` },
      { status: 400 }
    );
  }

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

  const { draftId, action } = body as { draftId?: string; action?: Action };

  if (!draftId || !action) {
    return Response.json({ error: 'draftId and action required' }, { status: 400 });
  }

  if (!ACTIONS.includes(action)) {
    return Response.json({ error: 'Unknown action' }, { status: 400 });
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
    // Una pieza que ya salió a Buffer no se reescribe ni se marca rechazada
    // desde aquí: en la red social seguiría agendada y la base mentiría.
    if (draft.status !== 'draft') {
      return Response.json(
        { error: `El borrador está en "${draft.status}"; sólo se opera sobre "draft"` },
        { status: 409 }
      );
    }

    if (action === 'reject') {
      const { data: rejected, error: upd } = await supabase
        .from('content_drafts')
        .update({ status: 'rejected', updated_at: new Date().toISOString(), error: null })
        .eq('id', draftId)
        .eq('status', 'draft')
        .select('id')
        .maybeSingle();

      if (upd) throw new Error(upd.message);
      if (!rejected) {
        // Otra petición encoló la pieza entre la lectura y esta escritura.
        return Response.json({ error: 'El borrador cambió de estado' }, { status: 409 });
      }
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
      const { created, skipped } = await generateContentForAlert(alert as LegalAlertRow);
      return Response.json({ ok: true, created, skipped });
    }

    if (action === 'queue') {
      if (!isBufferConfigured()) {
        return Response.json(
          {
            ok: false,
            skipped: 'buffer_not_configured',
            error: 'Configura BUFFER_ACCESS_TOKEN y BUFFER_PROFILE_ID para encolar en Buffer',
          },
          { status: 503 }
        );
      }

      // Se reserva la fila antes de llamar a Buffer: dos clics seguidos no
      // deben producir dos publicaciones agendadas de la misma pieza.
      const { data: claimed, error: claimErr } = await supabase
        .from('content_drafts')
        .update({ status: 'queued', error: null, updated_at: new Date().toISOString() })
        .eq('id', draftId)
        .eq('status', 'draft')
        .select('id')
        .maybeSingle();

      if (claimErr) throw new Error(claimErr.message);
      if (!claimed) {
        return Response.json({ error: 'Otro proceso ya encoló este borrador' }, { status: 409 });
      }

      let bufferId: string;
      try {
        const result = await enqueueBufferUpdate(draft.body);
        if ('skipped' in result) throw new Error(result.skipped);
        bufferId = result.id;
      } catch (e) {
        // Buffer no aceptó la pieza: se libera la reserva y el motivo queda
        // visible en el panel, en lugar de dejarla en queued sin id.
        const message = e instanceof Error ? e.message : 'Buffer falló';
        await supabase
          .from('content_drafts')
          .update({
            status: 'draft',
            buffer_update_id: null,
            error: message.slice(0, 500),
            updated_at: new Date().toISOString(),
          })
          .eq('id', draftId);
        throw e;
      }

      // Buffer ya tiene la pieza agendada: pase lo que pase con esta escritura,
      // la fila se queda en queued. Devolverla a draft permitiría encolarla de
      // nuevo y publicar dos veces.
      const { error: upd } = await supabase
        .from('content_drafts')
        .update({ buffer_update_id: bufferId, updated_at: new Date().toISOString() })
        .eq('id', draftId);

      if (upd) {
        console.error('[admin/content] Buffer aceptó pero no se guardó el id', upd.message);
        return Response.json(
          {
            ok: true,
            bufferUpdateId: bufferId,
            warning: 'La pieza quedó agendada en Buffer pero no se pudo guardar su id',
          },
          { status: 207 }
        );
      }

      return Response.json({ ok: true, bufferUpdateId: bufferId });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Action failed';
    console.error('[admin/content]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
