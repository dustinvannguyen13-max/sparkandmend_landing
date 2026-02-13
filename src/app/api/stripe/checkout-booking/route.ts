import { Buffer } from "buffer";
import { NextResponse } from "next/server";
import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";
import { APP_DOMAIN } from "@/utils/constants/site";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const APP_DOMAIN_BASE = APP_DOMAIN.replace(/\/$/, "");

const buildStripeHeaders = () => {
  if (!STRIPE_SECRET_KEY) {
    return null;
  }
  const encoded = Buffer.from(`${STRIPE_SECRET_KEY}:`).toString("base64");
  return {
    Authorization: `Basic ${encoded}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
};

const fetchBooking = async (reference: string) => {
  if (!supabaseConfig.url || !supabaseHeaders) {
    throw new Error("Supabase configuration is missing.");
  }

  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/bookings?reference=eq.${encodeURIComponent(
      reference,
    )}&select=reference,service,property_summary,per_visit_price,promo_discount,contact_email,status,stripe_subscription_id`,
    {
      headers: supabaseHeaders,
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to fetch booking.");
  }

  const data = (await response.json()) as Array<Record<string, unknown>>;
  if (!data.length) {
    throw new Error("Booking not found.");
  }

  return data[0];
};

const patchBookingStripeId = async (reference: string, sessionId: string) => {
  if (!supabaseConfig.url || !supabaseHeaders) {
    return;
  }

  await fetch(
    `${supabaseConfig.url}/rest/v1/bookings?reference=eq.${encodeURIComponent(reference)}`,
    {
      method: "PATCH",
      headers: supabaseHeaders,
      body: JSON.stringify({
        stripe_session_id: sessionId,
      }),
    },
  );
};

const createStripeSession = async (
  reference: string,
  amount: number,
  service: string,
  propertySummary: string,
  contactEmail?: string,
) => {
  const headers = buildStripeHeaders();
  if (!headers) {
    throw new Error("Missing Stripe secret key.");
  }

  const form = new URLSearchParams();
  form.append("payment_method_types[]", "card");
  form.append("mode", "payment");
  form.append("line_items[0][price_data][currency]", "gbp");
  form.append(
    "line_items[0][price_data][product_data][name]",
    `Spark & Mend booking ${reference}`,
  );
  form.append(
    "line_items[0][price_data][product_data][description]",
    `${service} • ${propertySummary}`,
  );
  form.append("line_items[0][price_data][unit_amount]", String(Math.round(amount * 100)));
  form.append("line_items[0][quantity]", "1");
  form.append(
    "success_url",
    `${APP_DOMAIN_BASE}/booking-confirmation?session_id={CHECKOUT_SESSION_ID}&reference=${reference}`,
  );
  form.append(
    "cancel_url",
    `${APP_DOMAIN_BASE}/my-booking?reference=${reference}&payment=cancelled`,
  );
  form.append("metadata[reference]", reference);

  if (contactEmail) {
    form.append("customer_email", contactEmail);
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers,
    body: form,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || "Stripe checkout session failed.");
  }

  return payload;
};

export async function POST(request: Request) {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY environment variable." },
      { status: 400 },
    );
  }

  try {
    const body = (await request.json()) as { reference?: string };
    const reference = body.reference?.trim();

    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required." },
        { status: 400 },
      );
    }

    const booking = await fetchBooking(reference);
    const status = booking.status as string | undefined;
    if (status === "paid") {
      return NextResponse.json(
        { error: "Booking is already paid." },
        { status: 400 },
      );
    }
    if (booking.stripe_subscription_id) {
      return NextResponse.json(
        { error: "This booking is billed by subscription." },
        { status: 400 },
      );
    }

    const baseAmount = Number(booking.per_visit_price);
    const promoDiscount = Number(booking.promo_discount ?? 0);
    const amount = Math.max(0, baseAmount - Math.max(0, promoDiscount));
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "A valid payment amount is required." },
        { status: 400 },
      );
    }

    const session = await createStripeSession(
      reference,
      amount,
      (booking.service as string) ?? "Cleaning service",
      (booking.property_summary as string) ?? "Booking",
      booking.contact_email as string | undefined,
    );

    await patchBookingStripeId(reference, session.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unable to create checkout." },
      { status: 500 },
    );
  }
}
