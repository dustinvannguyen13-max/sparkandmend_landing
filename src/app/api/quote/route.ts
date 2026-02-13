import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { calculateQuote, type QuoteInput } from "@/utils/quote";
import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";
import { APP_DOMAIN } from "@/utils/constants/site";

interface QuoteContact {
  name: string;
  email: string;
  phone: string;
  preferredContact?: string;
  postcode?: string;
  address?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
}

interface QuoteRequestBody {
  input: QuoteInput;
  contact: QuoteContact;
  source?: {
    path?: string;
  };
}

const insertInquiryRow = async (payload: Record<string, unknown>) => {
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
    throw new Error(text || "Unable to save inquiry.");
  }

  return response.json();
};

const buildCustomerEmailBody = (
  reference: string,
  contact: QuoteContact,
  quoteSummary: ReturnType<typeof calculateQuote>,
) => {
  return [
    `Thanks ${contact.name}, we have received your quote request.`,
    ``,
    `Reference: ${reference}`,
    `Service: ${quoteSummary.serviceLabel}`,
    `Property: ${quoteSummary.propertySummary}`,
    `Frequency: ${quoteSummary.frequencyLabel}`,
    `Estimated price: £${quoteSummary.perVisitPrice.toFixed(0)} per visit`,
    ``,
    `Manage your booking: ${APP_DOMAIN}/my-booking?reference=${reference}`,
  ]
    .filter(Boolean)
    .join("\n");
};

const formatEmailBody = (
  input: QuoteInput,
  contact: QuoteContact,
  quoteSummary: ReturnType<typeof calculateQuote>
) => {
  return [
    `New cleaning quote request`,
    ``,
    `Service: ${quoteSummary.serviceLabel}`,
    `Property: ${quoteSummary.propertySummary}`,
    `Frequency: ${quoteSummary.frequencyLabel}`,
    `Price: £${quoteSummary.perVisitPrice.toFixed(0)} per visit`,
    quoteSummary.addOns.length > 0
      ? `Add-ons: ${quoteSummary.addOns.join(", ")}`
      : `Add-ons: None`,
    quoteSummary.monthlyEstimate
      ? `Estimated monthly: £${quoteSummary.monthlyEstimate.toFixed(0)}`
      : `Estimated monthly: N/A`,
    ``,
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `Phone: ${contact.phone}`,
    contact.preferredContact
      ? `Preferred contact: ${contact.preferredContact}`
      : null,
    contact.postcode ? `Postcode: ${contact.postcode}` : null,
    contact.address ? `Address: ${contact.address}` : null,
    contact.preferredDate ? `Preferred date: ${contact.preferredDate}` : null,
    contact.preferredTime ? `Preferred time: ${contact.preferredTime}` : null,
    contact.notes ? `Notes: ${contact.notes}` : null,
    input.customExtras ? `Custom requests: ${input.customExtras}` : null,
    input.customExtrasSummary
      ? `Custom extras summary: ${input.customExtrasSummary}`
      : null,
    input.customExtrasPrice
      ? `Custom extras estimate: £${Number(input.customExtrasPrice).toFixed(0)}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuoteRequestBody;

    if (!body?.input || !body?.contact) {
      return NextResponse.json(
        { error: "Missing quote details." },
        { status: 400 }
      );
    }

    const { input, contact, source } = body;

    if (!contact.name || !contact.email || !contact.phone) {
      return NextResponse.json(
        { error: "Missing required contact fields." },
        { status: 400 }
      );
    }

    const quoteSummary = calculateQuote(input);
    const reference = `SMQ-${randomUUID().split("-")[0].toUpperCase()}`;
    const deliveries = {
      database: false,
      webhook: false,
      email: false,
      customerEmail: false,
    };
    const inquiryPayload = {
      reference,
      service: quoteSummary.serviceLabel,
      property_summary: quoteSummary.propertySummary,
      frequency: quoteSummary.frequencyLabel,
      per_visit_price: quoteSummary.perVisitPrice,
      extras: input.extras ?? [],
      custom_extras_items: quoteSummary.customExtrasItems ?? [],
      custom_extras_text: quoteSummary.customExtrasText ?? "",
      custom_extras_reason: quoteSummary.customExtrasReason ?? "",
      custom_extras_source: quoteSummary.customExtrasSource ?? "",
      custom_extras_fallback_reason: quoteSummary.customExtrasFallbackReason ?? "",
      custom_extras_price: quoteSummary.customExtrasPrice ?? 0,
      contact_name: contact.name,
      contact_email: contact.email,
      contact_phone: contact.phone,
      contact_postcode: contact.postcode ?? "",
      contact_address: contact.address ?? "",
      contact_method: contact.preferredContact ?? "",
      preferred_date: contact.preferredDate ?? null,
      preferred_time: contact.preferredTime ?? null,
      notes: contact.notes ?? "",
      status: "pending",
    };

    await insertInquiryRow(inquiryPayload);
    deliveries.database = true;

    const payload = {
      submittedAt: new Date().toISOString(),
      reference,
      input,
      contact,
      summary: quoteSummary,
      source,
    };

    const webhookUrl = process.env.QUOTE_WEBHOOK_URL;
    const webhookSecret = process.env.QUOTE_WEBHOOK_SECRET;
    if (webhookUrl) {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(webhookSecret ? { "X-Webhook-Secret": webhookSecret } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!webhookResponse.ok) {
        return NextResponse.json(
          { error: "Failed to send webhook." },
          { status: 502 }
        );
      }
      deliveries.webhook = true;
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.QUOTE_EMAIL_TO;
    const emailFrom =
      process.env.QUOTE_EMAIL_FROM || "Spark & Mend <quotes@sparkandmend.com>";
    if (resendApiKey && emailTo) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [emailTo],
          subject: `New quote request - ${contact.name} (${reference})`,
          text: formatEmailBody(input, contact, quoteSummary),
        }),
      });

      if (!emailResponse.ok) {
        return NextResponse.json(
          { error: "Failed to send email." },
          { status: 502 }
        );
      }
      deliveries.email = true;
    }

    if (resendApiKey && contact.email) {
      const customerEmailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [contact.email],
          subject: `Your Spark & Mend quote reference ${reference}`,
          text: buildCustomerEmailBody(reference, contact, quoteSummary),
        }),
      });

      if (customerEmailResponse.ok) {
        deliveries.customerEmail = true;
      }
    }

    return NextResponse.json({ ok: true, deliveries, reference });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to process quote request." },
      { status: 500 }
    );
  }
}
