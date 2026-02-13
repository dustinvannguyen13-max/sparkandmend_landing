import type { Metadata } from "next";
import Link from "next/link";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import CTAStrip from "@/components/ui/cta-strip";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import { StarsBackground } from "@/components/ui/stars-background";
import { buildPageTitle, getPageByPath } from "@/lib/seo/keywords";
import { generateMetadata } from "@/utils";

const PAGE = getPageByPath("/guides");
const METADATA_TITLE = buildPageTitle(PAGE.path);
const METADATA_DESCRIPTION = PAGE.metaDescription;
const CANONICAL = PAGE.path;

const BASE_METADATA = generateMetadata({
  title: METADATA_TITLE,
  description: METADATA_DESCRIPTION,
});

export const metadata: Metadata = {
  ...BASE_METADATA,
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    ...(BASE_METADATA.openGraph ?? {}),
    title: METADATA_TITLE,
    description: METADATA_DESCRIPTION,
    url: CANONICAL,
  },
  twitter: {
    ...(BASE_METADATA.twitter ?? {}),
    title: METADATA_TITLE,
    description: METADATA_DESCRIPTION,
  },
};

const GUIDES = [
  {
    title: "End of Tenancy Cleaning Checklist (Plymouth)",
    description:
      "Room-by-room checklist plus inspection tips for Plymouth rentals.",
    href: "/guides/end-of-tenancy-cleaning-checklist-plymouth",
    serviceHref: "/advanced-clean",
  },
  {
    title: "Cleaning Cost Guide (Plymouth)",
    description:
      "What affects price, when to pick each service, and how to quote.",
    href: "/guides/cleaning-cost-guide-plymouth",
    serviceHref: "/cleaning-prices-plymouth",
  },
  {
    title: "What Landlords Check (Plymouth)",
    description:
      "Inspection focus areas, common pain points, and how to prepare.",
    href: "/guides/what-landlords-check-plymouth",
    serviceHref: "/advanced-clean",
  },
  {
    title: "How Long Does a Deep Clean Take? (Plymouth)",
    description:
      "What changes timing and how deep cleaning compares to regular visits.",
    href: "/guides/how-long-does-a-deep-clean-take-plymouth",
    serviceHref: "/intermediate-clean",
  },
];

const heroSurface =
  "relative overflow-hidden rounded-[36px] border border-border/50 bg-[radial-gradient(120%_120%_at_80%_0%,hsl(var(--background))_0%,hsl(var(--subtle))_45%,hsl(var(--background))_100%)] px-6 pt-10 pb-12 md:px-12 md:pt-12 md:pb-14 shadow-[0_45px_100px_-70px_hsl(var(--primary)/0.45)]";
const sectionBase =
  "relative overflow-hidden rounded-[32px] border border-border/50 px-6 py-10 md:px-10 md:py-12 shadow-[0_30px_80px_-60px_hsl(var(--primary)/0.35)]";
const surfacePrimary =
  "bg-[linear-gradient(135deg,hsl(var(--primary)/0.08),hsl(var(--background))_70%)]";
const surfaceSoft =
  "bg-[linear-gradient(135deg,hsl(var(--subtle))_0%,hsl(var(--background))_75%)]";

const GuidesPage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className={heroSurface}>
        <StarsBackground
          className="absolute inset-0 opacity-55"
          starColor="#09484F"
          pointerEvents={false}
        />
        <div className="relative z-10">
          <SectionHeader
            eyebrow="Guides"
            title="Plymouth Cleaning Guides"
            description="Support guides that answer the questions people ask before they book. Each guide links to the relevant Spark & Mend service and quote flow."
          />
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Serving Plymouth only. Use these guides to plan your next clean with
            clear expectations.
          </p>
        </div>
      </Section>

      <Section className={`${sectionBase} ${surfacePrimary}`}>
        <AnimationContainer delay={0.2}>
          <SectionHeader
            eyebrow="Who this is for"
            title="Tenants, landlords, and homeowners in Plymouth"
            description="Short, practical guidance to help you choose the right clean and prepare for bookings or inspections."
          />
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.25}>
          <SectionHeader
            eyebrow="Guides"
            title="Explore the first four support guides"
            description="Focused on Plymouth cleaning needs, pricing, and inspection expectations."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {GUIDES.map((guide) => (
              <Card key={guide.href} className="border-none bg-card/85">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {guide.title}
                  </CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-3">
                  <Button asChild>
                    <Link href={guide.href}>Read the guide</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={guide.serviceHref}>Related service</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimationContainer>
      </Section>

      <Section>
        <CTAStrip
          title="Ready for a Plymouth clean?"
          description="Use the booking calculator for a clear price and confirmed availability."
          primaryHref="/get-a-quote"
          primaryLabel="Get an instant quote"
          secondaryHref="/cleaning-services-plymouth"
          secondaryLabel="View Plymouth services"
        />
      </Section>
    </MaxWidthWrapper>
  );
};

export default GuidesPage;
