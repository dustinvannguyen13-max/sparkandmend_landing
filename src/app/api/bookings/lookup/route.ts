import { NextResponse } from "next/server";
import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { reference?: string };
    const reference = body.reference?.trim();

    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required." },
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
      `${supabaseConfig.url}/rest/v1/bookings?reference=eq.${encodeURIComponent(
        reference,
      )}&select=reference,service,property_summary,frequency,per_visit_price,extras,custom_extras_items,custom_extras_text,custom_extras_price,contact_name,contact_email,contact_phone,contact_postcode,contact_address,contact_method,preferred_date,preferred_time,notes,status,payment_amount,payment_currency`,
      {
        headers: supabaseHeaders,
      },
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: text || "Unable to fetch booking." },
        { status: 502 },
      );
    }

    const data = (await response.json()) as Array<Record<string, unknown>>;
    if (!data.length) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ booking: data[0] });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to fetch booking." },
      { status: 500 },
    );
  }
}
