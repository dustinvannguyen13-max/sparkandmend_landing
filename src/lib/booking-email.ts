import { APP_DOMAIN } from "@/utils/constants/site";

type BookingRecord = {
  reference?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  service?: string | null;
  property_summary?: string | null;
  frequency?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
  notes?: string | null;
};

const formatDate = (value?: string | null) => {
  if (!value) return null;
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

const buildBookingDetails = (booking: BookingRecord) => {
  const lines = [
    booking.reference ? `Reference: ${booking.reference}` : null,
    booking.service ? `Service: ${booking.service}` : null,
    booking.property_summary ? `Property: ${booking.property_summary}` : null,
    booking.frequency ? `Schedule: ${booking.frequency}` : null,
    booking.preferred_date
      ? `Preferred date: ${formatDate(booking.preferred_date)}`
      : null,
    booking.preferred_time ? `Preferred time: ${booking.preferred_time}` : null,
    booking.notes ? `Notes: ${booking.notes}` : null,
  ];
  return lines.filter(Boolean).join("\n");
};

export const buildBookingEmail = (
  type: "amended" | "cancelled",
  booking: BookingRecord,
) => {
  const name = booking.contact_name || "there";
  const reference = booking.reference || "your booking";
  const subject =
    type === "cancelled"
      ? `Booking cancelled for ${reference}`
      : `Booking updated for ${reference}`;
  const intro =
    type === "cancelled"
      ? `Hi ${name}, your booking has been cancelled as requested.`
      : `Hi ${name}, your booking details have been updated.`;
  const details = buildBookingDetails(booking);
  const manageLink = booking.reference
    ? `${APP_DOMAIN}/my-booking?reference=${booking.reference}`
    : APP_DOMAIN;

  const body = [
    intro,
    "",
    details || null,
    "",
    `Manage your booking: ${manageLink}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, body };
};

export const sendBookingEmail = async ({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom =
    process.env.QUOTE_EMAIL_FROM || "Spark & Mend <quotes@sparkandmend.com>";

  if (!resendApiKey) {
    return { ok: false, error: "Missing RESEND_API_KEY." };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: emailFrom,
      to: [to],
      subject,
      text: body,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    return { ok: false, error: text || "Unable to send email." };
  }

  return { ok: true };
};
