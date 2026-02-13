import { Buffer } from "buffer";
import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";
import { APP_DOMAIN } from "@/utils/constants/site";
import { applyOfferToPrice, getActiveOffer } from "@/lib/offers";
import {
  applyFreeBathroomPromo,
  isFirstTimeCustomer,
} from "@/lib/booking-promos";
import { buildSeriesDates, buildSeriesReferences } from "@/lib/booking-series";
import { getFrequencyKey, getFrequencyLabel } from "@/lib/booking-frequency";
import type { QuoteInput } from "@/utils/quote";

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
  seriesId,
  seriesReference,
  seriesIndex,
  frequencyKey,
}: {
  reference: string;
  quote: Record<string, unknown>;
  contact: Record<string, unknown>;
  extras: string[];
  seriesId?: string | null;
  seriesReference?: string | null;
  seriesIndex?: number;
  frequencyKey?: string | null;
}) => ({
  reference,
  series_id: seriesId ?? null,
  series_reference: seriesReference ?? null,
  series_index: seriesIndex ?? 0,
  service: quote.serviceLabel,
  property_summary: quote.propertySummary,
  frequency: quote.frequencyLabel,
  frequency_key: frequencyKey ?? null,
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

const insertBookingRow = async (
  payload: Record<string, unknown> | Array<Record<string, unknown>>,
) => {
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
    )}&select=reference,service,property_summary,per_visit_price,promo_label,promo_discount,contact_email`,
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
  promoLabel?: string | null,
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
  if (promoLabel) {
    form.append("metadata[promo]", promoLabel);
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
      input?: {
        service?: "basic" | "intermediate" | "advanced" | "commercial";
        bathrooms?: number;
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

    const reference =
      body.referenceHint ||
      `SM-${randomUUID().split("-")[0].toUpperCase()}`;

    const existing = await fetchBookingByReference(reference);
    if (existing) {
      const storedAmount = Number(existing.per_visit_price);
      const promoDiscount = Number(existing.promo_discount ?? 0);
      const amount = Math.max(0, storedAmount - Math.max(0, promoDiscount));
      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json(
          { error: "A valid payment amount is required." },
          { status: 400 },
        );
      }

      const session = await createStripeSession(
        reference,
        amount,
        null,
        (existing.promo_label as string | null) ?? null,
      );
      await patchBookingStripeId(reference, session.id);
      return NextResponse.json({ url: session.url });
    }

    const activeOffer = await getActiveOffer();
    const offerResult = applyOfferToPrice(baseAmount, activeOffer);
    const isFirstTime = await isFirstTimeCustomer(
      body.contact?.email,
      body.contact?.address,
    );
    let firstVisitPrice = offerResult.finalPrice;
    let promo = null as ReturnType<typeof applyFreeBathroomPromo>["promo"];
    if (body.input) {
      const promoResult = applyFreeBathroomPromo(
        { perVisitPrice: offerResult.finalPrice },
        body.input as QuoteInput,
        isFirstTime,
      );
      firstVisitPrice = promoResult.firstVisitPrice;
      promo = promoResult.promo;
    }
    const amount = firstVisitPrice;

    const inferredFrequencyKey =
      getFrequencyKey(body.quote.frequencyLabel as string | null) ?? "one-time";
    const frequencyKey =
      body.input?.service === "advanced" ? "one-time" : inferredFrequencyKey;
    const frequencyLabel =
      getFrequencyLabel(frequencyKey) ?? (body.quote.frequencyLabel as string);

    const hasSchedule = frequencyKey !== "one-time" && Boolean(body.contact?.preferredDate);
    const seriesId = hasSchedule ? randomUUID() : null;
    const computedSeriesDates = hasSchedule
      ? buildSeriesDates(body.contact?.preferredDate as string, frequencyKey)
      : [body.contact?.preferredDate ?? null];
    const seriesDates =
      computedSeriesDates.length > 0
        ? computedSeriesDates
        : [body.contact?.preferredDate ?? null];
    const seriesReferences = hasSchedule
      ? buildSeriesReferences(reference, seriesDates.length)
      : [reference];

    const bookingPayload = buildBookingPayload({
      reference,
      quote: {
        ...body.quote,
        frequencyLabel: frequencyLabel,
        perVisitPrice: offerResult.finalPrice,
      },
      contact: body.contact,
      extras: body.extras || [],
      seriesId,
      seriesReference: seriesId ? reference : null,
      seriesIndex: 0,
      frequencyKey,
    });
    const promoPayload = promo
      ? {
          promo_type: promo.type,
          promo_label: promo.label,
          promo_discount: promo.discountAmount,
        }
      : {
          promo_type: "",
          promo_label: "",
          promo_discount: 0,
        };

    const payloads = seriesDates.map((date, index) => ({
      ...bookingPayload,
      ...promoPayload,
      reference: seriesReferences[index] ?? reference,
      series_index: seriesId ? index : 0,
      preferred_date: date,
      status: index === 0 ? "pending" : "pending",
      payment_amount: null,
      payment_currency: null,
      promo_type: index === 0 ? promoPayload.promo_type : "",
      promo_label: index === 0 ? promoPayload.promo_label : "",
      promo_discount: index === 0 ? promoPayload.promo_discount : 0,
    }));

    await insertBookingRow(payloads);

    const session = await createStripeSession(
      reference,
      amount,
      offerResult.offerSummary?.label ?? null,
      promo?.label ?? null,
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
