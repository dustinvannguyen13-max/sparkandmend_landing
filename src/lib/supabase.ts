const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  console.warn(
    "NEXT_PUBLIC_SUPABASE_URL is not set; Supabase integrations will not work.",
  );
}

if (!SUPABASE_KEY) {
  console.warn(
    "Supabase key is not set (service role or anon). Booking persistence will fail.",
  );
}

export const supabaseConfig = {
  url: SUPABASE_URL,
  key: SUPABASE_KEY,
};

export const supabaseHeaders = SUPABASE_KEY
  ? {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    }
  : undefined;
