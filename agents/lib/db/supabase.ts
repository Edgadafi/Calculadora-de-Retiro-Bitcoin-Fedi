import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, SUPABASE_SCHEMA } from '@/lib/config';

function createServiceClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      // Fija el esquema una sola vez: todo `.from()` y `.rpc()` del servicio lo hereda.
      db: { schema: SUPABASE_SCHEMA },
    }
  );
}

/**
 * El tipo de `SupabaseClient` es genérico sobre el nombre del esquema, y aquí es
 * dinámico, así que se deriva del constructor en lugar de anotarlo a mano.
 */
export type ServiceSupabaseClient = ReturnType<typeof createServiceClient>;

let client: ServiceSupabaseClient | null = null;

export function getSupabase(): ServiceSupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }
  if (!client) {
    client = createServiceClient();
  }
  return client;
}

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  bitcoin_familiarity: number | null;
  source: string;
  utm: Record<string, string> | null;
  guide_token: string | null;
  guide_token_expires_at: string | null;
  created_at: string;
};

export type PurchaseRow = {
  id: string;
  provider: 'mercadopago' | 'lightning';
  external_id: string;
  plan: 'monthly' | 'lifetime';
  amount: number;
  currency: 'MXN' | 'SAT';
  status: 'approved' | 'pending' | 'rejected' | 'refunded';
  correlation_id: string | null;
  lead_id: string | null;
  utm: Record<string, string> | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LegalAlertRow = {
  id: string;
  title: string;
  summary: string;
  source_url: string | null;
  raw_excerpt: string | null;
  keywords: string[] | null;
  status: 'pending_review' | 'approved' | 'rejected' | 'ingested';
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
};

export type ContentDraftRow = {
  id: string;
  alert_id: string | null;
  channel: 'x_thread' | 'reels_30s' | 'seo';
  body: string;
  cta_url: string | null;
  status: 'draft' | 'queued' | 'published' | 'rejected';
  scheduled_for: string | null;
  buffer_update_id: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
};
