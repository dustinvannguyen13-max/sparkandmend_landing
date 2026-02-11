"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/ui/primary-button";

const StripeTestButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/test-checkout", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Unable to start test checkout.");
      }

      window.location.href = data.url as string;
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <PrimaryButton
        onClick={handleCheckout}
        size="sm"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Preparing test checkout..." : "Pay £1 test charge"}
      </PrimaryButton>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          This creates a £1 Stripe Checkout session for a quick payment test.
        </p>
      )}
    </div>
  );
};

export default StripeTestButton;
