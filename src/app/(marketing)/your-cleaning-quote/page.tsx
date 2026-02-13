import Link from "next/link";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/primary-button";
import { CheckListItem } from "@/components/ui/check-list";
import { Section, SectionHeader } from "@/components/ui/section";
import StripeCheckoutButton from "@/components/payment/stripe-checkout-button";
import {
  calculateQuote,
  formatCurrency,
  parseQuoteSearchParams,
} from "@/utils/quote";
import { applyOfferToQuote, getActiveOffer } from "@/lib/offers";
import { supabaseConfig, supabaseHeaders } from "@/lib/supabase";

interface QuoteResultPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const CONTACT_PHONE = "07452 824799";
const CONTACT_PHONE_LINK = "tel:07452824799";
const CONTACT_EMAIL = "sparkandmend@gmail.com";
const CONTACT_EMAIL_LINK = `mailto:${CONTACT_EMAIL}`;

const CONTACT_METHOD_LABELS: Record<string, string> = {
  text: "text message",
  whatsapp: "WhatsApp",
  call: "phone call",
  email: "email",
};

const fetchBookingPromo = async (reference?: string) => {
  if (!reference) return null;
  if (!supabaseConfig.url || !supabaseHeaders) return null;

  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/bookings?reference=eq.${encodeURIComponent(
      reference,
    )}&select=promo_label,promo_discount`,
    {
      headers: supabaseHeaders,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as Array<{
    promo_label?: string | null;
    promo_discount?: number | null;
  }>;
  return data[0] ?? null;
};

const getParam = (
  params: Record<string, string | string[] | undefined>,
  key: string
) => {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
};

const formatPreferredDate = (value?: string) => {
  if (!value) return undefined;
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return undefined;
  return `${day}/${month}/${year}`;
};

const formatPreferredTime = (value?: string) => {
  if (!value) return undefined;
  const [hour, minute] = value.split(":");
  if (!hour || !minute) return undefined;
  return `${hour}:${minute}`;
};

const buildCalendarLink = (
  preferredDate: string | undefined,
  details: string,
  location: string
) => {
  if (!preferredDate) return undefined;
  const start = preferredDate.replace(/-/g, "");
  const preferredDateObj = new Date(`${preferredDate}T00:00:00`);
  if (Number.isNaN(preferredDateObj.getTime())) return undefined;
  const endDate = new Date(preferredDateObj);
  endDate.setDate(endDate.getDate() + 1);
  const end = endDate.toISOString().slice(0, 10).replace(/-/g, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "Spark & Mend cleaning visit"
  )}&dates=${start}/${end}&details=${encodeURIComponent(
    details
  )}&location=${encodeURIComponent(location)}&add=${encodeURIComponent(
    "sparkandmend@gmail.com"
  )}`;
};

const QuoteResultPage = async ({ searchParams }: QuoteResultPageProps) => {
  const input = parseQuoteSearchParams(searchParams);
  const baseQuote = calculateQuote(input);
  const activeOffer = await getActiveOffer();
  const { quote: displayQuote, offerSummary } = applyOfferToQuote(
    baseQuote,
    activeOffer,
  );
  const referenceHint = getParam(searchParams, "reference");
  const bookingPromo = await fetchBookingPromo(referenceHint);
  const promoDiscount = Number(bookingPromo?.promo_discount ?? 0);
  const promoLabel = bookingPromo?.promo_label || "Free bathroom clean";
  const firstVisitPrice =
    promoDiscount > 0
      ? Math.max(0, displayQuote.perVisitPrice - promoDiscount)
      : null;
  const preferredDate = getParam(searchParams, "preferredDate");
  const preferredTime = getParam(searchParams, "preferredTime");
  const contactMethod = getParam(searchParams, "contactMethod");
  const contactMethodLabel = contactMethod
    ? CONTACT_METHOD_LABELS[contactMethod] || "your preferred method"
    : undefined;
  const preferredDateLabel = formatPreferredDate(preferredDate);
  const preferredTimeLabel = formatPreferredTime(preferredTime);
  const submissionStatus = Array.isArray(searchParams.submitted)
    ? searchParams.submitted[0]
    : searchParams.submitted;
  const showSubmissionWarning = submissionStatus === "0";
  const contactAddress = getParam(searchParams, "contactAddress");
  const calendarPriceLine =
    promoDiscount > 0 && firstVisitPrice !== null
      ? `First visit total: ${formatCurrency(firstVisitPrice)}`
      : `Price: ${formatCurrency(displayQuote.perVisitPrice)} per visit`;
  const calendarDetails = [
    calendarPriceLine,
    `Service: ${displayQuote.serviceLabel}`,
    `Property: ${displayQuote.propertySummary}`,
    `Schedule: ${displayQuote.frequencyLabel}`,
    displayQuote.addOns.length > 0 ? `Add-ons: ${displayQuote.addOns.join(", ")}` : null,
    preferredTimeLabel ? `Preferred time: ${preferredTimeLabel}` : null,
    contactMethodLabel ? `Preferred contact: ${contactMethodLabel}` : null,
    contactAddress ? `Address: ${contactAddress}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  const calendarUrl = buildCalendarLink(
    preferredDate,
    calendarDetails,
    contactAddress || "Plymouth, UK"
  );
  const whatsappMessage = [
    "Hi Spark & Mend, I would like to book a clean.",
    `Service: ${displayQuote.serviceLabel}`,
    `Property: ${displayQuote.propertySummary}`,
    `Schedule: ${displayQuote.frequencyLabel}`,
    displayQuote.addOns.length > 0 ? `Add-ons: ${displayQuote.addOns.join(", ")}` : null,
    preferredDateLabel ? `Preferred start date: ${preferredDateLabel}` : null,
    preferredTimeLabel ? `Preferred start time: ${preferredTimeLabel}` : null,
    contactAddress ? `Address: ${contactAddress}` : null,
    calendarPriceLine,
  ]
    .filter(Boolean)
    .join("\n");
  const whatsappUrl = `https://wa.me/447452824799?text=${encodeURIComponent(
    whatsappMessage
  )}`;
  const contactName = getParam(searchParams, "contactName");
  const contactEmail = getParam(searchParams, "contactEmail");
  const contactPhone = getParam(searchParams, "contactPhone");
  const contactPostcode = getParam(searchParams, "contactPostcode");
  const notes = getParam(searchParams, "notes");
  const contactPayload = {
    name: contactName,
    email: contactEmail,
    phone: contactPhone,
    postcode: contactPostcode,
    address: contactAddress,
    preferredDate,
    preferredTime,
    preferredContact: contactMethod,
    notes,
  };

  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="pt-6">
        <AnimationContainer delay={0.1}>
          <div className="text-center max-w-2xl mx-auto">
            <SectionHeader
              eyebrow="Your Booking"
              title="Your booking summary"
              description="Based on your selections, here is your summary and next steps."
            />
          </div>
        </AnimationContainer>
      </Section>

      <Section>
        <AnimationContainer delay={0.2}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-2xl border border-border/70 bg-card/90 p-6">
              <div className="flex flex-col gap-4">
                {showSubmissionWarning && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    We could not send your details automatically. Please call or
                    email us to confirm this booking.
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Estimated price per visit</p>
                  <p className="text-4xl font-semibold text-primary">
                    {formatCurrency(displayQuote.perVisitPrice)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {displayQuote.paymentSummary}
                  </p>
                  {offerSummary && (
                    <div className="mt-3 space-y-1 text-sm">
                      <p className="text-emerald-600">
                        Offer applied: {offerSummary.title} (-{formatCurrency(offerSummary.discountAmount)})
                      </p>
                      <p className="text-xs text-muted-foreground line-through">
                        Original price: {formatCurrency(baseQuote.perVisitPrice)}
                      </p>
                    </div>
                  )}
                  {promoDiscount > 0 && firstVisitPrice !== null && (
                    <div className="mt-3 rounded-xl border border-emerald-200/70 bg-emerald-50/60 px-3 py-2 text-sm">
                      <p className="font-medium text-emerald-700">
                        {promoLabel} applied (-{formatCurrency(promoDiscount)})
                      </p>
                      <p className="text-xs text-emerald-800">
                        First visit total: {formatCurrency(firstVisitPrice)}
                      </p>
                    </div>
                  )}
                  {referenceHint && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Reference:{" "}
                      <span className="font-semibold text-foreground">
                        {referenceHint}
                      </span>
                    </p>
                  )}
                  {displayQuote.monthlyEstimate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Estimated monthly total: {formatCurrency(displayQuote.monthlyEstimate)}
                    </p>
                  )}
                </div>

                <div className="grid gap-3 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Service:</span>{" "}
                    {displayQuote.serviceLabel}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Property:</span>{" "}
                    {displayQuote.propertySummary}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Schedule:</span>{" "}
                    {displayQuote.frequencyLabel}
                  </p>
                  {preferredDateLabel && (
                    <p>
                      <span className="font-medium text-foreground">
                        Preferred start date:
                      </span>{" "}
                      {preferredDateLabel}
                    </p>
                  )}
                  {preferredTimeLabel && (
                    <p>
                      <span className="font-medium text-foreground">
                        Preferred start time:
                      </span>{" "}
                      {preferredTimeLabel}
                    </p>
                  )}
                  {contactAddress && (
                    <p>
                      <span className="font-medium text-foreground">Address:</span>{" "}
                      {contactAddress}
                    </p>
                  )}
                  {contactMethodLabel && (
                    <p>
                      <span className="font-medium text-foreground">
                        Preferred contact:
                      </span>{" "}
                      {contactMethodLabel}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    What is included
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {displayQuote.packageItems.map((item) => (
                      <CheckListItem key={item}>{item}</CheckListItem>
                    ))}
                  </ul>
                </div>

                {displayQuote.addOns.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Selected add-ons
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {displayQuote.addOns.map((item) => (
                        <CheckListItem key={item}>{item}</CheckListItem>
                      ))}
                    </ul>
                  </div>
                )}
                {displayQuote.customExtrasItems && displayQuote.customExtrasItems.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-foreground">
                      Custom requests we spotted
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {displayQuote.customExtrasItems.map((item) => (
                        <CheckListItem key={item}>{item}</CheckListItem>
                      ))}
                    </ul>
                    {displayQuote.customExtrasReason && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        {displayQuote.customExtrasReason}
                      </p>
                    )}
                    {displayQuote.customExtrasText && (
                      <p className="mt-2 text-xs text-muted-foreground italic">
                        Original request: {displayQuote.customExtrasText}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

              <div className="rounded-2xl border border-border/70 bg-card/90 p-6 h-fit">
                <h2 className="text-xl font-semibold text-foreground">
                  What happens next
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  We will review your details, confirm availability, and send a
                  final confirmation. Expect a response within 24 hours so we can
                  book you in.
                </p>
                {referenceHint && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Save your reference <strong>{referenceHint}</strong> to manage
                    your booking later.
                  </p>
                )}
              {contactMethodLabel && (
                <p className="mt-3 text-sm text-muted-foreground">
                  We will reach out by {contactMethodLabel}.
                </p>
              )}

                <div className="mt-6 border-t border-border/60 pt-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Don&apos;t want to wait?
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add your preferred start date to your calendar, adjust it if
                    needed, and send the invite so we can confirm the booking.
                  </p>
                <div className="mt-4 flex flex-col gap-3">
                  {calendarUrl ? (
                    <PrimaryButton asChild size="sm">
                      <Link href={calendarUrl} target="_blank" rel="noreferrer">
                        Add preferred date to calendar
                      </Link>
                    </PrimaryButton>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Add a preferred start date on the form to generate a
                      calendar hold.
                    </p>
                  )}
                  <StripeCheckoutButton
                    quote={baseQuote}
                    contact={contactPayload}
                    referenceHint={referenceHint ?? undefined}
                    input={input}
                  />
                  <Button variant="outline" asChild>
                    <Link href={whatsappUrl}>Pay later / cash (WhatsApp)</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={CONTACT_PHONE_LINK}>Call {CONTACT_PHONE}</Link>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Prefer to pay later or in cash? Use the WhatsApp button above
                    or call us to arrange.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimationContainer>
      </Section>
    </MaxWidthWrapper>
  );
};

export default QuoteResultPage;
