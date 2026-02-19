import { Buffer } from "buffer";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";

export const runtime = "nodejs";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const buildStripeHeaders = () => {
  if (!STRIPE_SECRET_KEY) {
    return null;
  }
  const encoded = Buffer.from(`${STRIPE_SECRET_KEY}:`).toString("base64");
  return {
    Authorization: `Basic ${encoded}`,
  };
};

const verifyStripeSignature = (payload: string, signature: string, secret: string) => {
  const items = signature.split(",");
  const timestamp = items
    .find((item) => item.startsWith("t="))
    ?.replace("t=", "");
  const signatures = items
    .filter((item) => item.startsWith("v1="))
    .map((item) => item.replace("v1=", ""));

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  return signatures.some((sig) => sig === expected);
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

const fetchBookingByReference = async (reference: string) => {
  if (!supabaseConfig.url || !supabaseHeaders) {
    throw new Error("Supabase configuration is missing.");
  }
  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/bookings?reference=eq.${encodeURIComponent(
      reference,
    )}&select=reference,series_id`,
    { headers: supabaseHeaders },
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to fetch booking.");
  }
  const data = (await response.json()) as Array<{ series_id?: string | null }>;
  return data[0] ?? null;
};

const updateBookingByReference = async (
  reference: string,
  updates: Record<string, unknown>,
) => {
  if (!supabaseConfig.url || !supabaseHeaders) {
    throw new Error("Supabase configuration is missing.");
  }

  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/bookings?reference=eq.${encodeURIComponent(
      reference,
    )}`,
    {
      method: "PATCH",
      headers: supabaseHeaders,
      body: JSON.stringify(updates),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to update booking.");
  }

  return response.json();
};

const updateSeriesById = async (seriesId: string, updates: Record<string, unknown>) => {
  if (!supabaseConfig.url || !supabaseHeaders) {
    throw new Error("Supabase configuration is missing.");
  }
  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/bookings?series_id=eq.${encodeURIComponent(seriesId)}`,
    {
      method: "PATCH",
      headers: supabaseHeaders,
      body: JSON.stringify(updates),
    },
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to update booking series.");
  }
  return response.json();
};

const fetchSeriesBySubscription = async (subscriptionId: string) => {
  if (!supabaseConfig.url || !supabaseHeaders) {
    throw new Error("Supabase configuration is missing.");
  }
  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/bookings?stripe_subscription_id=eq.${encodeURIComponent(
      subscriptionId,
    )}&select=series_id&limit=1`,
    { headers: supabaseHeaders },
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to fetch subscription series.");
  }
  const data = (await response.json()) as Array<{ series_id?: string | null }>;
  return data[0]?.series_id ?? null;
};

const markNextBookingPaid = async (
  seriesId: string,
  amount: number,
  currency: string,
  invoiceId?: string,
) => {
  if (!supabaseConfig.url || !supabaseHeaders) {
    throw new Error("Supabase configuration is missing.");
  }

  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);

  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/bookings?series_id=eq.${encodeURIComponent(
      seriesId,
    )}&status=eq.pending&preferred_date=gte.${todayKey}&order=preferred_date.asc&limit=1`,
    { headers: supabaseHeaders },
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to fetch next booking.");
  }

  const data = (await response.json()) as Array<{ reference?: string }>;
  const reference = data[0]?.reference;
  if (!reference) {
    return null;
  }

  const updateResponse = await fetch(
    `${supabaseConfig.url}/rest/v1/bookings?reference=eq.${encodeURIComponent(
      reference,
    )}`,
    {
      method: "PATCH",
      headers: supabaseHeaders,
      body: JSON.stringify({
        status: "paid",
        payment_amount: amount,
        payment_currency: currency,
        stripe_invoice_id: invoiceId ?? null,
      }),
    },
  );

  if (!updateResponse.ok) {
    const text = await updateResponse.text();
    throw new Error(text || "Unable to update booking payment.");
  }

  return updateResponse.json();
};

export async function POST(request: Request) {
  if (!STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const payload = await request.text();
  const isValid = verifyStripeSignature(payload, signature, STRIPE_WEBHOOK_SECRET);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(payload);
  const eventType = event.type as string;

  try {
    if (eventType === "checkout.session.completed") {
      const session = event.data.object as Record<string, unknown>;
      const reference = (session.metadata as Record<string, string>)?.reference;

      if (!reference) {
        return NextResponse.json({ received: true });
      }

      if (session.mode === "payment") {
        const amountPaid =
          typeof session.amount_total === "number" ? session.amount_total / 100 : 0;
        const currency = (session.currency as string | undefined) ?? "GBP";

        await updateBookingByReference(reference, {
          status: "paid",
          stripe_session_id: session.id as string | undefined,
          payment_amount: amountPaid,
          payment_currency: currency,
        });

        return NextResponse.json({ received: true });
      }

      if (session.mode === "subscription") {
        const subscriptionId = session.subscription as string | undefined;
        if (!subscriptionId) {
          return NextResponse.json({ received: true });
        }

        const booking = await fetchBookingByReference(reference);
        if (!booking?.series_id) {
          return NextResponse.json({ received: true });
        }

        const subscription = await fetchStripeSubscription(subscriptionId);
        const subscriptionStatus = subscription.status as string | undefined;
        const currentPeriodEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null;

        await updateSeriesById(booking.series_id, {
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: session.customer as string | undefined,
          stripe_subscription_status: subscriptionStatus ?? "active",
          stripe_current_period_end: currentPeriodEnd,
        });
      }

      return NextResponse.json({ received: true });
    }

    if (eventType === "invoice.paid") {
      const invoice = event.data.object as Record<string, unknown>;
      const subscriptionId = invoice.subscription as string | undefined;
      if (!subscriptionId) {
        return NextResponse.json({ received: true });
      }

      const seriesId = await fetchSeriesBySubscription(subscriptionId);
      if (!seriesId) {
        return NextResponse.json({ received: true });
      }

      const amountPaid =
        typeof invoice.amount_paid === "number" ? invoice.amount_paid / 100 : 0;
      const currency = (invoice.currency as string | undefined) ?? "GBP";

      await markNextBookingPaid(
        seriesId,
        amountPaid,
        currency,
        invoice.id as string | undefined,
      );

      const subscription = await fetchStripeSubscription(subscriptionId);
      const subscriptionStatus = subscription.status as string | undefined;
      const currentPeriodEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null;
      await updateSeriesById(seriesId, {
        stripe_subscription_id: subscriptionId,
        stripe_subscription_status: subscriptionStatus ?? "active",
        stripe_current_period_end: currentPeriodEnd,
      });

      return NextResponse.json({ received: true });
    }

    if (eventType === "invoice.payment_failed") {
      const invoice = event.data.object as Record<string, unknown>;
      const subscriptionId = invoice.subscription as string | undefined;
      if (!subscriptionId) {
        return NextResponse.json({ received: true });
      }
      const seriesId = await fetchSeriesBySubscription(subscriptionId);
      if (!seriesId) {
        return NextResponse.json({ received: true });
      }
      await updateSeriesById(seriesId, { stripe_subscription_status: "past_due" });
      return NextResponse.json({ received: true });
    }

    if (
      eventType === "customer.subscription.updated" ||
      eventType === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Record<string, unknown>;
      const subscriptionId = subscription.id as string | undefined;
      if (!subscriptionId) {
        return NextResponse.json({ received: true });
      }
      const seriesId = await fetchSeriesBySubscription(subscriptionId);
      if (!seriesId) {
        return NextResponse.json({ received: true });
      }
      const subscriptionStatus = subscription.status as string | undefined;
      const currentPeriodEnd = subscription.current_period_end
        ? new Date((subscription.current_period_end as number) * 1000).toISOString()
        : null;
      await updateSeriesById(seriesId, {
        stripe_subscription_id: subscriptionId,
        stripe_subscription_status:
          subscriptionStatus ?? (eventType === "customer.subscription.deleted" ? "cancelled" : ""),
        stripe_current_period_end: currentPeriodEnd,
      });
      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Webhook error." },
      { status: 500 },
    );
  }
}
