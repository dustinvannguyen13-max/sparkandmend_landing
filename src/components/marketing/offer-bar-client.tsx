"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type OfferBarClientProps = {
  id: string;
  title: string;
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
  label: string;
};

const STORAGE_PREFIX = "spark_mend_offer_dismissed_";

const OfferBarClient = ({
  id,
  title,
  message,
  ctaLabel,
  ctaHref,
  label,
}: OfferBarClientProps) => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (stored === "1") {
      setIsHidden(true);
    }
  }, [id]);

  if (isHidden) return null;

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`${STORAGE_PREFIX}${id}`, "1");
    }
    setIsHidden(true);
  };

  return (
    <div className="relative z-50 w-full border-b border-border/60 bg-primary/10 px-4 py-2 text-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-foreground">
          <span className="rounded-full border border-primary/30 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {label}
          </span>
          <span className="font-semibold">{title}</span>
          {message && <span className="text-muted-foreground">{message}</span>}
        </div>
        <div className="flex items-center gap-2">
          {ctaLabel && ctaHref ? (
            <Button asChild size="sm" className="h-8">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="h-8">
              <Link href="/get-a-quote">Get a quote</Link>
            </Button>
          )}
          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/70 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Dismiss offer"
            title="Dismiss offer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferBarClient;
