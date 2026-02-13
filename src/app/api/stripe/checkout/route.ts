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
    )}&select=reference,series_id,series_reference,series_index,frequency,frequency_key,service,property_summary,per_visit_price,promo_label,promo_discount,contact_email,stripe_subscription_id`,
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

const createStripeSession = async ({
  reference,
  amount,
  service,
  propertySummary,
  mode,
  interval,
  intervalCount,
  offerLabel,
  promoLabel,
  couponId,
  customerEmail,
  metadata,
}: {
  reference: string;
  amount: number;
  service: string;
  propertySummary: string;
  mode: "payment" | "subscription";
  interval?: "week" | "month";
  intervalCount?: number;
  offerLabel?: string | null;
  promoLabel?: string | null;
  couponId?: string | null;
  customerEmail?: string | null;
  metadata?: Record<string, string>;
}) => {
  const headers = buildStripeHeaders();
  if (!headers) {
    throw new Error("Missing Stripe secret key.");
  }

  const form = new URLSearchParams();
  form.append("payment_method_types[]", "card");
  form.append("mode", mode);
  form.append("line_items[0][price_data][currency]", "gbp");
  form.append(
    "line_items[0][price_data][product_data][name]",
    `Spark & Mend booking ${reference}`,
  );
  form.append(
    "line_items[0][price_data][product_data][description]",
    `${service} • ${propertySummary}`,
  );
  form.append(
    "line_items[0][price_data][unit_amount]",
    String(Math.round(amount * 100)),
  );
  form.append("line_items[0][quantity]", "1");
  if (mode === "subscription") {
    form.append("line_items[0][price_data][recurring][interval]", interval ?? "week");
    if (intervalCount && intervalCount > 1) {
      form.append(
        "line_items[0][price_data][recurring][interval_count]",
        String(intervalCount),
      );
    }
  }
  form.append(
    "success_url",
    `${APP_DOMAIN_BASE}/booking-confirmation?session_id={CHECKOUT_SESSION_ID}&reference=${reference}&mode=${mode}`,
  );
  form.append(
    "cancel_url",
    `${APP_DOMAIN_BASE}/your-cleaning-quote?reference=${reference}`,
  );
  form.append("metadata[reference]", reference);
  if (mode === "subscription") {
    form.append("subscription_data[metadata][reference]", reference);
  }
  if (offerLabel) {
    form.append("metadata[offer]", offerLabel);
  }
  if (promoLabel) {
    form.append("metadata[promo]", promoLabel);
  }
  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      form.append(`metadata[${key}]`, value);
    });
    if (mode === "subscription") {
      Object.entries(metadata).forEach(([key, value]) => {
        form.append(`subscription_data[metadata][${key}]`, value);
      });
    }
  }
  if (couponId) {
    form.append("discounts[0][coupon]", couponId);
  }
  if (customerEmail) {
    form.append("customer_email", customerEmail);
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

const createStripeCoupon = async (amountOff: number) => {
  const headers = buildStripeHeaders();
  if (!headers) {
    throw new Error("Missing Stripe secret key.");
  }
  const form = new URLSearchParams();
  form.append("amount_off", String(Math.round(amountOff * 100)));
  form.append("currency", "gbp");
  form.append("duration", "once");
  form.append("name", "FREE bathroom clean");

  const response = await fetch("https://api.stripe.com/v1/coupons", {
    method: "POST",
    headers,
    body: form,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || "Stripe coupon creation failed.");
  }
  return payload;
};

const getSubscriptionInterval = (
  frequencyKey: string,
): { interval: "week" | "month"; intervalCount: number } => {
  if (frequencyKey === "weekly") {
    return { interval: "week", intervalCount: 1 };
  }
  if (frequencyKey === "bi-weekly") {
    return { interval: "week", intervalCount: 2 };
  }
  return { interval: "month", intervalCount: 1 };
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
        frequency?: "one-time" | "weekly" | "bi-weekly" | "monthly";
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
      if (existing.stripe_subscription_id) {
        return NextResponse.json(
          { error: "This booking already has an active subscription." },
          { status: 400 },
        );
      }

      const storedAmount = Number(existing.per_visit_price);
      const promoDiscount = Number(existing.promo_discount ?? 0);
      const frequencyKey =
        getFrequencyKey(
          (existing.frequency_key as string | null) ??
            (existing.frequency as string | null),
        ) ?? "one-time";
      const isSubscription = frequencyKey !== "one-time";

      const amount = Math.max(0, storedAmount);
      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json(
          { error: "A valid payment amount is required." },
          { status: 400 },
        );
      }

      let couponId: string | null = null;
      const discountAmount = Math.min(
        Math.max(0, promoDiscount),
        Math.max(0, amount),
      );
      if (isSubscription && discountAmount > 0) {
        const coupon = await createStripeCoupon(discountAmount);
        couponId = coupon.id ?? null;
      }

      const serviceLabel = (existing.service as string) ?? "Cleaning service";
      const propertySummary =
        (existing.property_summary as string) ?? "Cleaning booking";
      const { interval, intervalCount } = getSubscriptionInterval(frequencyKey);

      const session = await createStripeSession({
        reference,
        amount: isSubscription ? amount : Math.max(0, amount - discountAmount),
        service: serviceLabel,
        propertySummary,
        mode: isSubscription ? "subscription" : "payment",
        interval: isSubscription ? interval : undefined,
        intervalCount: isSubscription ? intervalCount : undefined,
        promoLabel: (existing.promo_label as string | null) ?? null,
        couponId,
        customerEmail: (existing.contact_email as string | null) ?? null,
        metadata: {
          frequency: frequencyKey,
          series_reference: (existing.series_reference as string | null) ?? "",
        },
      });
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
    const inferredFrequencyKey =
      body.input?.frequency ??
      (getFrequencyKey(body.quote.frequencyLabel as string | null) ?? "one-time");
    const frequencyKey =
      body.input?.service === "advanced" ? "one-time" : inferredFrequencyKey;
    const frequencyLabel =
      getFrequencyLabel(frequencyKey) ?? (body.quote.frequencyLabel as string);
    const isSubscription = frequencyKey !== "one-time";

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

    let couponId: string | null = null;
    if (isSubscription && promo?.discountAmount) {
      const coupon = await createStripeCoupon(promo.discountAmount);
      couponId = coupon.id ?? null;
    }

    const { interval, intervalCount } = getSubscriptionInterval(frequencyKey);
    const session = await createStripeSession({
      reference,
      amount: isSubscription ? offerResult.finalPrice : firstVisitPrice,
      service: body.quote.serviceLabel ?? "Cleaning service",
      propertySummary: body.quote.propertySummary ?? "Cleaning booking",
      mode: isSubscription ? "subscription" : "payment",
      interval: isSubscription ? interval : undefined,
      intervalCount: isSubscription ? intervalCount : undefined,
      offerLabel: offerResult.offerSummary?.label ?? null,
      promoLabel: promo?.label ?? null,
      couponId,
      customerEmail: body.contact?.email ?? null,
      metadata: {
        frequency: frequencyKey,
        series_reference: seriesId ? reference : "",
      },
    });
    await patchBookingStripeId(reference, session.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unable to create checkout." },
      { status: 500 },
    );
  }
}
