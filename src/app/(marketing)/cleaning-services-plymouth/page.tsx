import Link from "next/link";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import CTAStrip from "@/components/ui/cta-strip";
import FAQAccordion from "@/components/ui/faq-accordion";
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
  getServicePath,
  services,
} from "@/lib/seo/keywords";
import { generateMetadata } from "@/utils";

const PAGE = getPageByPath("/cleaning-services-plymouth");
const METADATA_TITLE = buildPageTitle(PAGE.path);
const METADATA_DESCRIPTION = PAGE.metaDescription;
const CANONICAL = PAGE.path;
const BASE_METADATA = generateMetadata({
  title: METADATA_TITLE,
  description: METADATA_DESCRIPTION,
});

export const metadata = {
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

const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: BRAND,
  url: "https://sparkandmend.co.uk",
  areaServed: AREA,
};

const SERVICE_SUMMARIES: Record<string, string> = {
  "basic-clean":
    "Regular house cleaning for already tidy homes that need a simple, reliable refresh.",
  "intermediate-clean":
    "Deep cleaning for build-up and touch points when you need a sharper reset.",
  "advanced-clean":
    "End of tenancy and deep cleaning for a full-property reset and detailed finish.",
  "commercial-cleaning":
    "Office and commercial cleaning with consistent visits and clear scope.",
};

const SERVICE_CARDS = services.map((service) => ({
  ...service,
  href: getServicePath(service.slug),
  summary: SERVICE_SUMMARIES[service.slug],
}));

const COMPARISON = [
  {
    title: "Basic Clean",
    bullets: [
      "Light upkeep for visible areas",
      "Best for already tidy homes",
      "Great for weekly or fortnightly routines",
    ],
  },
  {
    title: "Intermediate Clean",
    bullets: [
      "Deeper clean for build-up and touch points",
      "Ideal for monthly resets",
      "Extra detail in kitchens and bathrooms",
    ],
  },
  {
    title: "Advanced Clean",
    bullets: [
      "Full reset with the most detail",
      "Ideal for end of tenancy or first cleans",
      "Extra time on fixtures, edges, and build-up",
    ],
  },
  {
    title: "Commercial Cleaning",
    bullets: [
      "Offices, retail, and workspaces",
      "Flexible scheduling around your hours",
      "Consistent, checklist-based scope",
    ],
  },
];

const GUIDE_LINKS = [
  {
    title: "End of Tenancy Cleaning Checklist (Plymouth)",
    description: "Room-by-room checklist and inspection tips.",
    href: "/guides/end-of-tenancy-cleaning-checklist-plymouth",
  },
  {
    title: "Cleaning Cost Guide (Plymouth)",
    description: "What affects pricing and how to choose a service.",
    href: "/guides/cleaning-cost-guide-plymouth",
  },
  {
    title: "What Landlords Check (Plymouth)",
    description: "Inspection focus areas and deposit pain points.",
    href: "/guides/what-landlords-check-plymouth",
  },
  {
    title: "How Long Does a Deep Clean Take? (Plymouth)",
    description: "Timing factors and how deep cleaning compares.",
    href: "/guides/how-long-does-a-deep-clean-take-plymouth",
  },
];

const FAQS = [
  {
    question: "Do you only serve Plymouth?",
    answer:
      "Yes. Spark & Mend focuses exclusively on cleaning services in Plymouth.",
  },
  {
    question: "Are you the cleaners near me in Plymouth?",
    answer:
      "If you are in Plymouth, yes. We serve Plymouth only and confirm availability when you request a quote.",
  },
  {
    question: "Do you offer same-day or next-day cleaning?",
    answer:
      "We cannot promise same-day slots, but we will always check availability and confirm the earliest visit that works.",
  },
  {
    question: "How much does cleaning in Plymouth cost?",
    answer:
      "Pricing depends on the size and condition of the property. Use the booking calculator for a clear price in about 60 seconds.",
  },
  {
    question: "How long does a clean take?",
    answer:
      "Timings vary by service level and property size. Your quote includes an estimate and we confirm the booking details before the visit.",
  },
  {
    question: "Do you bring cleaning supplies?",
    answer:
      "Yes, we bring our own kit. If you prefer specific products, add a note in the booking form.",
  },
  {
    question: "Do you offer oven cleaning in Plymouth?",
    answer:
      "Yes. Oven cleaning is available as an add-on in the quote form so the price stays accurate.",
  },
  {
    question: "Can you support end of tenancy inspections?",
    answer:
      "Yes. Share any inventory checklist or agent requirements when you book and we align the scope to the inspection standard.",
  },
  {
    question: "Can you clean offices outside business hours?",
    answer:
      "Yes. We can schedule commercial cleaning around your opening hours to minimize disruption.",
  },
  {
    question: "What is the difference between regular, deep, and end of tenancy?",
    answer:
      "Regular cleaning keeps on top of visible areas. Deep cleaning adds more detail and build-up removal. End of tenancy is the most thorough reset for inspections and move-outs.",
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
const surfaceNeutral =
  "bg-[linear-gradient(135deg,hsl(var(--card))_0%,hsl(var(--background))_85%)]";

const CleaningServicesPlymouthPage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD),
        }}
      />
      <Section className={heroSurface}>
        <StarsBackground
          className="absolute inset-0 opacity-60"
          starColor="#09484F"
          pointerEvents={false}
        />
        <AnimationContainer delay={0.1} className="relative z-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="text-center lg:text-left">
              <SectionHeader
                eyebrow="Plymouth"
                title={`Cleaning Services in ${AREA}`}
                description={`${BRAND} is a Plymouth cleaning company providing domestic cleaners, deep cleaning, end of tenancy, and commercial cleaning across ${AREA}. AXA insured and trusted by Plymouth homes and local businesses.`}
                align="left"
              />
              <p className="mt-4 text-sm text-muted-foreground">
                We serve Plymouth only, with clear pricing and simple online
                booking. Same-day and next-day visits are subject to availability.
                Book a cleaner in Plymouth in minutes with the quote calculator.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
                <Button asChild>
                  <Link href="/get-a-quote">Arrange a FREE clean</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="#services">Browse services</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-3xl border border-border/60 bg-card/80 p-6 text-left shadow-[0_30px_70px_-55px_hsl(var(--primary)/0.45)]">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Service inventory
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {SERVICE_CARDS.map((service) => (
                  <li key={service.slug} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>{service.seoTitle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AnimationContainer>
      </Section>

      <Section id="services" className={`${sectionBase} ${surfacePrimary}`}>
        <AnimationContainer delay={0.2}>
          <SectionHeader
            eyebrow="Services"
            title="Services offered in Plymouth"
            description="Each service links to the full checklist, pricing, and booking flow."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {SERVICE_CARDS.map((service) => (
              <Card key={service.slug} className="border-none bg-card/85">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {service.seoTitle}
                  </CardTitle>
                  <CardDescription>{service.summary}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {service.displayName}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={service.href}>View details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.25}>
          <SectionHeader
            eyebrow="Comparison"
            title="Which clean do I need?"
            description="A quick guide to match the clean to your situation in Plymouth."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {COMPARISON.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border/60 bg-card/90 p-5"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {item.bullets.map((bullet) => (
                    <CheckListItem key={bullet}>{bullet}</CheckListItem>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/cleaning-prices-plymouth">
                See cleaning prices in Plymouth
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cleaning-results-plymouth">
                See cleaning results in Plymouth
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/faq-plymouth">Read Plymouth cleaning FAQs</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/get-a-quote">Get a Plymouth quote</Link>
            </Button>
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfacePrimary}`}>
        <AnimationContainer delay={0.28}>
          <SectionHeader
            eyebrow="Guides"
            title="Plymouth cleaning guides"
            description="Support guides that answer the questions people ask before they book."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {GUIDE_LINKS.map((guide) => (
              <Card key={guide.href} className="border-none bg-card/85">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {guide.title}
                  </CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={guide.href}>Read the guide</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.3}>
          <SectionHeader
            eyebrow="FAQs"
            title="Answers for Plymouth clients"
            description="Quick answers to common questions before you book."
          />
          <FAQAccordion
            items={FAQS.map((faq, index) => ({
              id: `plymouth-faq-${index}`,
              question: faq.question,
              answer: faq.answer,
            }))}
            className="mt-8"
          />
        </AnimationContainer>
      </Section>

      <Section>
        <CTAStrip
          title="Ready to book a Plymouth clean?"
          description="Arrange a FREE clean, choose your service, and book online in minutes."
          primaryHref="/get-a-quote"
          primaryLabel="Arrange a FREE clean"
        />
      </Section>
    </MaxWidthWrapper>
  );
};

export default CleaningServicesPlymouthPage;
