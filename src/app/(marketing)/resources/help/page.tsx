import { MaxWidthWrapper } from "@/components";
import CTAStrip from "@/components/ui/cta-strip";
import { MotionCarousel } from "@/components/ui/motion-carousel";
import { Section, SectionHeader } from "@/components/ui/section";

const PLACEHOLDER_SLIDES = [
  {
    src: "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.157589-XRPOXTQECTKYUAVFQOKA/imgg-od3-4foq0c2e.png?format=2500w",
    alt: "Spark & Mend cleaning gallery image 1",
  },
  {
    src: "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.460308-XCMNTOMRCKQFUOKREBBC/imgg-od3-4wz7yy4a.png?format=2500w",
    alt: "Spark & Mend cleaning gallery image 2",
  },
  {
    src: "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.032175-FEUGECPAUDAFVQTGEIVS/imgg-od3-sa5ajg65.png?format=2500w",
    alt: "Spark & Mend cleaning gallery image 3",
  },
];

const buildSlides = (label: string) =>
  PLACEHOLDER_SLIDES.map((slide, index) => ({
    ...slide,
    alt: `${label} gallery image ${index + 1}`,
    label: `${label} ${index + 1}`,
  }));

const GALLERY_SECTIONS = [
  {
    title: "Basic Clean",
    description: "Regular upkeep for already tidy homes and busy weeks.",
    slides: buildSlides("Basic clean"),
  },
  {
    title: "Intermediate Clean",
    description: "A deeper clean for when it is getting on top of you.",
    slides: buildSlides("Intermediate clean"),
  },
  {
    title: "Advanced Clean",
    description: "Full reset detail work for seasonal and end-of-tenancy cleans.",
    slides: buildSlides("Advanced clean"),
  },
  {
    title: "Commercial Cleaning",
    description: "Workspaces, studios, and shared areas kept client-ready.",
    slides: buildSlides("Commercial cleaning"),
  },
];

const GalleryPage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="pt-6">
        <SectionHeader
          eyebrow="Gallery"
          title="A look at recent Spark & Mend cleans"
          description="Browse real-world examples of the finishes we deliver across Plymouth."
        />
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
          title="Want a tailored quote for your space?"
          description="Get a fast estimate and choose a slot that works for you."
          primaryHref="/get-a-quote"
          primaryLabel="Get an Instant Quote"
          secondaryHref="tel:07452824799"
          secondaryLabel="Call or WhatsApp us"
        />
      </Section>
    </MaxWidthWrapper>
  );
};

export default GalleryPage;
