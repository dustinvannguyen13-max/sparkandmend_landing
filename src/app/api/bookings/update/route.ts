import { NextResponse } from "next/server";
import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";

const ALLOWED_FIELDS = new Set([
  "contact_name",
  "contact_email",
  "contact_phone",
  "contact_postcode",
  "contact_address",
  "contact_method",
  "preferred_date",
  "preferred_time",
  "notes",
  "status",
]);

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      reference?: string;
      updates?: Record<string, unknown>;
    };

    const reference = body.reference?.trim();
    const updates = body.updates ?? {};

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

    const sanitizedUpdates: Record<string, unknown> = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (ALLOWED_FIELDS.has(key)) {
        sanitizedUpdates[key] = value;
      }
    });

    if (sanitizedUpdates.status && sanitizedUpdates.status !== "cancelled") {
      return NextResponse.json(
        { error: "Invalid status update." },
        { status: 400 },
      );
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return NextResponse.json(
        { error: "No updates provided." },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${supabaseConfig.url}/rest/v1/bookings?reference=eq.${encodeURIComponent(
        reference,
      )}`,
      {
        method: "PATCH",
        headers: supabaseHeaders,
        body: JSON.stringify(sanitizedUpdates),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: text || "Unable to update booking." },
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
      { error: "Unable to update booking." },
      { status: 500 },
    );
  }
}
