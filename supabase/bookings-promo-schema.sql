alter table if exists bookings
  add column if not exists promo_type text,
  add column if not exists promo_label text,
  add column if not exists promo_discount numeric default 0;
