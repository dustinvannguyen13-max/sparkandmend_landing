import { Buffer } from "buffer";
import { NextResponse } from "next/server";

import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";
import { APP_DOMAIN } from "@/utils/constants/site";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const buildStripeHeaders = () => {
  if (!STRIPE_SECRET_KEY) {
    return null;
  }
  const encoded = Buffer.from(`${STRIPE_SECRET_KEY}:`).toString("base64");
  return {
    Authorization: `Basic ${encoded}`,
  };
};

const fetchStripeSession = async (sessionId: string) => {
  const headers = buildStripeHeaders();
  if (!headers) {
    throw new Error("Missing Stripe secret key.");
  }

  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${sessionId}?expand[]=subscription`,
    { headers },
  );
  if (!response.ok) {
    const payload = await response.json();
    throw new Error(payload.error?.message || "Stripe lookup failed.");
  }

  return response.json();
};

const fetchStripeSubscription = async (subscriptionId: string) => {
  const headers = buildStripeHeaders();
  if (!headers) {
    throw new Error("Missing Stripe secret key.");
  }

  const response = await fetch(
    `https://api.stripe.com/v1/subscriptions/${subscriptionId}`,
    { headers },
  );
  if (!response.ok) {
    const payload = await response.json();
    throw new Error(payload.error?.message || "Stripe subscription lookup failed.");
  }

  return response.json();
};

const fetchSeriesIdByReference = async (reference: string) => {
  if (!supabaseConfig.url || !supabaseHeaders) {
    return null;
  }
  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/bookings?reference=eq.${encodeURIComponent(
      reference,
    )}&select=series_id`,
    { headers: supabaseHeaders },
  );
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as Array<{ series_id?: string | null }>;
  return data[0]?.series_id ?? null;
};

const updateSeries = async (seriesId: string, updates: Record<string, unknown>) => {
  if (!supabaseConfig.url || !supabaseHeaders) {
    return null;
  }
  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/bookings?series_id=eq.${encodeURIComponent(
      seriesId,
    )}`,
    {
      method: "PATCH",
      headers: supabaseHeaders,
      body: JSON.stringify(updates),
    },
  );
  if (!response.ok) {
    return null;
  }
  return response.json();
};

const updateBookingStatus = async (
  reference: string,
  sessionId: string,
  payment_amount: number,
  payment_currency: string,
  updates: Record<string, unknown> = {},
) => {
  if (!supabaseConfig.url || !supabaseHeaders) {
    return null;
  }

  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/bookings?reference=eq.${encodeURIComponent(reference)}`,
    {
      method: "PATCH",
      headers: supabaseHeaders,
      body: JSON.stringify({
        status: "paid",
        stripe_session_id: sessionId,
        payment_amount,
        payment_currency,
        ...updates,
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Could not update booking status.");
  }

  return response.json();
};

const sendPaymentEmail = async (booking: Record<string, unknown>) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom =
    process.env.QUOTE_EMAIL_FROM || "Spark & Mend <quotes@sparkandmend.com>";
  const contactEmail = booking.contact_email as string | undefined;

  if (!resendApiKey || !contactEmail) return;

  const reference = booking.reference as string;
  const service = booking.service as string;
  const property = booking.property_summary as string;
  const amount = booking.payment_amount as number | undefined;
  const currency = (booking.payment_currency as string | undefined) ?? "GBP";

  const body = [
    `Thanks ${booking.contact_name || ""}, your payment has been received.`,
    ``,
    `Reference: ${reference}`,
    service ? `Service: ${service}` : null,
    property ? `Property: ${property}` : null,
    amount ? `Paid: £${amount} ${currency}` : null,
    ``,
    `Manage your booking: ${APP_DOMAIN}/my-booking?reference=${reference}`,
  ]
    .filter(Boolean)
    .join("\n");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: emailFrom,
      to: [contactEmail],
      subject: `Payment received for ${reference}`,
      text: body,
    }),
  });
};

export async function POST(request: Request) {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY environment variable." },
      { status: 400 },
    );
  }

  const body = (await request.json()) as {
    sessionId?: string;
    reference?: string;
  };

  if (!body.sessionId || !body.reference) {
    return NextResponse.json(
      { error: "Missing session_id or reference." },
      { status: 400 },
    );
  }

  try {
    const stripeSession = await fetchStripeSession(body.sessionId);
    const sessionReference = (stripeSession.metadata as Record<string, string> | undefined)
      ?.reference;
    if (!sessionReference || sessionReference !== body.reference) {
      return NextResponse.json(
        { error: "Session reference mismatch." },
        { status: 400 },
      );
    }
    if (stripeSession.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment was not completed." },
        { status: 400 },
      );
    }

    const amount =
      typeof stripeSession.amount_total === "number"
        ? stripeSession.amount_total / 100
        : 0;
    const currency = stripeSession.currency || "GBP";

    const subscriptionId = stripeSession.subscription as string | undefined;
    if (stripeSession.mode === "subscription" && subscriptionId) {
      const subscription = await fetchStripeSubscription(subscriptionId);
      const subscriptionStatus = subscription.status as string | undefined;
      const currentPeriodEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null;

      const updated = await updateBookingStatus(
        body.reference,
        body.sessionId,
        amount,
        currency,
        {
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: stripeSession.customer as string | undefined,
          stripe_subscription_status: subscriptionStatus ?? "active",
          stripe_current_period_end: currentPeriodEnd,
        },
      );

      const seriesId = await fetchSeriesIdByReference(body.reference);
      if (seriesId) {
        await updateSeries(seriesId, {
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: stripeSession.customer as string | undefined,
          stripe_subscription_status: subscriptionStatus ?? "active",
          stripe_current_period_end: currentPeriodEnd,
        });
      }

      if (!updated || !updated.length) {
        return NextResponse.json(
          { error: "Booking not found." },
          { status: 404 },
        );
      }

      try {
        await sendPaymentEmail(updated[0]);
      } catch {
        // Email failures should not block booking confirmation.
      }

      return NextResponse.json({ booking: updated[0] });
    }

    const updated = await updateBookingStatus(
      body.reference,
      body.sessionId,
      amount,
      currency,
    );

    if (!updated || !updated.length) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 },
      );
    }

    try {
      await sendPaymentEmail(updated[0]);
    } catch {
      // Email failures should not block booking confirmation.
    }

    return NextResponse.json({ booking: updated[0] });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
