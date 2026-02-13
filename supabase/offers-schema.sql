create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text,
  cta_label text,
  cta_href text,
  discount_type text not null default 'amount',
  discount_value numeric not null default 0,
  enabled boolean not null default false,
  start_at timestamptz,
  end_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
