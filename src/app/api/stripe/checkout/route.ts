import { Buffer } from "buffer";
import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";
import { APP_DOMAIN } from "@/utils/constants/site";
import { applyOfferToPrice, getActiveOffer } from "@/lib/offers";

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
  contact_address: contact.address ?? "",
  contact_method: contact.preferredContact ?? "",
  preferred_date: contact.preferredDate ?? null,
  preferred_time: contact.preferredTime ?? null,
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

const fetchBookingByReference = async (reference: string) => {
  if (!supabaseConfig.url || !supabaseHeaders) {
    return null;
  }

  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/bookings?reference=eq.${encodeURIComponent(
      reference,
    )}&select=reference`,
    {
      headers: supabaseHeaders,
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as Array<Record<string, unknown>>;
  return data.length ? data[0] : null;
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
  offerLabel?: string | null,
) => {
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
  form.append("success_url", `${APP_DOMAIN_BASE}/booking-confirmation?session_id={CHECKOUT_SESSION_ID}&reference=${reference}`);
  form.append("cancel_url", `${APP_DOMAIN_BASE}/your-cleaning-quote?reference=${reference}`);
  form.append("metadata[reference]", reference);
  if (offerLabel) {
    form.append("metadata[offer]", offerLabel);
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
        address?: string;
        preferredDate?: string;
        preferredTime?: string;
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

    const baseAmount = Math.max(0, body.quote.perVisitPrice);
    if (baseAmount <= 0) {
      return NextResponse.json(
        { error: "A valid total amount is required." },
        { status: 400 },
      );
    }

    const activeOffer = await getActiveOffer();
    const offerResult = applyOfferToPrice(baseAmount, activeOffer);
    const amount = offerResult.finalPrice;

    const reference =
      body.referenceHint ||
      `SM-${randomUUID().split("-")[0].toUpperCase()}`;

    const bookingPayload = buildBookingPayload({
      reference,
      quote: { ...body.quote, perVisitPrice: amount },
      contact: body.contact,
      extras: body.extras || [],
    });

    const existing = await fetchBookingByReference(reference);
    if (!existing) {
      await insertBookingRow(bookingPayload);
    }

    const session = await createStripeSession(
      reference,
      amount,
      offerResult.offerSummary?.label ?? null,
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
