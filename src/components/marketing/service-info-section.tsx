import Link from "next/link";
import { CheckListItem } from "@/components/ui/check-list";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SectionHeader } from "@/components/ui/section";

interface ServiceInfoSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  bullets?: string[];
  note?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

const ServiceInfoSection = ({
  eyebrow,
  title,
  description,
  bullets = [],
  note,
  ctaHref,
  ctaLabel,
}: ServiceInfoSectionProps) => {
  return (
    <div>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        align="left"
      />
      {bullets.length > 0 ? (
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          {bullets.map((item) => (
            <CheckListItem key={item}>{item}</CheckListItem>
          ))}
        </ul>
      ) : null}
      {note ? <p className="mt-4 text-sm text-muted-foreground">{note}</p> : null}
      {ctaHref && ctaLabel ? (
        <div className="mt-6">
          <PrimaryButton asChild>
            <Link href={ctaHref}>{ctaLabel}</Link>
          </PrimaryButton>
        </div>
      ) : null}
    </div>
  );
};

export default ServiceInfoSection;
