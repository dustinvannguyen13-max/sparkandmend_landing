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

const QuoteResultPage = ({ searchParams }: QuoteResultPageProps) => {
  const input = parseQuoteSearchParams(searchParams);
  const quote = calculateQuote(input);
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
  const calendarDetails = [
    `Quote: ${formatCurrency(quote.perVisitPrice)} per visit`,
    `Service: ${quote.serviceLabel}`,
    `Property: ${quote.propertySummary}`,
    `Schedule: ${quote.frequencyLabel}`,
    quote.addOns.length > 0 ? `Add-ons: ${quote.addOns.join(", ")}` : null,
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
    `Service: ${quote.serviceLabel}`,
    `Property: ${quote.propertySummary}`,
    `Schedule: ${quote.frequencyLabel}`,
    quote.addOns.length > 0 ? `Add-ons: ${quote.addOns.join(", ")}` : null,
    preferredDateLabel ? `Preferred start date: ${preferredDateLabel}` : null,
    preferredTimeLabel ? `Preferred start time: ${preferredTimeLabel}` : null,
    contactAddress ? `Address: ${contactAddress}` : null,
    `Quote: ${formatCurrency(quote.perVisitPrice)} per visit`,
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
  const referenceHint = getParam(searchParams, "reference");
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
              eyebrow="Your Quote"
              title="Your instant cleaning quote"
              description="Based on your selections, here is your personalised estimate."
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
                    email us to confirm this quote.
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Estimated price</p>
                  <p className="text-4xl font-semibold text-primary">
                    {formatCurrency(quote.perVisitPrice)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {quote.paymentSummary}
                  </p>
                  {quote.monthlyEstimate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Estimated monthly total: {formatCurrency(quote.monthlyEstimate)}
                    </p>
                  )}
                </div>

                <div className="grid gap-3 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Service:</span>{" "}
                    {quote.serviceLabel}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Property:</span>{" "}
                    {quote.propertySummary}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Schedule:</span>{" "}
                    {quote.frequencyLabel}
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
                    {quote.packageItems.map((item) => (
                      <CheckListItem key={item}>{item}</CheckListItem>
                    ))}
                  </ul>
                </div>

                {quote.addOns.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Selected add-ons
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {quote.addOns.map((item) => (
                        <CheckListItem key={item}>{item}</CheckListItem>
                      ))}
                    </ul>
                  </div>
                )}
                {quote.customExtrasItems && quote.customExtrasItems.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-foreground">
                      Custom requests we spotted
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {quote.customExtrasItems.map((item) => (
                        <CheckListItem key={item}>{item}</CheckListItem>
                      ))}
                    </ul>
                    {quote.customExtrasReason && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        {quote.customExtrasReason}
                      </p>
                    )}
                    {quote.customExtrasText && (
                      <p className="mt-2 text-xs text-muted-foreground italic">
                        Original request: {quote.customExtrasText}
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
                final quote. Expect a response within 24 hours so we can book you
                in.
              </p>
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
                    quote={quote}
                    contact={contactPayload}
                    referenceHint={referenceHint ?? undefined}
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
