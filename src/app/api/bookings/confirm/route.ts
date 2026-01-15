import { Buffer } from "buffer";
import { NextResponse } from "next/server";

import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";

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

  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
    headers,
  });
  if (!response.ok) {
    const payload = await response.json();
    throw new Error(payload.error?.message || "Stripe lookup failed.");
  }

  return response.json();
};

const updateBookingStatus = async (
  reference: string,
  sessionId: string,
  payment_amount: number,
  payment_currency: string,
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
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Could not update booking status.");
  }

  return response.json();
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

    return NextResponse.json({ booking: updated[0] });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
