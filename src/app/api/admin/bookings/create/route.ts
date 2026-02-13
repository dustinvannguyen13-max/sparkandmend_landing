import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";
import { calculateQuote, type QuoteInput } from "@/utils/quote";

export async function POST(request: Request) {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!supabaseConfig.url || !supabaseHeaders) {
    return NextResponse.json(
      { error: "Supabase configuration is missing." },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as {
      input?: QuoteInput;
      contact?: {
        name?: string;
        email?: string;
        phone?: string;
        postcode?: string;
        address?: string;
        preferredContact?: string;
        preferredDate?: string;
        preferredTime?: string;
        notes?: string;
      };
      status?: "pending" | "paid" | "cancelled";
      paymentAmount?: number;
    };

    if (!body.input || !body.contact) {
      return NextResponse.json(
        { error: "Missing booking details." },
        { status: 400 },
      );
    }

    const { input, contact } = body;
    if (!contact.name || !contact.email || !contact.phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required." },
        { status: 400 },
      );
    }

    const sanitizedInput: QuoteInput = {
      ...input,
      frequency: input.service === "advanced" ? "one-time" : input.frequency,
    };

    const quote = calculateQuote(sanitizedInput);
    const status = body.status ?? "pending";
    const paymentAmount =
      status === "paid"
        ? Number(body.paymentAmount ?? quote.perVisitPrice)
        : null;

    const reference = `SMB-${randomUUID().split("-")[0].toUpperCase()}`;
    const payload = {
      reference,
      service: quote.serviceLabel,
      property_summary: quote.propertySummary,
      frequency: quote.frequencyLabel,
      per_visit_price: quote.perVisitPrice,
      extras: sanitizedInput.extras ?? [],
      custom_extras_items: quote.customExtrasItems ?? [],
      custom_extras_text: quote.customExtrasText ?? "",
      custom_extras_reason: quote.customExtrasReason ?? "",
      custom_extras_source: quote.customExtrasSource ?? "",
      custom_extras_fallback_reason: quote.customExtrasFallbackReason ?? "",
      custom_extras_price: quote.customExtrasPrice ?? 0,
      contact_name: contact.name,
      contact_email: contact.email,
      contact_phone: contact.phone,
      contact_postcode: contact.postcode ?? "",
      contact_address: contact.address ?? "",
      contact_method: contact.preferredContact ?? "",
      preferred_date: contact.preferredDate ?? null,
      preferred_time: contact.preferredTime ?? null,
      notes: contact.notes ?? "",
      status,
      payment_amount: paymentAmount,
      payment_currency: paymentAmount ? "GBP" : null,
      promo_type: "",
      promo_label: "",
      promo_discount: 0,
    };

    const response = await fetch(`${supabaseConfig.url}/rest/v1/bookings`, {
      method: "POST",
      headers: supabaseHeaders,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: text || "Unable to create booking." },
        { status: 502 },
      );
    }

    const data = (await response.json()) as Array<Record<string, unknown>>;
    return NextResponse.json({ booking: data[0] ?? payload });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unable to create booking." },
      { status: 500 },
    );
  }
}
