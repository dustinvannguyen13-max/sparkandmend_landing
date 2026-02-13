import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { calculateQuote, type QuoteInput } from "@/utils/quote";
import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";
import { APP_DOMAIN } from "@/utils/constants/site";
import { applyOfferToQuote, getActiveOffer } from "@/lib/offers";
import {
  applyFreeBathroomPromo,
  isFirstTimeCustomer,
} from "@/lib/booking-promos";
import { buildSeriesDates, buildSeriesReferences } from "@/lib/booking-series";

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

const insertInquiryRow = async (
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
    throw new Error(text || "Unable to save inquiry.");
  }

  return response.json();
};

const buildCustomerEmailBody = (
  reference: string,
  contact: QuoteContact,
  quoteSummary: ReturnType<typeof calculateQuote>,
  offerSummary: ReturnType<typeof applyOfferToQuote>["offerSummary"],
  firstVisitPrice?: number,
  freeBathroomPromo?: ReturnType<typeof applyFreeBathroomPromo>["promo"],
) => {
  return [
    `Thanks ${contact.name}, we have received your booking request.`,
    ``,
    `Reference: ${reference}`,
    `Service: ${quoteSummary.serviceLabel}`,
    `Property: ${quoteSummary.propertySummary}`,
    `Frequency: ${quoteSummary.frequencyLabel}`,
    `Estimated price: £${quoteSummary.perVisitPrice.toFixed(0)} per visit`,
    offerSummary
      ? `Offer applied: ${offerSummary.title} (-£${offerSummary.discountAmount.toFixed(0)})`
      : null,
    freeBathroomPromo && typeof firstVisitPrice === "number"
      ? `First-time bonus: ${freeBathroomPromo.label} (-£${freeBathroomPromo.discountAmount.toFixed(0)})`
      : null,
    freeBathroomPromo && typeof firstVisitPrice === "number"
      ? `First visit total: £${firstVisitPrice.toFixed(0)}`
      : null,
    ``,
    `Manage your booking: ${APP_DOMAIN}/my-booking?reference=${reference}`,
  ]
    .filter(Boolean)
    .join("\n");
};

const formatEmailBody = (
  input: QuoteInput,
  contact: QuoteContact,
  quoteSummary: ReturnType<typeof calculateQuote>,
  offerSummary: ReturnType<typeof applyOfferToQuote>["offerSummary"],
  firstVisitPrice?: number,
  freeBathroomPromo?: ReturnType<typeof applyFreeBathroomPromo>["promo"]
) => {
  return [
    `New cleaning booking request`,
    ``,
    `Service: ${quoteSummary.serviceLabel}`,
    `Property: ${quoteSummary.propertySummary}`,
    `Frequency: ${quoteSummary.frequencyLabel}`,
    `Price: £${quoteSummary.perVisitPrice.toFixed(0)} per visit`,
    offerSummary
      ? `Offer applied: ${offerSummary.title} (-£${offerSummary.discountAmount.toFixed(0)})`
      : null,
    freeBathroomPromo && typeof firstVisitPrice === "number"
      ? `First-time bonus: ${freeBathroomPromo.label} (-£${freeBathroomPromo.discountAmount.toFixed(0)})`
      : null,
    freeBathroomPromo && typeof firstVisitPrice === "number"
      ? `First visit total: £${firstVisitPrice.toFixed(0)}`
      : null,
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

    const baseQuoteSummary = calculateQuote(input);
    const activeOffer = await getActiveOffer();
    const { quote: quoteSummary, offerSummary } = applyOfferToQuote(
      baseQuoteSummary,
      activeOffer,
    );
    const isFirstTime = await isFirstTimeCustomer(
      contact.email,
      contact.address,
    );
    const { firstVisitPrice, promo: freeBathroomPromo } =
      applyFreeBathroomPromo(quoteSummary, input, isFirstTime);
    const reference = `SMQ-${randomUUID().split("-")[0].toUpperCase()}`;
    const frequencyKey = input.service === "advanced" ? "one-time" : input.frequency;
    const hasSchedule = frequencyKey !== "one-time" && Boolean(contact.preferredDate);
    const seriesId = hasSchedule ? randomUUID() : null;
    const computedSeriesDates = hasSchedule
      ? buildSeriesDates(contact.preferredDate as string, frequencyKey)
      : [contact.preferredDate ?? null];
    const seriesDates =
      computedSeriesDates.length > 0 ? computedSeriesDates : [contact.preferredDate ?? null];
    const seriesReferences = hasSchedule
      ? buildSeriesReferences(reference, seriesDates.length)
      : [reference];
    const deliveries = {
      database: false,
      webhook: false,
      email: false,
      customerEmail: false,
    };
    const inquiryPayload = {
      reference,
      series_id: seriesId,
      series_reference: seriesId ? reference : null,
      series_index: 0,
      service: quoteSummary.serviceLabel,
      property_summary: quoteSummary.propertySummary,
      frequency: quoteSummary.frequencyLabel,
      frequency_key: frequencyKey,
      per_visit_price: quoteSummary.perVisitPrice,
      extras: input.extras ?? [],
      custom_extras_items: quoteSummary.customExtrasItems ?? [],
      custom_extras_text: quoteSummary.customExtrasText ?? "",
      custom_extras_reason: quoteSummary.customExtrasReason ?? "",
      custom_extras_source: quoteSummary.customExtrasSource ?? "",
      custom_extras_fallback_reason: quoteSummary.customExtrasFallbackReason ?? "",
      custom_extras_price: quoteSummary.customExtrasPrice ?? 0,
      promo_type: freeBathroomPromo?.type ?? "",
      promo_label: freeBathroomPromo?.label ?? "",
      promo_discount: freeBathroomPromo?.discountAmount ?? 0,
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

    const payloads = seriesDates.map((date, index) => ({
      ...inquiryPayload,
      reference: seriesReferences[index] ?? reference,
      series_index: seriesId ? index : 0,
      preferred_date: date,
    }));

    await insertInquiryRow(payloads);
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
          subject: `New booking request - ${contact.name} (${reference})`,
          text: formatEmailBody(
            input,
            contact,
            quoteSummary,
            offerSummary,
            firstVisitPrice,
            freeBathroomPromo,
          ),
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
          subject: `Your Spark & Mend booking reference ${reference}`,
          text: buildCustomerEmailBody(
            reference,
            contact,
            quoteSummary,
            offerSummary,
            firstVisitPrice,
            freeBathroomPromo,
          ),
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
