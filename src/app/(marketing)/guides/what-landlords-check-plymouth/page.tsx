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

const PAGE = getPageByPath("/guides/what-landlords-check-plymouth");
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

const inspectionAreas = [
  "Grease build-up in kitchens, cooker hood, and hob areas",
  "Limescale on taps, shower screens, and fixtures",
  "Inside cupboards when required by inventory",
  "Skirting boards, door frames, and edges",
  "Floors, corners, and high-touch points",
];

const depositPainPoints = [
  "Oven build-up and appliance residue",
  "Bathroom limescale that was missed",
  "Dust on skirting and ledges",
  "Marks on doors or walls",
  "Bins and food waste left behind",
];

const FAQS = [
  {
    question: "Do you guarantee deposit return?",
    answer:
      "No. We clean to a detailed standard and can follow checklists, but outcomes depend on the property condition and tenancy agreement.",
  },
  {
    question: "Can you clean to my letting agent checklist?",
    answer:
      "Yes. Share the checklist in your quote notes and we will align the clean to those priorities.",
  },
  {
    question: "Is oven cleaning included?",
    answer:
      "Oven cleaning is available as an add-on in the quote form so pricing stays accurate.",
  },
  {
    question: "How soon can I book an end of tenancy clean?",
    answer:
      "Availability is confirmed after you request a quote. Book as early as possible if you have an inspection date.",
  },
  {
    question: "Do you cover Plymouth only?",
    answer: "Yes. Spark & Mend serves Plymouth only.",
  },
  {
    question: "What if the property needs more than a regular clean?",
    answer:
      "Advanced Clean is the most detailed option and is best for move-outs or inspection resets.",
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
  { label: "End of tenancy cleaning", href: "/advanced-clean" },
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

const WhatLandlordsCheckGuide = () => {
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
            title={`What Landlords Check in ${AREA}`}
            description="Inspection focus areas for Plymouth rentals and how to prepare for a move-out clean."
          />
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Primary service:{" "}
            <Link href="/advanced-clean" className="text-foreground underline">
              End of Tenancy Cleaning
            </Link>
            .
          </p>
        </div>
      </Section>

      <Section className={`${sectionBase} ${surfacePrimary}`}>
        <AnimationContainer delay={0.2}>
          <SectionHeader
            eyebrow="Who this is for"
            title="Plymouth tenants, landlords, and letting agents"
            description="If you have an inspection or move-out coming up, this guide highlights the areas most commonly reviewed."
          />
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.25}>
          <SectionHeader
            eyebrow="Inspection focus"
            title="Inspection focus areas"
            description="These are the surfaces that most often appear on inspection checklists."
            align="left"
          />
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {inspectionAreas.map((item) => (
              <CheckListItem key={item}>{item}</CheckListItem>
            ))}
          </ul>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.3}>
          <SectionHeader
            eyebrow="Deposits"
            title="Common deposit pain points"
            description="We cannot guarantee outcomes, but these are typical areas where issues arise."
            align="left"
          />
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {depositPainPoints.map((item) => (
              <CheckListItem key={item}>{item}</CheckListItem>
            ))}
          </ul>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.32}>
          <SectionHeader
            eyebrow="Our approach"
            title="How our end of tenancy clean is structured"
            description="Advanced Clean is a checklist-led service designed for inspections and move-outs."
            align="left"
          />
          <p className="mt-4 text-sm text-muted-foreground">
            Share your landlord or letting agent checklist in the quote notes so
            we can align the scope. For the full checklist, see the{" "}
            <Link href="/advanced-clean" className="text-foreground underline">
              Advanced Clean page
            </Link>
            {" "}and the{" "}
            <Link href="/faq-plymouth" className="text-foreground underline">
              Plymouth FAQs
            </Link>
            .
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/get-a-quote?service=advanced">
                Get an end of tenancy quote
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/advanced-clean">View Advanced Clean</Link>
            </Button>
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.4}>
          <SectionHeader
            eyebrow="FAQs"
            title="Landlord inspection FAQs"
            description="Quick answers for Plymouth tenants and landlords."
          />
          <FAQAccordion
            items={FAQS.map((item, index) => ({
              id: `landlord-checks-faq-${index}`,
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
          title="Need a checklist-led clean?"
          description="Book an Advanced Clean and share your inspection checklist."
          primaryHref="/get-a-quote?service=advanced"
          primaryLabel="Arrange a FREE clean"
          secondaryHref="/cleaning-prices-plymouth"
          secondaryLabel="See cleaning prices"
        />
      </Section>
    </MaxWidthWrapper>
  );
};

export default WhatLandlordsCheckGuide;
