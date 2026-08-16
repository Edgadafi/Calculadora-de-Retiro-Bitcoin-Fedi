-- P0 — sólo la tabla de compras. Usar si el resto del schema ya corre en Supabase.
-- Idempotente. Requiere que `leads` exista (FK lead_id).
--
-- SQL Editor → pegar y Run. Si las tablas viven en un esquema propio,
-- ejecuta antes: set search_path = retirobtc, extensions, public;

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
  constraint purchases_provider_external_id_key unique (provider, external_id)
);

create index if not exists purchases_created_at_idx on purchases (created_at desc);
create index if not exists purchases_status_idx on purchases (status, created_at desc);
create index if not exists purchases_lead_idx on purchases (lead_id);
create index if not exists purchases_correlation_idx on purchases (correlation_id);

do $$
declare
  target_schema text := current_schema();
begin
  execute format('grant usage on schema %I to service_role', target_schema);
  execute format('grant all on all tables in schema %I to service_role', target_schema);
  execute format('grant all on all sequences in schema %I to service_role', target_schema);
end
$$;

alter table purchases enable row level security;
