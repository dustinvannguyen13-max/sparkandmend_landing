create table if not exists admin_integrations (
  id uuid primary key default gen_random_uuid(),
  provider text unique not null,
  email text,
  access_token text not null,
  refresh_token text,
  scope text,
  token_type text,
  expires_at timestamptz,
  last_synced_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists booking_google_events (
  id uuid primary key default gen_random_uuid(),
  booking_reference text unique not null,
  event_id text not null,
  calendar_id text not null default 'primary',
  status text,
  last_synced_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
