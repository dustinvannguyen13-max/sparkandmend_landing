import { MaxWidthWrapper } from "@/components";
import CTAStrip from "@/components/ui/cta-strip";
import { MotionCarousel } from "@/components/ui/motion-carousel";
import { Section, SectionHeader } from "@/components/ui/section";
import { StarsBackground } from "@/components/ui/stars-background";

const BASIC_SLIDES = [
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/sofa-before.jpg",
    alt: "Sofa before a routine clean in a Plymouth home",
    label: "Sofa before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/sofa-clean.jpg",
    alt: "Sofa after a routine clean with refreshed fabric",
    label: "Sofa after",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/sink-component-clean.jpg",
    alt: "Clean bathroom sink and fixtures",
    label: "Bathroom sink",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/kitchen-sink-component-clean.jpg",
    alt: "Clean kitchen sink and fittings",
    label: "Kitchen sink",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-shed-clean.jpg",
    alt: "Cleaned home shed interior",
    label: "Shed clean",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/garden-shed-clean.jpg",
    alt: "Garden shed cleaned and organised",
    label: "Garden shed",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/clean-sink.jpg",
    alt: "Clean sink after a routine visit",
    label: "Clean sink",
  },
];

const INTERMEDIATE_SLIDES = [
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/sofa-stain.jpg",
    alt: "Sofa stain before a deeper clean",
    label: "Stain before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/sofa-stain-cleaned.jpg",
    alt: "Sofa stain removed after a deeper clean",
    label: "Stain after",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/sofa-dirt.jpg",
    alt: "Sofa showing build-up before detailed cleaning",
    label: "Build-up",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-carpet-stain.jpg",
    alt: "Carpet stain before cleaning",
    label: "Carpet stain",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-sink-dirty.jpg",
    alt: "Home sink before cleaning",
    label: "Sink before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-shower-dirty.jpg",
    alt: "Home shower before cleaning",
    label: "Shower before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/bathroom-drain-dirty.jpg",
    alt: "Bathroom drain before cleaning",
    label: "Drain before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/mattress-clean.jpg",
    alt: "Mattress after cleaning",
    label: "Mattress clean",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/mattress-clean-2.jpg",
    alt: "Mattress refreshed after cleaning",
    label: "Mattress clean 2",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/foot-stool-dirty.jpg",
    alt: "Foot stool before cleaning",
    label: "Foot stool before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/foot-stool-clean.jpg",
    alt: "Foot stool after cleaning",
    label: "Foot stool after",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/carpet-stain-removed-clean.jpg",
    alt: "Carpet stain removed after cleaning",
    label: "Carpet stain removed",
  },
];

const ADVANCED_SLIDES = [
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-dirty-before.jpg",
    alt: "Oven before a full reset clean",
    label: "Oven before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-dirty-4.jpg",
    alt: "Oven detail clean in progress",
    label: "Oven detail",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-dirty.jpg",
    alt: "Oven build-up before a deep clean",
    label: "Oven build-up",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-clean-2.jpg",
    alt: "Cleaned oven interior",
    label: "Oven clean 2",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-clean-3.jpg",
    alt: "Oven interior after detailing",
    label: "Oven clean 3",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-cleaned.jpg",
    alt: "Oven after a deep clean",
    label: "Oven after",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-extractor-dirty.jpg",
    alt: "Extractor hood before cleaning",
    label: "Extractor before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-extractor-clean.jpg",
    alt: "Extractor hood after cleaning",
    label: "Extractor after",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-vent-clean.jpg",
    alt: "Cleaned home vent cover",
    label: "Vent clean",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-drain-dirty.jpg",
    alt: "Drain before cleaning",
    label: "Drain before",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/home-grill-clean.jpg",
    alt: "Cleaned home grill surface",
    label: "Grill clean",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/fence-moss-vs-clean.jpg",
    alt: "Fence cleaned with moss removed",
    label: "Fence clean",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/end-of-tenancy-clean.jpg",
    alt: "End of tenancy clean finish",
    label: "End of tenancy",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/dtc.png",
    alt: "Deep clean detail close-up",
    label: "Deep clean detail",
  },
];

const COMMERCIAL_SLIDES = [
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/restaurant-kitchen-clean-1.jpg",
    alt: "Commercial kitchen cleaned surfaces",
    label: "Kitchen clean 1",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/restaurant-kitchen-clean-2.jpg",
    alt: "Restaurant kitchen worktops cleaned",
    label: "Kitchen clean 2",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/restaurant-kitchen-clean-3.jpg",
    alt: "Commercial kitchen prep area cleaned",
    label: "Kitchen clean 3",
  },
  {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/restaurant-kitchen-clean-4.jpg",
    alt: "Cleaned restaurant kitchen service area",
    label: "Kitchen clean 4",
  },
];

const GALLERY_SECTIONS = [
  {
    title: "Basic Clean",
    description: "Regular upkeep for already tidy homes and busy weeks.",
    slides: BASIC_SLIDES,
  },
  {
    title: "Intermediate Clean",
    description: "A deeper clean for when it is getting on top of you.",
    slides: INTERMEDIATE_SLIDES,
  },
  {
    title: "Advanced Clean",
    description: "Full reset detail work for seasonal and end-of-tenancy cleans.",
    slides: ADVANCED_SLIDES,
  },
  {
    title: "Commercial Cleaning",
    description: "Workspaces, studios, and shared areas kept client-ready.",
    slides: COMMERCIAL_SLIDES,
  },
];

const heroSurface =
  "relative overflow-hidden rounded-[36px] border border-border/50 bg-[radial-gradient(120%_120%_at_80%_0%,hsl(var(--background))_0%,hsl(var(--subtle))_45%,hsl(var(--background))_100%)] px-6 pt-10 pb-12 md:px-12 md:pt-12 md:pb-14 shadow-[0_45px_100px_-70px_hsl(var(--primary)/0.45)]";

const GalleryPage = () => {
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
            eyebrow="Gallery"
            title="A look at recent Spark & Mend cleans"
            description="Browse real-world examples of the finishes we deliver across Plymouth."
          />
        </div>
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
          description="Get a fixed instant quote with the calculator and book instantly."
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
