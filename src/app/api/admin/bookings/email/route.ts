import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";
import { sendBookingEmail } from "@/lib/booking-email";

export async function POST(request: Request) {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      reference?: string;
      to?: string;
      subject?: string;
      body?: string;
    };

    const reference = body.reference?.trim();
    const subject = body.subject?.trim();
    const emailBody = body.body?.trim();

    if (!subject || !emailBody) {
      return NextResponse.json(
        { error: "Subject and body are required." },
        { status: 400 },
      );
    }

    let recipient = body.to?.trim();

    if (!recipient && reference) {
      if (!supabaseConfig.url || !supabaseHeaders) {
        return NextResponse.json(
          { error: "Supabase configuration is missing." },
          { status: 500 },
        );
      }

      const response = await fetch(
        `${supabaseConfig.url}/rest/v1/bookings?reference=eq.${encodeURIComponent(
          reference,
        )}&select=contact_email`,
        { headers: supabaseHeaders },
      );
      if (!response.ok) {
        const text = await response.text();
        return NextResponse.json(
          { error: text || "Unable to fetch booking." },
          { status: 502 },
        );
      }
      const data = (await response.json()) as Array<{ contact_email?: string }>;
      recipient = data[0]?.contact_email?.trim();
    }

    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient email is required." },
        { status: 400 },
      );
    }

    const result = await sendBookingEmail({
      to: recipient,
      subject,
      body: emailBody,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error || "Unable to send email." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unable to send email." },
      { status: 500 },
    );
  }
}
