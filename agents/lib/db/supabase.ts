import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '@/lib/config';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }
  if (!client) {
    client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
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
