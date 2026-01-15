import { Buffer } from "buffer";
import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const APP_DOMAIN = (process.env.NEXT_PUBLIC_APP_DOMAIN || "http://localhost:3000").replace(
  /\/$/,
  "",
);

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

const buildBookingPayload = ({
  reference,
  quote,
  contact,
  extras,
}: {
  reference: string;
  quote: Record<string, unknown>;
  contact: Record<string, unknown>;
  extras: string[];
}) => ({
  reference,
  service: quote.serviceLabel,
  property_summary: quote.propertySummary,
  frequency: quote.frequencyLabel,
  per_visit_price: quote.perVisitPrice,
  extras,
  custom_extras_items: quote.customExtrasItems ?? [],
  custom_extras_text: quote.customExtrasText ?? "",
  custom_extras_reason: quote.customExtrasReason ?? "",
  custom_extras_source: quote.customExtrasSource ?? "",
  custom_extras_fallback_reason: quote.customExtrasFallbackReason ?? "",
  custom_extras_price: quote.customExtrasPrice ?? 0,
  contact_name: contact.name ?? "",
  contact_email: contact.email ?? "",
  contact_phone: contact.phone ?? "",
  contact_postcode: contact.postcode ?? "",
  contact_method: contact.preferredContact ?? "",
  preferred_date: contact.preferredDate ?? null,
  notes: contact.notes ?? "",
  status: "pending",
});

const insertBookingRow = async (payload: Record<string, unknown>) => {
  if (!supabaseConfig.url || !supabaseHeaders) {
    throw new Error("Supabase configuration is missing.");
  }

  const response = await fetch(`${supabaseConfig.url}/rest/v1/bookings`, {
    method: "POST",
    headers: supabaseHeaders,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to save booking.");
  }

  return response.json();
};

const patchBookingStripeId = async (reference: string, sessionId: string, amount: number) => {
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
        payment_amount: amount,
        payment_currency: "GBP",
      }),
    },
  );
};

const createStripeSession = async (reference: string, amount: number) => {
  const headers = buildStripeHeaders();
  if (!headers) {
    throw new Error("Missing Stripe secret key.");
  }

  const form = new URLSearchParams();
  form.append("payment_method_types[]", "card");
  form.append("mode", "payment");
  form.append("line_items[0][price_data][currency]", "gbp");
  form.append("line_items[0][price_data][product_data][name]", `Spark & Mend booking ${reference}`);
  form.append(
    "line_items[0][price_data][product_data][description]",
    "Secure payment for Spark & Mend cleaning services.",
  );
  form.append("line_items[0][price_data][unit_amount]", String(Math.round(amount * 100)));
  form.append("line_items[0][quantity]", "1");
  form.append("success_url", `${APP_DOMAIN}/booking-confirmation?session_id={CHECKOUT_SESSION_ID}&reference=${reference}`);
  form.append("cancel_url", `${APP_DOMAIN}/your-cleaning-quote?reference=${reference}`);
  form.append("metadata[reference]", reference);

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
    const body = (await request.json()) as {
      quote?: {
        serviceLabel?: string;
        frequencyLabel?: string;
        propertySummary?: string;
        perVisitPrice?: number;
        addOns?: string[];
        customExtrasItems?: string[];
        customExtrasSummary?: string;
        customExtrasText?: string;
        customExtrasReason?: string;
        customExtrasSource?: string;
        customExtrasFallbackReason?: string;
        customExtrasPrice?: number;
      };
      contact?: {
        name?: string;
        email?: string;
        phone?: string;
        postcode?: string;
        preferredDate?: string;
        preferredContact?: string;
        notes?: string;
      };
      extras?: string[];
      referenceHint?: string;
    };

    if (!body.quote || typeof body.quote.perVisitPrice !== "number") {
      return NextResponse.json({ error: "Missing quote information." }, { status: 400 });
    }

    if (!body.contact?.email || !body.contact?.phone) {
      return NextResponse.json(
        { error: "Contact email and phone are required." },
        { status: 400 },
      );
    }

    const amount = Math.max(0, body.quote.perVisitPrice);
    if (amount <= 0) {
      return NextResponse.json(
        { error: "A valid total amount is required." },
        { status: 400 },
      );
    }

    const reference =
      body.referenceHint ||
      `SM-${randomUUID().split("-")[0].toUpperCase()}`;

    const bookingPayload = buildBookingPayload({
      reference,
      quote: body.quote,
      contact: body.contact,
      extras: body.extras || [],
    });

    await insertBookingRow(bookingPayload);

    const session = await createStripeSession(reference, amount);
    await patchBookingStripeId(reference, session.id, amount);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unable to create checkout." },
      { status: 500 },
    );
  }
}
