-- Retiro BTC — Agentes IA Vertical 1
-- Ejecutar en Supabase SQL Editor (habilitar extensión vector)

create extension if not exists vector;

-- Leads (guía / eBook)
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  bitcoin_familiarity smallint,
  source text not null default 'brujula-guia',
  utm jsonb,
  guide_token text unique,
  guide_token_expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists leads_email_idx on leads (email);
create index if not exists leads_created_at_idx on leads (created_at desc);

-- Consentimiento ARCO (INAI)
create table if not exists consent_records (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads (id) on delete set null,
  email text not null,
  privacy_notice_version text not null default '2026-05',
  ip_hash text,
  user_agent text,
  consented_at timestamptz not null default now()
);

create index if not exists consent_records_email_idx on consent_records (email);

-- Chat Rito
create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  session_key text not null unique,
  ip_hash text,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references chat_sessions (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_session_idx on chat_messages (session_id, created_at);

-- Base de conocimiento RAG
create table if not exists knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  source_path text,
  content_hash text,
  updated_at timestamptz not null default now()
);

create table if not exists knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references knowledge_documents (id) on delete cascade,
  chunk_index int not null,
  content text not null,
  embedding vector(1536),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists knowledge_chunks_document_idx on knowledge_chunks (document_id, chunk_index);

-- Búsqueda por similitud (requiere índice ivfflat tras poblar datos)
-- create index knowledge_chunks_embedding_idx on knowledge_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create or replace function match_knowledge_chunks (
  query_embedding vector(1536),
  match_count int default 5,
  match_threshold float default 0.5
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    kc.id,
    kc.document_id,
    kc.content,
    kc.metadata,
    1 - (kc.embedding <=> query_embedding) as similarity
  from knowledge_chunks kc
  where kc.embedding is not null
    and 1 - (kc.embedding <=> query_embedding) > match_threshold
  order by kc.embedding <=> query_embedding
  limit match_count;
$$;

-- Alertas legales (investigador DOF)
create table if not exists legal_alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  source_url text,
  raw_excerpt text,
  keywords text[],
  status text not null default 'pending_review'
    check (status in ('pending_review', 'approved', 'rejected', 'ingested')),
  reviewed_at timestamptz,
  reviewed_by text,
  created_at timestamptz not null default now()
);

create index if not exists legal_alerts_status_idx on legal_alerts (status, created_at desc);

-- Rate limiting (persistente)
create table if not exists rate_limit_buckets (
  bucket_key text primary key,
  count int not null default 0,
  window_start timestamptz not null default now()
);

-- Compras Premium (P0: medición de ingresos y atribución)
-- El importe y el plan siempre provienen del proveedor de pago, nunca del cliente.
-- No se guarda correo ni dato de tarjeta: la atribución se resuelve vía lead_id.
create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('mercadopago', 'lightning')),
  external_id text not null,
  plan text not null check (plan in ('monthly', 'lifetime')),
  amount numeric(14, 2) not null check (amount >= 0),
  currency text not null check (currency in ('MXN', 'SAT')),
  status text not null check (status in ('approved', 'pending', 'rejected', 'refunded')),
  correlation_id text,
  lead_id uuid references leads (id) on delete set null,
  utm jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Idempotencia: Mercado Pago reintenta notificaciones y el cliente sondea
  -- check-payment cada 3 s; ninguna repetición debe duplicar la fila.
  constraint purchases_provider_external_id_key unique (provider, external_id)
);

create index if not exists purchases_created_at_idx on purchases (created_at desc);
create index if not exists purchases_status_idx on purchases (status, created_at desc);
create index if not exists purchases_lead_idx on purchases (lead_id);
create index if not exists purchases_correlation_idx on purchases (correlation_id);
