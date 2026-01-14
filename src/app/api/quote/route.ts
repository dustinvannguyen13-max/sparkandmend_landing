import { NextResponse } from "next/server";
import { calculateQuote, type QuoteInput } from "@/utils/quote";

interface QuoteContact {
  name: string;
  email: string;
  phone: string;
  preferredContact?: string;
  postcode?: string;
  preferredDate?: string;
  notes?: string;
}

interface QuoteRequestBody {
  input: QuoteInput;
  contact: QuoteContact;
  source?: {
    path?: string;
  };
}

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
    contact.preferredDate ? `Preferred date: ${contact.preferredDate}` : null,
    contact.notes ? `Notes: ${contact.notes}` : null,
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
    const payload = {
      submittedAt: new Date().toISOString(),
      input,
      contact,
      summary: quoteSummary,
      source,
    };

    const deliveries = {
      webhook: false,
      email: false,
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
    if (resendApiKey && emailTo) {
      const emailFrom =
        process.env.QUOTE_EMAIL_FROM || "Spark & Mend <quotes@sparkandmend.com>";
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [emailTo],
          subject: `New quote request - ${contact.name}`,
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

    return NextResponse.json({ ok: true, deliveries });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to process quote request." },
      { status: 500 }
    );
  }
}
