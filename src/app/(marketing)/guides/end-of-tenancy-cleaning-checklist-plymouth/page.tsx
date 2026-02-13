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
  "/guides/end-of-tenancy-cleaning-checklist-plymouth"
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

const FAQS = [
  {
    question: "Is this checklist suitable for Plymouth rentals?",
    answer:
      "Yes. It focuses on the areas Plymouth landlords and letting agents typically review during inspections.",
  },
  {
    question: "Do you offer oven cleaning?",
    answer:
      "Yes. Oven cleaning is available as an add-on during the quote process so pricing stays accurate.",
  },
  {
    question: "Will this guarantee my deposit back?",
    answer:
      "No. We clean to a detailed standard and can follow checklists, but deposit outcomes depend on the property condition and tenancy agreement.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "Book as early as you can. Availability is confirmed after you request a quote.",
  },
  {
    question: "Can you work to a letting agent checklist?",
    answer:
      "Yes. Share it in your quote notes and we will align the clean to those requirements.",
  },
  {
    question: "Do I need to be home?",
    answer:
      "No. Many clients provide access details ahead of time and we confirm the plan before arrival.",
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

const roomChecklist = [
  "Entryways and doors wiped",
  "Light switches and handles cleaned",
  "Skirting boards dusted",
  "Floors vacuumed and mopped",
];

const kitchenChecklist = [
  "Worktops, cupboard fronts, and splashbacks cleaned",
  "Sink, taps, and hob exterior detailed",
  "Appliance exteriors wiped",
  "Bins emptied and reset",
  "Oven cleaning available as an add-on",
];

const bathroomChecklist = [
  "Toilet, sink, taps, and mirror cleaned",
  "Shower or bath surfaces detailed",
  "Tiles and grout spot attention",
  "Chrome polished for a sharper finish",
];

const livingChecklist = [
  "Dusting of reachable surfaces",
  "Skirting boards and edges cleaned",
  "Window sills and ledges wiped",
  "Floors vacuumed and mopped",
];

const landlordChecks = [
  "Kitchen grease build-up and cooker hood areas",
  "Limescale on taps, showers, and screens",
  "Inside cupboards when required by inventory",
  "Skirting, doors, and high-touch points",
  "Overall presentation of floors and visible surfaces",
];

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

const EndOfTenancyChecklistGuide = () => {
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
            title={`End of Tenancy Cleaning Checklist in ${AREA}`}
            description="A practical, room-by-room checklist for Plymouth rentals. Use it to prepare for inspections and move-outs."
          />
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Primary service: {" "}
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
            title="Tenants, landlords, and letting agents in Plymouth"
            description="If you are preparing for a move-out, inspection, or new tenancy, this checklist keeps expectations clear."
          />
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.25}>
          <SectionHeader
            eyebrow="Checklist"
            title="End of tenancy checklist (Plymouth): room-by-room"
            description="Use this as a starting point and align it with any inventory list your landlord or agent provides."
            align="left"
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card/90 p-5">
              <h3 className="text-lg font-semibold text-foreground">General areas</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {roomChecklist.map((item) => (
                  <CheckListItem key={item}>{item}</CheckListItem>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/90 p-5">
              <h3 className="text-lg font-semibold text-foreground">
                Bedrooms, living spaces, hallways
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {livingChecklist.map((item) => (
                  <CheckListItem key={item}>{item}</CheckListItem>
                ))}
              </ul>
            </div>
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.3}>
          <SectionHeader
            eyebrow="Kitchen"
            title="Kitchen checklist (including oven cleaning)"
            description="Kitchens are a common inspection focus, especially around grease and appliance build-up."
            align="left"
          />
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {kitchenChecklist.map((item) => (
              <CheckListItem key={item}>{item}</CheckListItem>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Need oven cleaning? Add it in the quote form so pricing stays accurate.
          </p>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.32}>
          <SectionHeader
            eyebrow="Bathroom"
            title="Bathroom checklist"
            description="Focus on limescale, tiles, and fixtures to align with inspection expectations."
            align="left"
          />
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {bathroomChecklist.map((item) => (
              <CheckListItem key={item}>{item}</CheckListItem>
            ))}
          </ul>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.34}>
          <SectionHeader
            eyebrow="Inspections"
            title="What landlords and letting agents typically check"
            description="Inspection lists vary, but these areas are commonly reviewed across Plymouth rentals."
            align="left"
          />
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {landlordChecks.map((item) => (
              <CheckListItem key={item}>{item}</CheckListItem>
            ))}
          </ul>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.36}>
          <SectionHeader
            eyebrow="Booking"
            title="How to book and timing"
            description="Share your checklist, preferred date, and any inspection deadline. Availability is always subject to confirmation."
            align="left"
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/get-a-quote?service=advanced">
                Get an end of tenancy quote
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/advanced-clean">See Advanced Clean details</Link>
            </Button>
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.4}>
          <SectionHeader
            eyebrow="FAQs"
            title="End of tenancy checklist FAQs"
            description="Quick answers for Plymouth tenants, landlords, and letting agents."
          />
          <FAQAccordion
            items={FAQS.map((item, index) => ({
              id: `tenancy-checklist-faq-${index}`,
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
          title="Need a full move-out reset?"
          description="Book an Advanced Clean and share your inspection checklist so we can align the scope."
          primaryHref="/get-a-quote?service=advanced"
          primaryLabel="Arrange a FREE clean"
          secondaryHref="/cleaning-prices-plymouth"
          secondaryLabel="See cleaning prices"
        />
      </Section>
    </MaxWidthWrapper>
  );
};

export default EndOfTenancyChecklistGuide;
