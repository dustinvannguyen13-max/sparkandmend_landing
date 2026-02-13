import type { Metadata } from "next";
import Link from "next/link";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import BeforeAfterGallery from "@/components/marketing/before-after-gallery";
import CTAStrip from "@/components/ui/cta-strip";
import { MotionCarousel } from "@/components/ui/motion-carousel";
import { Section, SectionHeader } from "@/components/ui/section";
import { StarsBackground } from "@/components/ui/stars-background";
import { AREA, BRAND } from "@/lib/seo/keywords";
import {
  BEFORE_AFTER_GROUPS,
  GALLERY_SECTIONS,
} from "@/lib/gallery/gallery-data";
import { generateMetadata } from "@/utils";

const TITLE = `Cleaning Results in ${AREA} | ${BRAND}`;
const DESCRIPTION =
  "See before-and-after cleaning results in Plymouth from Spark & Mend. Browse real transformations and arrange a free clean in minutes.";
const CANONICAL = "/cleaning-results-plymouth";

const BASE_METADATA = generateMetadata({
  title: TITLE,
  description: DESCRIPTION,
});

export const metadata: Metadata = {
  ...BASE_METADATA,
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    ...(BASE_METADATA.openGraph ?? {}),
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
  },
  twitter: {
    ...(BASE_METADATA.twitter ?? {}),
    title: TITLE,
    description: DESCRIPTION,
  },
};

const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: BRAND,
  url: "https://sparkandmend.co.uk",
  areaServed: AREA,
};

const heroSurface =
  "relative overflow-hidden rounded-[36px] border border-border/50 bg-[radial-gradient(120%_120%_at_80%_0%,hsl(var(--background))_0%,hsl(var(--subtle))_45%,hsl(var(--background))_100%)] px-6 pt-10 pb-12 md:px-12 md:pt-12 md:pb-14 shadow-[0_45px_100px_-70px_hsl(var(--primary)/0.45)]";
const sectionBase =
  "relative overflow-hidden rounded-[32px] border border-border/50 px-6 py-10 md:px-10 md:py-12 shadow-[0_30px_80px_-60px_hsl(var(--primary)/0.35)]";
const surfacePrimary =
  "bg-[linear-gradient(135deg,hsl(var(--primary)/0.08),hsl(var(--background))_70%)]";

const CleaningResultsPlymouthPage = () => {
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
          className="absolute inset-0 opacity-55"
          starColor="#09484F"
          pointerEvents={false}
        />
        <div className="relative z-10">
          <SectionHeader
            eyebrow="Results"
            title={`Cleaning Results in ${AREA}`}
            description="Before-and-after examples from real Spark & Mend cleans across Plymouth. Results vary by space, schedule, and service level."
          />
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Serving Plymouth only. Want your own transformation?{" "}
            <Link href="/get-a-quote" className="text-foreground underline">
              Arrange a FREE clean
            </Link>
            .
          </p>
        </div>
      </Section>

      <Section className={`${sectionBase} ${surfacePrimary}`}>
        <AnimationContainer delay={0.2}>
          <SectionHeader
            eyebrow="Before & After"
            title="Real before-and-after cleaning results"
            description="Each pair shows a typical transformation from recent Plymouth cleans."
          />
          <p className="mt-4 text-sm text-muted-foreground">
            Examples are drawn from different Plymouth homes and visits. Results
            vary by space, condition, and service level.
          </p>
          <div className="mt-10 grid gap-10">
            {BEFORE_AFTER_GROUPS.map((group) => (
              <div
                key={group.title}
                className="rounded-3xl border border-border/60 bg-card/90 p-6"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {group.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {group.description}
                  </p>
                </div>
                {group.pairs.length > 0 ? (
                  <div className="mt-6">
                    <BeforeAfterGallery
                      items={group.pairs.map((pair) => ({
                        beforeSrc: pair.before.src,
                        beforeAlt: pair.before.alt,
                        afterSrc: pair.after.src,
                        afterAlt: pair.after.alt,
                        caption: pair.caption,
                      }))}
                    />
                  </div>
                ) : (
                  <p className="mt-6 text-sm text-muted-foreground">
                    We are building our before/after library for commercial spaces.
                    More pairs are added regularly.
                  </p>
                )}
              </div>
            ))}
          </div>
        </AnimationContainer>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {GALLERY_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-[0_24px_60px_-48px_hsl(var(--primary)/0.35)]"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </div>
              <div className="mt-6">
                <MotionCarousel slides={section.slides} options={{ loop: true }} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <CTAStrip
          title="Want results like these?"
          description="Use the booking calculator to arrange a free clean and confirm the details."
          primaryHref="/get-a-quote"
          primaryLabel="Arrange a FREE clean"
          secondaryHref="tel:07452824799"
          secondaryLabel="Call or WhatsApp us"
        />
      </Section>
    </MaxWidthWrapper>
  );
};

export default CleaningResultsPlymouthPage;
