import Link from "next/link";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import { Button } from "@/components/ui/button";
import MagicBadge from "@/components/ui/magic-badge";
import {
  calculateQuote,
  formatCurrency,
  parseQuoteSearchParams,
} from "@/utils/quote";

interface QuoteResultPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

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

const buildCalendarLink = (
  preferredDate: string | undefined,
  details: string
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
  )}&location=${encodeURIComponent("Plymouth, UK")}&add=${encodeURIComponent(
    "sparkandmend@gmail.com"
  )}`;
};

const QuoteResultPage = ({ searchParams }: QuoteResultPageProps) => {
  const input = parseQuoteSearchParams(searchParams);
  const quote = calculateQuote(input);
  const preferredDate = getParam(searchParams, "preferredDate");
  const contactMethod = getParam(searchParams, "contactMethod");
  const contactMethodLabel = contactMethod
    ? CONTACT_METHOD_LABELS[contactMethod] || "your preferred method"
    : undefined;
  const preferredDateLabel = formatPreferredDate(preferredDate);
  const submissionStatus = Array.isArray(searchParams.submitted)
    ? searchParams.submitted[0]
    : searchParams.submitted;
  const showSubmissionWarning = submissionStatus === "0";
  const calendarDetails = [
    `Quote: ${formatCurrency(quote.perVisitPrice)} per visit`,
    `Service: ${quote.serviceLabel}`,
    `Property: ${quote.propertySummary}`,
    `Schedule: ${quote.frequencyLabel}`,
    quote.addOns.length > 0 ? `Add-ons: ${quote.addOns.join(", ")}` : null,
    contactMethodLabel ? `Preferred contact: ${contactMethodLabel}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  const calendarUrl = buildCalendarLink(preferredDate, calendarDetails);
  const whatsappMessage = [
    "Hi Spark & Mend, I would like to book a clean.",
    `Service: ${quote.serviceLabel}`,
    `Property: ${quote.propertySummary}`,
    `Schedule: ${quote.frequencyLabel}`,
    quote.addOns.length > 0 ? `Add-ons: ${quote.addOns.join(", ")}` : null,
    preferredDateLabel ? `Preferred start date: ${preferredDateLabel}` : null,
    `Quote: ${formatCurrency(quote.perVisitPrice)} per visit`,
  ]
    .filter(Boolean)
    .join("\n");
  const whatsappUrl = `https://wa.me/447715293761?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <MaxWidthWrapper className="py-16">
      <AnimationContainer delay={0.1}>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <MagicBadge title="Your Quote" />
          <h1 className="text-3xl md:text-5xl font-semibold font-heading text-foreground mt-6">
            Your instant cleaning quote
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Based on your selections, here is your personalised estimate.
          </p>
        </div>
      </AnimationContainer>

      <AnimationContainer delay={0.2} className="mt-12">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
          <div className="rounded-2xl border border-border bg-card p-6">
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
                    Estimated monthly total:{" "}
                    {formatCurrency(quote.monthlyEstimate)}
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
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary" />
                      <span>{item}</span>
                    </li>
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
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 h-fit">
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
                  <Button asChild>
                    <Link href={calendarUrl} target="_blank" rel="noreferrer">
                      Add preferred date to calendar
                    </Link>
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Add a preferred start date on the form to generate a
                    calendar hold.
                  </p>
                )}
                <Button variant="outline" asChild>
                  <Link href={whatsappUrl}>WhatsApp us</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="tel:07715293761">Call 07715 293761</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="tel:07452824799">Call 07452 824799</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AnimationContainer>
    </MaxWidthWrapper>
  );
};

export default QuoteResultPage;
