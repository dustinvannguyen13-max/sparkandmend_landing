"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";
import { APP_DOMAIN } from "@/utils/constants/site";
import { formatCurrency } from "@/utils/quote";
import { getFrequencyLabel } from "@/lib/booking-frequency";

type BookingRecord = {
  reference: string;
  service?: string | null;
  property_summary?: string | null;
  frequency?: string | null;
  frequency_key?: string | null;
  per_visit_price?: number | null;
  extras?: string[] | null;
  custom_extras_items?: string[] | null;
  custom_extras_text?: string | null;
  custom_extras_reason?: string | null;
  custom_extras_source?: string | null;
  custom_extras_fallback_reason?: string | null;
  custom_extras_price?: number | null;
  promo_type?: string | null;
  promo_label?: string | null;
  promo_discount?: number | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  contact_postcode?: string | null;
  contact_address?: string | null;
  contact_method?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
  notes?: string | null;
  status?: string | null;
  payment_amount?: number | null;
  payment_currency?: string | null;
  stripe_subscription_id?: string | null;
  stripe_subscription_status?: string | null;
  stripe_current_period_end?: string | null;
};

type EmailTemplateOption =
  | "amended"
  | "cancelled"
  | "review"
  | "payment"
  | "custom";

type BookingDetailsDialogProps = {
  open: boolean;
  booking: BookingRecord | null;
  onOpenChange: (open: boolean) => void;
  onViewCustomer?: (booking: BookingRecord) => void;
};

const statusStyles: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default",
  pending: "secondary",
  cancelled: "destructive",
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

const formatBillingDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB");
};

const formatFrequency = (frequency?: string | null, key?: string | null) => {
  const label = getFrequencyLabel(frequency ?? key ?? undefined);
  return label ?? "—";
};

const getNetAmount = (value?: number | null, discount?: number | null) =>
  Math.max(0, (value ?? 0) - (discount ?? 0));

const buildEmailTemplate = (
  template: EmailTemplateOption,
  booking: BookingRecord,
) => {
  const name = booking.contact_name || "there";
  const reference = booking.reference || "your booking";
  const schedule = formatFrequency(booking.frequency, booking.frequency_key);
  const amount = getNetAmount(
    booking.payment_amount ?? booking.per_visit_price ?? 0,
    booking.promo_discount ?? 0,
  );
  const amountLine = amount ? `Amount due: ${formatCurrency(amount)}` : null;
  const manageLink = `${APP_DOMAIN}/my-booking?reference=${reference}`;

  if (template === "review") {
    return {
      subject: "Thanks for choosing Spark & Mend - we'd love a review",
      body: [
        `Hi ${name},`,
        "",
        "Thanks for choosing Spark & Mend. If you were happy with the clean, we'd really appreciate a quick review.",
        "Reply to this email and we will send the review link, or share feedback directly.",
        "",
        `Reference: ${reference}`,
        booking.service ? `Service: ${booking.service}` : null,
        booking.preferred_date ? `Date: ${formatDate(booking.preferred_date)}` : null,
        "",
        `Manage your booking: ${manageLink}`,
      ]
        .filter(Boolean)
        .join("\n"),
    };
  }

  if (template === "payment") {
    return {
      subject: `Payment reminder for ${reference}`,
      body: [
        `Hi ${name},`,
        "",
        "This is a friendly reminder that payment is due for your booking.",
        amountLine,
        booking.service ? `Service: ${booking.service}` : null,
        booking.preferred_date ? `Date: ${formatDate(booking.preferred_date)}` : null,
        "",
        `Pay or manage your booking here: ${manageLink}`,
        "If you have already paid, please ignore this message.",
      ]
        .filter(Boolean)
        .join("\n"),
    };
  }

  const subject =
    template === "cancelled"
      ? `Booking cancelled for ${reference}`
      : `Booking updated for ${reference}`;
  const intro =
    template === "cancelled"
      ? `Hi ${name}, your booking has been cancelled as requested.`
      : `Hi ${name}, your booking details have been updated.`;
  const lines = [
    intro,
    "",
    `Reference: ${reference}`,
    booking.service ? `Service: ${booking.service}` : null,
    booking.property_summary ? `Property: ${booking.property_summary}` : null,
    schedule ? `Schedule: ${schedule}` : null,
    booking.preferred_date ? `Preferred date: ${formatDate(booking.preferred_date)}` : null,
    booking.preferred_time ? `Preferred time: ${booking.preferred_time}` : null,
    booking.contact_address ? `Address: ${booking.contact_address}` : null,
    booking.notes ? `Notes: ${booking.notes}` : null,
    "",
    `Manage your booking: ${manageLink}`,
  ]
    .filter(Boolean)
    .join("\n");
  return { subject, body: lines };
};

const BookingDetailsDialog = ({
  open,
  booking,
  onOpenChange,
  onViewCustomer,
}: BookingDetailsDialogProps) => {
  const [emailTemplate, setEmailTemplate] =
    useState<EmailTemplateOption>("amended");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!booking) {
      setEmailTemplate("amended");
      setEmailSubject("");
      setEmailBody("");
      setEmailError(null);
      setEmailSuccess(null);
      return;
    }
    if (emailTemplate === "custom") {
      return;
    }
    const { subject, body } = buildEmailTemplate(emailTemplate, booking);
    setEmailSubject(subject);
    setEmailBody(body);
  }, [booking, emailTemplate]);

  const handleSendEmail = async () => {
    if (!booking) return;
    setEmailSending(true);
    setEmailError(null);
    setEmailSuccess(null);

    if (!booking.contact_email) {
      setEmailError("No customer email on this booking.");
      setEmailSending(false);
      return;
    }
    if (!emailSubject.trim() || !emailBody.trim()) {
      setEmailError("Subject and message are required.");
      setEmailSending(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/bookings/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: booking.reference,
          to: booking.contact_email,
          subject: emailSubject,
          body: emailBody,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to send email.");
      }
      setEmailSuccess("Email sent.");
    } catch (err) {
      setEmailError((err as Error).message);
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Booking details</DialogTitle>
          <DialogDescription>
            {booking?.reference} • {booking?.service || "Cleaning service"}
          </DialogDescription>
        </DialogHeader>
        {booking && (
          <Tabs defaultValue="details" className="mt-2 flex flex-col gap-4">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
              <TabsTrigger value="email" className="flex-1">
                Email
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="details"
              className="mt-4 max-h-[60vh] overflow-y-auto pr-1"
            >
              <div className="space-y-4 text-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Customer
                    </p>
                    <p className="text-foreground">
                      {booking.contact_name || "—"}
                    </p>
                    <p className="text-muted-foreground">
                      {booking.contact_email || "—"}
                    </p>
                    <p className="text-muted-foreground">
                      {booking.contact_phone || "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Schedule
                    </p>
                    <p className="text-foreground">
                      {formatDate(booking.preferred_date)}
                    </p>
                    <p className="text-muted-foreground">
                      {booking.preferred_time || "Time TBC"}
                    </p>
                    <p className="text-muted-foreground">
                      {formatFrequency(booking.frequency, booking.frequency_key)}
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Pricing
                    </p>
                    <p className="text-foreground">
                      {booking.payment_amount || booking.per_visit_price
                        ? formatCurrency(
                            getNetAmount(
                              booking.payment_amount ?? booking.per_visit_price ?? 0,
                              booking.promo_discount ?? 0,
                            ),
                          )
                        : "—"}
                    </p>
                    <p className="text-muted-foreground">
                      {booking.payment_currency || "GBP"}
                    </p>
                    {booking.promo_type && booking.promo_discount ? (
                      <p className="text-xs text-muted-foreground">
                        Promo applied: {booking.promo_label || "Free bathroom"} (-
                        {formatCurrency(booking.promo_discount)})
                      </p>
                    ) : null}
                    {booking.stripe_subscription_id && (
                      <p className="text-xs text-muted-foreground">
                        Subscription: {booking.stripe_subscription_status || "active"}
                        {booking.stripe_current_period_end
                          ? ` • Next billing ${formatBillingDate(
                              booking.stripe_current_period_end,
                            )}`
                          : ""}
                      </p>
                    )}
                    <Badge
                      variant={statusStyles[booking.status ?? "pending"] ?? "outline"}
                    >
                      {booking.status ?? "pending"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Property
                    </p>
                    <p className="text-foreground">
                      {booking.property_summary || "—"}
                    </p>
                    <p className="text-muted-foreground">
                      {booking.contact_address || "—"}
                    </p>
                    <p className="text-muted-foreground">
                      {booking.contact_postcode || "—"}
                    </p>
                    {booking.contact_address && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full sm:w-auto"
                        asChild
                      >
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                            "25 Belgrave Road, Plymouth, England, PL4 7DP",
                          )}&destination=${encodeURIComponent(
                            booking.contact_address,
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Directions from Belgrave Road
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Extras
                  </p>
                  {booking.extras && booking.extras.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {booking.extras.map((extra) => (
                        <Badge key={extra} variant="secondary">
                          {extra}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No extras selected.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Custom extras
                  </p>
                  <div className="rounded-xl border border-border/60 bg-background/70 p-3 text-sm text-muted-foreground space-y-1">
                    <p>
                      <span className="text-foreground">Items:</span>{" "}
                      {booking.custom_extras_items?.length
                        ? booking.custom_extras_items.join(", ")
                        : "—"}
                    </p>
                    <p>
                      <span className="text-foreground">Request:</span>{" "}
                      {booking.custom_extras_text || "—"}
                    </p>
                    <p>
                      <span className="text-foreground">Reason:</span>{" "}
                      {booking.custom_extras_reason || "—"}
                    </p>
                    <p>
                      <span className="text-foreground">Source:</span>{" "}
                      {booking.custom_extras_source || "—"}
                    </p>
                    <p>
                      <span className="text-foreground">Fallback reason:</span>{" "}
                      {booking.custom_extras_fallback_reason || "—"}
                    </p>
                    <p>
                      <span className="text-foreground">Price:</span>{" "}
                      {booking.custom_extras_price
                        ? formatCurrency(booking.custom_extras_price)
                        : "—"}
                    </p>
                  </div>
                </div>
                {booking.notes && (
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Notes
                    </p>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {booking.notes}
                    </p>
                  </div>
                )}
                {onViewCustomer && booking.contact_email && (
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto gap-2"
                    onClick={() => {
                      onViewCustomer(booking);
                      onOpenChange(false);
                    }}
                  >
                    <User className="h-4 w-4" />
                    View customer bookings
                  </Button>
                )}
              </div>
            </TabsContent>
            <TabsContent
              value="email"
              className="mt-4 max-h-[60vh] overflow-y-auto pr-1"
            >
              <div className="space-y-4 text-sm">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Email customer
                      </p>
                      <p className="text-sm text-foreground">
                        {booking.contact_email || "No email on file"}
                      </p>
                    </div>
                    <Select
                      value={emailTemplate}
                      onValueChange={(value) =>
                        setEmailTemplate(value as EmailTemplateOption)
                      }
                    >
                      <SelectTrigger className="w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amended">Booking updated</SelectItem>
                        <SelectItem value="cancelled">Booking cancelled</SelectItem>
                        <SelectItem value="review">Review request</SelectItem>
                        <SelectItem value="payment">Payment reminder</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input
                        value={emailSubject}
                        onChange={(event) => setEmailSubject(event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea
                        value={emailBody}
                        onChange={(event) => setEmailBody(event.target.value)}
                        className="min-h-[140px]"
                      />
                    </div>
                    {emailError && (
                      <p className="text-xs text-destructive">{emailError}</p>
                    )}
                    {emailSuccess && (
                      <p className="text-xs text-emerald-600">{emailSuccess}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        onClick={handleSendEmail}
                        disabled={emailSending || !booking.contact_email}
                      >
                        {emailSending ? "Sending..." : "Send email"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const { subject, body } = buildEmailTemplate(
                            emailTemplate === "custom" ? "amended" : emailTemplate,
                            booking,
                          );
                          setEmailSubject(subject);
                          setEmailBody(body);
                        }}
                      >
                        Reset template
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsDialog;
