import type { Metadata } from "next";
import Link from "next/link";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import CTAStrip from "@/components/ui/cta-strip";
import FAQAccordion from "@/components/ui/faq-accordion";
import { Button } from "@/components/ui/button";
import { CheckListItem } from "@/components/ui/check-list";
import { Section, SectionHeader } from "@/components/ui/section";
import { StarsBackground } from "@/components/ui/stars-background";
import { AREA, BRAND, buildPageTitle, getPageByPath } from "@/lib/seo/keywords";
import { generateMetadata } from "@/utils";

const PAGE = getPageByPath(
  "/guides/how-long-does-a-deep-clean-take-plymouth"
);
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

const durationFactors = [
  "Property size and number of rooms",
  "Number of bathrooms and limescale build-up",
  "Current condition and clutter level",
  "Add-ons like oven cleaning or interior cupboards",
  "Access details and priorities shared in your notes",
];

const FAQS = [
  {
    question: "Is a deep clean always a one-off?",
    answer:
      "It is usually a one-off reset, but some homes book deep cleaning on a monthly schedule.",
  },
  {
    question: "Does oven cleaning add time?",
    answer:
      "Yes. Oven cleaning is an add-on and increases the visit time, so it is priced separately in the quote form.",
  },
  {
    question: "Can I get an estimate before booking?",
    answer:
      "Yes. The booking calculator provides a tailored estimate based on your property details.",
  },
  {
    question: "Do you cover Plymouth only?",
    answer: "Yes. Spark & Mend serves Plymouth only.",
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const relatedLinks = [
  { label: "Plymouth services hub", href: "/cleaning-services-plymouth" },
  { label: "Cleaning prices in Plymouth", href: "/cleaning-prices-plymouth" },
  { label: "Plymouth cleaning FAQs", href: "/faq-plymouth" },
  { label: "Cleaning results gallery", href: "/cleaning-results-plymouth" },
  { label: "Deep cleaning service", href: "/intermediate-clean" },
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

const DeepCleanTimingGuide = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
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
            title={`How Long Does a Deep Clean Take in ${AREA}?`}
            description="A Plymouth guide to what affects deep cleaning time and how it compares to regular cleaning."
          />
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Primary service:{" "}
            <Link href="/intermediate-clean" className="text-foreground underline">
              Deep Cleaning (Intermediate Clean)
            </Link>
            .
          </p>
        </div>
      </Section>

      <Section className={`${sectionBase} ${surfacePrimary}`}>
        <AnimationContainer delay={0.2}>
          <SectionHeader
            eyebrow="Who this is for"
            title="Homeowners booking a deep clean in Plymouth"
            description="If your home needs a sharper reset or spring clean, this guide explains what drives the timing."
          />
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.25}>
          <SectionHeader
            eyebrow="Timing factors"
            title="What changes deep clean duration"
            description="Timing depends on your space and the level of build-up. Your quote confirms the estimate."
            align="left"
          />
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {durationFactors.map((item) => (
              <CheckListItem key={item}>{item}</CheckListItem>
            ))}
          </ul>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.3}>
          <SectionHeader
            eyebrow="Comparison"
            title="Deep clean vs regular clean"
            description="Deep cleaning adds detail and takes longer than a regular upkeep visit."
            align="left"
          />
          <p className="mt-4 text-sm text-muted-foreground">
            If you want a lighter, ongoing service, start with{" "}
            <Link href="/basic-clean" className="text-foreground underline">
              Regular House Cleaning
            </Link>
            . For build-up or a deeper reset, choose{" "}
            <Link href="/intermediate-clean" className="text-foreground underline">
              Intermediate Clean
            </Link>
            .
          </p>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.32}>
          <SectionHeader
            eyebrow="Get a quote"
            title="Confirm timing with the calculator"
            description="We provide a tailored estimate based on your property details and add-ons."
            align="left"
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/get-a-quote?service=intermediate">
                Get a deep clean quote
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/intermediate-clean">Deep cleaning details</Link>
            </Button>
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.4}>
          <SectionHeader
            eyebrow="FAQs"
            title="Deep clean timing FAQs"
            description="Quick answers for Plymouth clients."
          />
          <FAQAccordion
            items={FAQS.map((item, index) => ({
              id: `deep-clean-timing-faq-${index}`,
              question: item.question,
              answer: item.answer,
            }))}
            className="mt-8"
          />
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
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
          title="Need a deep clean?"
          description="Use the calculator for a tailored estimate and confirmed availability."
          primaryHref="/get-a-quote?service=intermediate"
          primaryLabel="Arrange a FREE clean"
          secondaryHref="/cleaning-prices-plymouth"
          secondaryLabel="See cleaning prices"
        />
      </Section>
    </MaxWidthWrapper>
  );
};

export default DeepCleanTimingGuide;
