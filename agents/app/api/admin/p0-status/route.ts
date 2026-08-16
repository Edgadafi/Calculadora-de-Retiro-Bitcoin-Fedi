import { NextRequest } from 'next/server';
import { isInternalApiConfigured, isSupabaseConfigured, SUPABASE_SCHEMA } from '@/lib/config';
import { getSupabase } from '@/lib/db/supabase';
import { matchesSecret } from '@/lib/http/shared-secret';

/**
 * Chequeo de activación P0 en el servicio de agentes.
 *
 * Confirma secreto interno, Supabase y que la tabla `purchases` existe.
 * Autenticado con el mismo admin secret del panel de alertas.
 */

function assertAdmin(req: NextRequest): boolean {
  return matchesSecret(req.headers.get('x-admin-secret'), process.env.ADMIN_SECRET);
}

async function probeTable(name: 'purchases' | 'leads'): Promise<'ok' | 'missing' | 'error'> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from(name).select('id').limit(1);
    if (!error) return 'ok';
    const message = error.message || '';
    if (/could not find the table|does not exist|schema cache/i.test(message)) {
      return 'missing';
    }
    console.error(`[p0-status] ${name}`, message);
    return 'error';
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[p0-status] ${name}`, message);
    return 'error';
  }
}

export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseConfigured = isSupabaseConfigured();
  const purchasesTable = supabaseConfigured ? await probeTable('purchases') : 'missing';
  const leadsTable = supabaseConfigured ? await probeTable('leads') : 'missing';
  const ready =
    isInternalApiConfigured()
    && supabaseConfigured
    && purchasesTable === 'ok'
    && leadsTable === 'ok';

  return Response.json(
    {
      phase: 'P0',
      project: 'agents',
      ready,
      schema: SUPABASE_SCHEMA,
      supabaseConfigured,
      internalSecretConfigured: isInternalApiConfigured(),
      purchasesTable,
      leadsTable,
    },
    { status: ready ? 200 : 503 }
  );
}
