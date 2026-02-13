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
import { CheckListItem } from "@/components/ui/check-list";
import { Section, SectionHeader } from "@/components/ui/section";
import { StarsBackground } from "@/components/ui/stars-background";
import {
  AREA,
  BRAND,
  buildPageTitle,
  getPageByPath,
} from "@/lib/seo/keywords";
import { pricingExamples } from "@/lib/pricing/price-examples";
import { generateMetadata } from "@/utils";

const PAGE = getPageByPath("/guides/cleaning-cost-guide-plymouth");
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

const LAST_MODIFIED = new Date().toISOString();
const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: METADATA_TITLE,
  description: METADATA_DESCRIPTION,
  datePublished: LAST_MODIFIED,
  dateModified: LAST_MODIFIED,
  author: {
    "@type": "Organization",
    name: BRAND,
  },
};

const costFactors = [
  "Property size and number of rooms",
  "Bathrooms and high-use areas",
  "Current condition and build-up",
  "Service level (regular, deep, or end of tenancy)",
  "Visit frequency for regular cleans",
  "Add-ons like oven, fridge, or interior windows",
];

const relatedLinks = [
  { label: "Plymouth services hub", href: "/cleaning-services-plymouth" },
  { label: "Cleaning prices in Plymouth", href: "/cleaning-prices-plymouth" },
  { label: "Plymouth cleaning FAQs", href: "/faq-plymouth" },
  { label: "Cleaning results gallery", href: "/cleaning-results-plymouth" },
  { label: "Regular house cleaning", href: "/basic-clean" },
  { label: "Get an instant quote", href: "/get-a-quote" },
];

const heroSurface =
  "relative overflow-hidden rounded-[36px] border border-border/50 bg-[radial-gradient(120%_120%_at_80%_0%,hsl(var(--background))_0%,hsl(var(--subtle))_45%,hsl(var(--background))_100%)] px-6 pt-10 pb-12 md:px-12 md:pt-12 md:pb-14 shadow-[0_45px_100px_-70px_hsl(var(--primary)/0.45)]";
const sectionBase =
  "relative overflow-hidden rounded-[32px] border border-border/50 px-6 py-10 md:px-10 md:py-12 shadow-[0_30px_80px_-60px_hsl(var(--primary)/0.35)]";
const surfacePrimary =
  "bg-[linear-gradient(135deg,hsl(var(--primary)/0.08),hsl(var(--background))_70%)]";
const surfaceSoft =
  "bg-[linear-gradient(135deg,hsl(var(--subtle))_0%,hsl(var(--background))_75%)]";
const surfaceNeutral =
  "bg-[linear-gradient(135deg,hsl(var(--card))_0%,hsl(var(--background))_85%)]";

const CleaningCostGuidePage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }}
      />
      <Section className={heroSurface}>
        <StarsBackground
          className="absolute inset-0 opacity-55"
          starColor="#09484F"
          pointerEvents={false}
        />
        <div className="relative z-10">
          <SectionHeader
            eyebrow="Guide"
            title={`Cleaning Cost Guide in ${AREA}`}
            description="A Plymouth guide to what affects cleaning prices, when to choose each service, and how to get an instant quote."
          />
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Primary page:{" "}
            <Link
              href="/cleaning-prices-plymouth"
              className="text-foreground underline"
            >
              Cleaning prices in Plymouth
            </Link>
            .
          </p>
        </div>
      </Section>

      <Section className={`${sectionBase} ${surfacePrimary}`}>
        <AnimationContainer delay={0.2}>
          <SectionHeader
            eyebrow="Who this is for"
            title="Homeowners and tenants comparing cleaning options"
            description="Use this guide to understand pricing drivers and decide which service level fits your Plymouth property."
          />
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.25}>
          <SectionHeader
            eyebrow="Cost factors"
            title="What affects cleaning cost in Plymouth"
            description="Pricing is calculated by the booking calculator and adjusts based on your details."
            align="left"
          />
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {costFactors.map((item) => (
              <CheckListItem key={item}>{item}</CheckListItem>
            ))}
          </ul>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.3}>
          <SectionHeader
            eyebrow="Choosing a service"
            title="Regular vs deep vs end of tenancy: when to choose"
            description="Match the service level to the condition of your home and inspection needs."
            align="left"
          />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card className="border-none bg-card/85">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">
                  Regular cleaning
                </CardTitle>
                <CardDescription>
                  Ongoing upkeep for already tidy homes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/basic-clean">Basic Clean details</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-none bg-card/85">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">
                  Deep cleaning
                </CardTitle>
                <CardDescription>
                  Extra detail for build-up and touch points.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/intermediate-clean">Intermediate Clean details</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-none bg-card/85">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">
                  End of tenancy
                </CardTitle>
                <CardDescription>
                  Most thorough reset for inspections and move-outs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/advanced-clean">Advanced Clean details</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.32}>
          <SectionHeader
            eyebrow="Add-ons"
            title="Oven cleaning: when it changes price or time"
            description="Oven cleaning is available as an add-on. It adds time, so we price it separately inside the calculator."
            align="left"
          />
          <p className="mt-4 text-sm text-muted-foreground">
            If you need an oven clean, select it in the quote form so your price
            stays accurate.
          </p>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.35}>
          <SectionHeader
            eyebrow="Examples"
            title="Example scenarios (calculator-based)"
            description="These examples are generated from the same pricing logic as the booking calculator."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {pricingExamples.map((example) => (
              <Card key={example.title} className="border-none bg-card/85">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {example.title}
                  </CardTitle>
                  <CardDescription>{example.detail}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="text-2xl font-semibold text-foreground">
                    {example.price}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {example.priceLabel}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            For an exact quote, use the calculator and choose your service level,
            property size, and add-ons.
          </p>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.4}>
          <SectionHeader
            eyebrow="Quote"
            title="Get an instant quote"
            description="The calculator is the source of truth for Plymouth pricing."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/get-a-quote">Get a quote</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cleaning-prices-plymouth">Pricing guidance</Link>
            </Button>
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.45}>
          <SectionHeader
            eyebrow="Related"
            title="Related links"
            description="More Plymouth resources and booking options."
          />
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {relatedLinks.map((link) => (
              <Button key={link.href} variant="outline" asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </AnimationContainer>
      </Section>

      <Section>
        <CTAStrip
          title="Want your exact price?"
          description="Use the calculator to confirm service level, add-ons, and schedule."
          primaryHref="/get-a-quote"
          primaryLabel="Get an instant quote"
          secondaryHref="/cleaning-services-plymouth"
          secondaryLabel="View Plymouth services"
        />
      </Section>
    </MaxWidthWrapper>
  );
};

export default CleaningCostGuidePage;
