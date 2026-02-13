import { Buffer } from "buffer";
import { NextResponse } from "next/server";
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

const createPortalSession = async (customerId: string, returnUrl: string) => {
  const headers = buildStripeHeaders();
  if (!headers) {
    throw new Error("Missing Stripe secret key.");
  }

  const form = new URLSearchParams();
  form.append("customer", customerId);
  form.append("return_url", returnUrl);

  const response = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
    method: "POST",
    headers,
    body: form,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || "Stripe portal session failed.");
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
      reference?: string;
      subscriptionId?: string;
      customerId?: string;
    };

    const reference = body.reference?.trim();
    let customerId = body.customerId?.trim();
    const subscriptionId = body.subscriptionId?.trim();

    if (!customerId && subscriptionId) {
      const subscription = await fetchStripeSubscription(subscriptionId);
      customerId = subscription.customer as string | undefined;
    }

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer is required for subscription management." },
        { status: 400 },
      );
    }

    const returnUrl = reference
      ? `${APP_DOMAIN_BASE}/my-booking?reference=${encodeURIComponent(reference)}`
      : `${APP_DOMAIN_BASE}/my-booking`;

    const session = await createPortalSession(customerId, returnUrl);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unable to create portal session." },
      { status: 500 },
    );
  }
}
