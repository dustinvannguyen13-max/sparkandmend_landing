"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { AnimationContainer, MaxWidthWrapper } from "@/components";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/primary-button";
import { CheckListItem } from "@/components/ui/check-list";
import { Section, SectionHeader } from "@/components/ui/section";
import MagicBadge from "@/components/ui/magic-badge";

interface BookingRecord {
  reference: string;
  service: string;
  property_summary: string;
  frequency: string;
  per_visit_price: number;
  extras?: string[];
  custom_extras_items?: string[];
  custom_extras_text?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  preferred_date?: string;
  notes?: string;
  payment_amount?: number;
  payment_currency?: string;
}

const CONTACT_PHONE = "07452 824799";
const WHATSAPP_URL = "https://wa.me/447452824799";

const BookingConfirmationPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !reference) {
      setStatus("error");
      setError("Missing session or reference details.");
      return;
    }

    const confirm = async () => {
      setStatus("loading");
      try {
        const response = await fetch("/api/bookings/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, reference }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Could not confirm booking.");
        }
        setBooking(data.booking);
        setStatus("success");
      } catch (err) {
        setError((err as Error).message);
        setStatus("error");
      }
    };

    confirm();
  }, [sessionId, reference]);

  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="text-center">
        <AnimationContainer>
          <MagicBadge title="Booking confirmed" />
          <SectionHeader
            title="Thanks for securing a clean"
            description="We have saved your booking reference and will be in touch soon."
          />
          {status === "loading" && (
            <p className="mt-4 text-sm text-muted-foreground">
              Checking your payment confirmation...
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          )}
        </AnimationContainer>
      </Section>

      <Section>
        {status === "success" && booking ? (
          <AnimationContainer>
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-border/70 bg-card/90 p-6">
                <p className="text-sm text-muted-foreground">Booking reference</p>
                <p className="text-3xl font-semibold text-primary mb-4">
                  {booking.reference}
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Service:</span>{" "}
                    {booking.service}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Property:</span>{" "}
                    {booking.property_summary}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Schedule:</span>{" "}
                    {booking.frequency}
                  </p>
                  {booking.preferred_date && (
                    <p>
                      <span className="font-medium text-foreground">Preferred date:</span>{" "}
                      {booking.preferred_date.split("-").reverse().join("/")}
                    </p>
                  )}
                  {booking.contact_name && (
                    <p>
                      <span className="font-medium text-foreground">Contact:</span>{" "}
                      {booking.contact_name}
                    </p>
                  )}
                  {booking.contact_email && (
                    <p>
                      <span className="font-medium text-foreground">Email:</span>{" "}
                      {booking.contact_email}
                    </p>
                  )}
                  {booking.payment_amount && (
                    <p>
                      <span className="font-medium text-foreground">Paid:</span>{" "}
                      £{booking.payment_amount} {booking.payment_currency}
                    </p>
                  )}
                </div>

                {(booking.extras?.length || booking.custom_extras_items?.length) && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-foreground">Extras</h3>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {booking.extras?.map((item) => (
                        <CheckListItem key={`extra-${item}`}>{item}</CheckListItem>
                      ))}
                      {booking.custom_extras_items?.map((item) => (
                        <CheckListItem key={`custom-${item}`}>{item}</CheckListItem>
                      ))}
                    </ul>
                    {booking.notes && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Notes: {booking.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/90 p-6">
                <h3 className="text-lg font-semibold text-foreground">
                  What happens next
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We will review and lock in your slot, then send an email and
                  WhatsApp to confirm everything and share the cleaner&apos;s ETA.
                </p>
                <div className="mt-6 space-y-3">
                  <PrimaryButton asChild>
                    <Link href="/get-a-quote">Book another clean</Link>
                  </PrimaryButton>
                  <Button variant="outline" asChild>
                    <Link href={WHATSAPP_URL}>WhatsApp us</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`tel:${CONTACT_PHONE}`}>Call {CONTACT_PHONE}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </AnimationContainer>
        ) : status === "loading" ? (
          <div className="rounded-2xl border border-border/70 bg-card/90 p-6 text-center text-sm text-muted-foreground">
            Confirming your payment...
          </div>
        ) : (
          <div className="rounded-2xl border border-border/70 bg-card/90 p-6 text-center text-sm text-destructive">
            {error || "We could not confirm this booking. Please contact us directly."}
          </div>
        )}
      </Section>
    </MaxWidthWrapper>
  );
};

export default BookingConfirmationPage;
