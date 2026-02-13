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

const PAGE = getPageByPath("/case-studies");
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

const CASE_STUDIES = [
  {
    title: "End of tenancy clean - Plymouth (Template)",
    description: "Template case study using gallery assets and TODOs.",
    href: "/case-studies/end-of-tenancy-plymouth",
  },
  {
    title: "Deep clean - Plymouth (Template)",
    description: "Template case study using gallery assets and TODOs.",
    href: "/case-studies/deep-clean-plymouth",
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

const CaseStudiesPage = () => {
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
            eyebrow="Case studies"
            title="Plymouth Cleaning Case Studies"
            description="Template case studies that will be replaced with real job details and client feedback."
          />
          <p className="mt-4 text-sm text-muted-foreground text-center">
            These are templates only. Replace placeholders with real job details
            when approved.
          </p>
        </div>
      </Section>

      <Section className={`${sectionBase} ${surfacePrimary}`}>
        <AnimationContainer delay={0.2}>
          <SectionHeader
            eyebrow="Templates"
            title="First case study templates"
            description="Each template links to a guide, service page, and quote flow."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {CASE_STUDIES.map((study) => (
              <Card key={study.href} className="border-none bg-card/85">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {study.title}
                  </CardTitle>
                  <CardDescription>{study.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href={study.href}>View template</Link>
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
            eyebrow="Next"
            title="Ready for real results?"
            description="Visit the results gallery or request a quote to plan your clean."
          />
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/cleaning-results-plymouth">Results gallery</Link>
            </Button>
            <Button asChild>
              <Link href="/get-a-quote">Get a quote</Link>
            </Button>
          </div>
        </AnimationContainer>
      </Section>

      <Section>
        <CTAStrip
          title="Want to see a real before and after?"
          description="Browse recent Plymouth transformations or get a tailored quote."
          primaryHref="/cleaning-results-plymouth"
          primaryLabel="See results"
          secondaryHref="/get-a-quote"
          secondaryLabel="Get a quote"
        />
      </Section>
    </MaxWidthWrapper>
  );
};

export default CaseStudiesPage;
