-- P1 — borradores de contenido a partir de alertas legales aprobadas.
-- Idempotente. Requiere `legal_alerts`.
--
-- SQL Editor → pegar y Run. Si las tablas viven en un esquema propio:
--   set search_path = retirobtc, extensions, public;

create table if not exists content_drafts (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid references legal_alerts (id) on delete set null,
  channel text not null check (channel in ('x_thread', 'reels_30s', 'seo')),
  body text not null,
  cta_url text,
  status text not null default 'draft'
    check (status in ('draft', 'queued', 'published', 'rejected')),
  scheduled_for timestamptz,
  buffer_update_id text,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_drafts_alert_channel_key unique (alert_id, channel)
);

create index if not exists content_drafts_status_idx on content_drafts (status, created_at desc);
create index if not exists content_drafts_alert_idx on content_drafts (alert_id);

do $$
declare
  target_schema text := current_schema();
begin
  execute format('grant usage on schema %I to service_role', target_schema);
  execute format('grant all on all tables in schema %I to service_role', target_schema);
  execute format('grant all on all sequences in schema %I to service_role', target_schema);
end
$$;

alter table content_drafts enable row level security;
