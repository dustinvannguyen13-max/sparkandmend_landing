"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { QuoteResult } from "@/utils/quote";

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  preferredDate?: string;
  preferredContact?: string;
  notes?: string;
}

interface PaymentActionProps {
  quote: QuoteResult;
  contact: ContactPayload;
  referenceHint?: string;
}

const StripeCheckoutButton = ({
  quote,
  contact,
  referenceHint,
}: PaymentActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayNow = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote: {
            serviceLabel: quote.serviceLabel,
            frequencyLabel: quote.frequencyLabel,
            propertySummary: quote.propertySummary,
            perVisitPrice: quote.perVisitPrice,
            addOns: quote.addOns,
            customExtrasItems: quote.customExtrasItems || [],
            customExtrasSummary: quote.customExtrasSummary,
            customExtrasText: quote.customExtrasText,
            customExtrasReason: quote.customExtrasReason,
            customExtrasSource: quote.customExtrasSource,
            customExtrasFallbackReason: quote.customExtrasFallbackReason,
            customExtrasPrice: quote.customExtrasPrice ?? 0,
          },
          contact: {
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            postcode: contact.postcode,
            preferredDate: contact.preferredDate,
            preferredContact: contact.preferredContact,
            notes: contact.notes,
          },
          referenceHint,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to create Stripe checkout session.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <PrimaryButton
        onClick={handlePayNow}
        size="sm"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Preparing checkout..." : "Pay Now"}
      </PrimaryButton>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          We will send a secure booking receipt after payment is taken.
        </p>
      )}
    </div>
  );
};

export default StripeCheckoutButton;
