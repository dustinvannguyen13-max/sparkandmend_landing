import * as React from "react";

import { cn } from "@/utils";
import MagicBadge from "@/components/ui/magic-badge";
import { ShimmeringText } from "@/components/ui/shimmering-text";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

const Section = ({ as: Comp = "section", className, ...props }: SectionProps) => {
  return (
    <Comp
      className={cn("mt-10 py-14 first:mt-0 md:mt-14 md:py-20", className)}
      {...props}
    />
  );
};

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  titleClassName,
}: SectionHeaderProps) => {
  const alignment =
    align === "center"
      ? "items-center text-center"
      : "items-start text-left";

  return (
    <div className={cn("flex flex-col gap-4", alignment, className)}>
      {eyebrow ? <MagicBadge title={eyebrow} /> : null}
      <h2
        className={cn(
          "text-3xl md:text-4xl lg:text-5xl font-semibold font-heading text-foreground leading-tight break-words text-balance",
          titleClassName
        )}
      >
        <ShimmeringText
          text={title}
          color="hsl(var(--foreground))"
          shimmeringColor="hsl(var(--secondary))"
        />
      </h2>
      {description ? (
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
          {description}
        </p>
      ) : null}
    </div>
  );
};

export { Section, SectionHeader };
