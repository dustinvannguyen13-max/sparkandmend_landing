import { NextResponse } from "next/server";
import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    if (!supabaseConfig.url || !supabaseHeaders) {
      return NextResponse.json(
        { error: "Supabase configuration is missing." },
        { status: 500 },
      );
    }

    const response = await fetch(
      `${supabaseConfig.url}/rest/v1/bookings?contact_email=ilike.${encodeURIComponent(
        email,
      )}&select=reference,service,property_summary,frequency,per_visit_price,preferred_date,status,created_at,promo_type,promo_label,promo_discount&order=created_at.desc`,
      {
        headers: supabaseHeaders,
      },
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
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to fetch bookings." },
      { status: 500 },
    );
  }
}
