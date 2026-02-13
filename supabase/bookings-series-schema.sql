alter table if exists bookings
  add column if not exists series_id uuid,
  add column if not exists series_reference text,
  add column if not exists series_index integer default 0,
  add column if not exists frequency_key text;
