import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";
import { buildBookingEmail, sendBookingEmail } from "@/lib/booking-email";

const ALLOWED_FIELDS = new Set([
  "service",
  "property_summary",
  "frequency",
  "frequency_key",
  "per_visit_price",
  "extras",
  "custom_extras_items",
  "custom_extras_text",
  "custom_extras_price",
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
  "payment_amount",
  "payment_currency",
]);

export async function PATCH(request: Request) {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

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

    const updated = data[0] as Record<string, unknown>;
    const contactEmail = updated.contact_email as string | undefined;
    const isCancelled = updated.status === "cancelled";
    if (contactEmail) {
      const { subject, body } = buildBookingEmail(
        isCancelled ? "cancelled" : "amended",
        updated,
      );
      try {
        await sendBookingEmail({ to: contactEmail, subject, body });
      } catch {
        // Email failures should not block booking updates.
      }
    }

    return NextResponse.json({ booking: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to update booking." },
      { status: 500 },
    );
  }
}
