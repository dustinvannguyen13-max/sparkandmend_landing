import { Buffer } from "buffer";
import { NextResponse } from "next/server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const APP_DOMAIN = (process.env.NEXT_PUBLIC_APP_DOMAIN || "http://localhost:3000").replace(
  /\/$/,
  "",
);
const TEST_CHECKOUT_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_STRIPE_TEST_BUTTON === "true";

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

const createStripeSession = async () => {
  const headers = buildStripeHeaders();
  if (!headers) {
    throw new Error("Missing Stripe secret key.");
  }

  const form = new URLSearchParams();
  form.append("payment_method_types[]", "card");
  form.append("mode", "payment");
  form.append("line_items[0][price_data][currency]", "gbp");
  form.append("line_items[0][price_data][product_data][name]", "Spark & Mend test payment");
  form.append(
    "line_items[0][price_data][product_data][description]",
    "Temporary £1 test checkout session.",
  );
  form.append("line_items[0][price_data][unit_amount]", "100");
  form.append("line_items[0][quantity]", "1");
  form.append("success_url", `${APP_DOMAIN}/get-a-quote?stripeTest=success`);
  form.append("cancel_url", `${APP_DOMAIN}/get-a-quote?stripeTest=cancel`);
  form.append("metadata[test_payment]", "true");

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

export async function POST() {
  if (!TEST_CHECKOUT_ENABLED) {
    return NextResponse.json(
      { error: "Test checkout is disabled." },
      { status: 403 },
    );
  }

  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY environment variable." },
      { status: 400 },
    );
  }

  try {
    const session = await createStripeSession();
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unable to create checkout." },
      { status: 500 },
    );
  }
}
