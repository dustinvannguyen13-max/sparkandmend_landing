import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";

export async function GET() {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!supabaseConfig.url || !supabaseHeaders) {
    return NextResponse.json(
      { error: "Supabase configuration is missing." },
      { status: 500 },
    );
  }

  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/bookings?select=reference,series_id,series_reference,series_index,frequency,frequency_key,stripe_customer_id,stripe_subscription_id,stripe_subscription_status,stripe_current_period_end,stripe_invoice_id,service,property_summary,per_visit_price,extras,custom_extras_items,custom_extras_text,custom_extras_reason,custom_extras_source,custom_extras_fallback_reason,custom_extras_price,promo_type,promo_label,promo_discount,contact_name,contact_email,contact_phone,contact_postcode,contact_address,contact_method,preferred_date,preferred_time,notes,status,payment_amount,payment_currency,created_at&order=created_at.desc`,
    { headers: supabaseHeaders },
  );

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      { error: text || "Unable to fetch bookings." },
      { status: 502 },
    );
  }

  const data = (await response.json()) as Array<Record<string, unknown>>;
  return NextResponse.json({ bookings: data });
}
