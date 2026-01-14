import * as React from "react";
import Link from "next/link";

import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/primary-button";

interface CTAStripProps {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
}

const CTAStrip = ({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  className,
}: CTAStripProps) => {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border/70 bg-card/90 px-6 py-10 text-center shadow-[0_30px_70px_-50px_hsl(var(--primary)/0.5)] md:px-12 md:py-12",
        className
      )}
    >
      <h2 className="text-3xl md:text-4xl font-semibold font-heading text-foreground">
        {title}
      </h2>
      <p className="mt-4 text-base md:text-lg text-muted-foreground">
        {description}
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <PrimaryButton asChild>
          <Link href={primaryHref}>{primaryLabel}</Link>
        </PrimaryButton>
        {secondaryHref && secondaryLabel ? (
          <Button variant="outline" asChild>
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default CTAStrip;
