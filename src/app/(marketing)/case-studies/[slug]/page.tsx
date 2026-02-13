import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import BeforeAfterGallery from "@/components/marketing/before-after-gallery";
import CTAStrip from "@/components/ui/cta-strip";
import { Button } from "@/components/ui/button";
import { CheckListItem } from "@/components/ui/check-list";
import { Section, SectionHeader } from "@/components/ui/section";
import { StarsBackground } from "@/components/ui/stars-background";
import {
  BEFORE_AFTER_GROUPS,
} from "@/lib/gallery/gallery-data";
import {
  BRAND,
  buildPageTitle,
  getPageByPath,
} from "@/lib/seo/keywords";
import { generateMetadata as buildMetadata } from "@/utils";

const CASE_STUDIES = [
  {
    slug: "end-of-tenancy-plymouth",
    title: "End of tenancy clean - Plymouth (Template)",
    description:
      "Template case study for an end of tenancy clean in Plymouth. Replace placeholders with real job details.",
    serviceHref: "/advanced-clean",
    quoteHref: "/get-a-quote?service=advanced",
    guideHref: "/guides/end-of-tenancy-cleaning-checklist-plymouth",
    galleryGroupTitle: "Advanced Clean",
    summary:
      "Example scenario (illustrative): A Plymouth rental needing a full move-out reset and checklist-led clean.",
    highlights: [
      "Kitchen degrease and fixture detailing",
      "Bathroom limescale focus and surface reset",
      "Skirting, doors, and touch points cleaned",
      "Oven cleaning added where required",
    ],
  },
  {
    slug: "deep-clean-plymouth",
    title: "Deep clean - Plymouth (Template)",
    description:
      "Template case study for a Plymouth deep clean. Replace placeholders with real job details.",
    serviceHref: "/intermediate-clean",
    quoteHref: "/get-a-quote?service=intermediate",
    guideHref: "/guides/how-long-does-a-deep-clean-take-plymouth",
    galleryGroupTitle: "Intermediate Clean",
    summary:
      "Example scenario (illustrative): A Plymouth home needing a detailed reset on build-up and touch points.",
    highlights: [
      "Kitchen worktops and splashbacks detailed",
      "Bathroom tiles, taps, and screens refreshed",
      "High-touch areas and skirting cleaned",
      "Floors vacuumed, edges detailed, and mopped",
    ],
  },
] as const;

type CaseStudy = (typeof CASE_STUDIES)[number];

export const generateStaticParams = () =>
  CASE_STUDIES.map((study) => ({ slug: study.slug }));

export const generateMetadata = ({
  params,
}: {
  params: { slug: string };
}): Metadata => {
  const study = CASE_STUDIES.find((item) => item.slug === params.slug);
  if (!study) {
    return buildMetadata({ title: "Case study" });
  }
  const path = `/case-studies/${study.slug}` as const;
  const page = getPageByPath(path);
  const title = buildPageTitle(page.path);
  const description = page.metaDescription;
  const base = buildMetadata({ title, description });

  return {
    ...base,
    alternates: {
      canonical: page.path,
    },
    openGraph: {
      ...(base.openGraph ?? {}),
      title,
      description,
      url: page.path,
    },
    twitter: {
      ...(base.twitter ?? {}),
      title,
      description,
    },
  };
};

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

const CaseStudyPage = ({ params }: { params: { slug: string } }) => {
  const study = CASE_STUDIES.find((item) => item.slug === params.slug);
  if (!study) {
    notFound();
  }

  const lastModified = new Date().toISOString();
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.description,
    datePublished: lastModified,
    dateModified: lastModified,
    author: {
      "@type": "Organization",
      name: BRAND,
    },
  };

  const galleryGroup = BEFORE_AFTER_GROUPS.find(
    (group) => group.title === study.galleryGroupTitle
  );
  const galleryPair = galleryGroup?.pairs[0];

  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Section className={heroSurface}>
        <StarsBackground
          className="absolute inset-0 opacity-55"
          starColor="#09484F"
          pointerEvents={false}
        />
        <div className="relative z-10">
          <SectionHeader
            eyebrow="Case study"
            title={study.title}
            description={study.description}
          />
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Template only. Replace placeholders with real job details and client
            feedback.
          </p>
        </div>
      </Section>

      <Section className={`${sectionBase} ${surfacePrimary}`}>
        <AnimationContainer delay={0.2}>
          <SectionHeader
            eyebrow="Summary"
            title="Example scenario (illustrative)"
            description={study.summary}
            align="left"
          />
          <p className="mt-4 text-sm text-muted-foreground">
            Client feedback: TODO. Job timing: TODO. Property details: TODO.
          </p>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.25}>
          <SectionHeader
            eyebrow="What was done"
            title="Checklist highlights"
            description="Replace with the exact checklist items once a real job is approved."
            align="left"
          />
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            {study.highlights.map((item) => (
              <CheckListItem key={item}>{item}</CheckListItem>
            ))}
          </ul>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.3}>
          <SectionHeader
            eyebrow="Before and after"
            title="From our results gallery"
            description="Gallery assets are used here until real case study photos are added."
          />
          {galleryPair ? (
            <div className="mt-8">
              <BeforeAfterGallery
                items={[
                  {
                    beforeSrc: galleryPair.before.src,
                    beforeAlt: galleryPair.before.alt,
                    afterSrc: galleryPair.after.src,
                    afterAlt: galleryPair.after.alt,
                    caption: `${galleryPair.caption} (from our results gallery)`,
                  },
                ]}
              />
            </div>
          ) : (
            <div className="mt-6 text-sm text-muted-foreground">
              <p>Before photo: TODO</p>
              <p>After photo: TODO</p>
            </div>
          )}
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.35}>
          <SectionHeader
            eyebrow="Next steps"
            title="Book a similar clean"
            description="Use the calculator to confirm scope and pricing."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={study.quoteHref}>Get a quote</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={study.serviceHref}>View service details</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={study.guideHref}>Related guide</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cleaning-results-plymouth">Results gallery</Link>
            </Button>
          </div>
        </AnimationContainer>
      </Section>

      <Section>
        <CTAStrip
          title="Need a Plymouth clean?"
          description="Book online in minutes and confirm your checklist requirements."
          primaryHref={study.quoteHref}
          primaryLabel="Arrange a FREE clean"
          secondaryHref={study.serviceHref}
          secondaryLabel="View service"
        />
      </Section>
    </MaxWidthWrapper>
  );
};

export default CaseStudyPage;
