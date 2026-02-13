import type { Metadata } from "next";
import Image from "next/image";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import { Button } from "@/components/ui/button";
import CTAStrip from "@/components/ui/cta-strip";
import FAQAccordion from "@/components/ui/faq-accordion";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { BubbleBackground } from "@/components/ui/bubble-background";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckListItem } from "@/components/ui/check-list";
import { HeartMaskedImage } from "@/components/ui/heart-masked-image";
import { HighlightText } from "@/components/ui/highlight-text";
import { HexagonBackground } from "@/components/ui/hexagon-background";
import { PrimaryButton } from "@/components/ui/primary-button";
import ContactDetails from "@/components/ui/contact-details";
import { Section, SectionHeader } from "@/components/ui/section";
import { StarsBackground } from "@/components/ui/stars-background";
import { AREA, BRAND, buildServiceTitle, getServiceBySlug, getServicePath } from "@/lib/seo/keywords";
import BeforeAfterGallery from "@/components/marketing/before-after-gallery";
import ServiceInfoSection from "@/components/marketing/service-info-section";
import { REVIEWS, generateMetadata } from "@/utils";
import Link from "next/link";
import { CheckCheck } from "@/registry/icons/check-check";
import { ClipboardList } from "@/registry/icons/clipboard-list";
import { Key } from "@/registry/icons/key";
import { MessageCircleQuestion } from "@/registry/icons/message-circle-question";
import { MessageCircleX } from "@/registry/icons/message-circle-x";
import { Timer } from "@/registry/icons/timer";
import { Star } from "lucide-react";

const SERVICE = getServiceBySlug("advanced-clean");
const METADATA_TITLE = buildServiceTitle(SERVICE.slug);
const METADATA_DESCRIPTION = SERVICE.metaDescription;
const CANONICAL = getServicePath(SERVICE.slug);
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

const SERVICE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: SERVICE.schemaName,
  areaServed: AREA,
  url: `https://sparkandmend.co.uk${CANONICAL}`,
  provider: {
    "@type": "LocalBusiness",
    name: BRAND,
    url: "https://sparkandmend.co.uk",
    areaServed: AREA,
  },
};

const HERO_IMAGE =
  "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-cleaned.jpg";
const INCLUDE_IMAGE =
  "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-dirty.jpg";
const RESULTS_IMAGE =
  "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-clean-3.jpg";
const QUOTE_LINK = "/get-a-quote?service=advanced";
const STEP_IMAGES = [
  "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/step-1.webp",
  "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/step-2.webp",
  "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/step-3.webp",
];
const STEP_DETAILS = [
  {
    image: STEP_IMAGES[0],
    alt: "Booking calculator preview",
    numberLabel: "01",
    description: (
      <>
        <Link href={QUOTE_LINK} className="text-foreground underline">
          Arrange a FREE clean
        </Link>{" "}
        in about 60 seconds with the calculator.
      </>
    ),
  },
  {
    image: STEP_IMAGES[1],
    alt: "Calendar booking preview",
    numberLabel: "02",
    description: "Choose a slot and book instantly, with any add-ons you want.",
  },
  {
    image: STEP_IMAGES[2],
    alt: "Spark & Mend team cleaning",
    numberLabel: "03",
    description: "We arrive and clean to a clear standard.",
  },
];

const CONTACT_EMAIL = "sparkandmend@gmail.com";
const CONTACT_PHONE = "07452 824799";
const CONTACT_PHONE_LINK = "tel:07452824799";
const CONTACT_WHATSAPP_LINK = "https://wa.me/447452824799";
const sectionBase =
  "relative overflow-hidden rounded-[32px] border border-border/50 px-6 py-10 md:px-10 md:py-12 shadow-[0_30px_80px_-60px_hsl(var(--primary)/0.35)]";
const heroSurface =
  "relative overflow-hidden rounded-[36px] border border-border/50 bg-[radial-gradient(120%_120%_at_80%_0%,hsl(var(--background))_0%,hsl(var(--subtle))_45%,hsl(var(--background))_100%)] px-6 pt-10 pb-12 md:px-12 md:pt-12 md:pb-14 shadow-[0_45px_100px_-70px_hsl(var(--primary)/0.45)]";
const surfacePrimary =
  "bg-[linear-gradient(135deg,hsl(var(--primary)/0.08),hsl(var(--background))_70%)]";
const surfaceSecondary =
  "bg-[linear-gradient(135deg,hsl(var(--secondary)/0.12),hsl(var(--background))_70%)]";
const surfaceWarm =
  "bg-[linear-gradient(135deg,hsl(var(--tertiary))_0%,hsl(var(--background))_75%)]";
const surfaceSoft =
  "bg-[linear-gradient(135deg,hsl(var(--subtle))_0%,hsl(var(--background))_75%)]";
const surfaceMuted =
  "bg-[linear-gradient(135deg,hsl(var(--muted))_0%,hsl(var(--background))_85%)]";
const surfaceClean =
  "bg-[linear-gradient(135deg,hsl(var(--accent))_0%,hsl(var(--background))_75%)]";
const surfaceNeutral =
  "bg-[linear-gradient(135deg,hsl(var(--card))_0%,hsl(var(--background))_85%)]";

const concerns = [
  {
    text: "Need it done properly, first time",
    icon: ClipboardList,
  },
  {
    text: "Worried they will rush it and miss the details",
    icon: Timer,
  },
  {
    text: "Not sure what is included",
    icon: MessageCircleQuestion,
  },
  {
    text: "Had someone cancel last minute",
    icon: MessageCircleX,
  },
  {
    text: "Do not want awkward upsells or changing prices",
    icon: CheckCheck,
  },
  {
    text: "Worried about trusting someone in your property",
    icon: Key,
  },
];

const includeGroups = [
  {
    title: "Kitchen",
    items: [
      "Worktops, cupboard fronts, and splashbacks detailed",
      "Inside cupboards where accessible",
      "Sink, taps, hob exterior, and extractor wiped",
      "Extra attention to built-up areas",
    ],
  },
  {
    title: "Bathroom",
    items: [
      "Toilet, sink, taps, mirror, shower, and bath detailed",
      "Tiles and grout given extra attention",
      "Limescale focus on taps and screens",
      "Chrome polished for a sharp finish",
    ],
  },
  {
    title: "Living areas",
    items: [
      "Skirting boards, door frames, and ledges dusted",
      "Light switches and handles wiped",
      "Thorough tidy of surfaces and corners",
    ],
  },
  {
    title: "Floors",
    items: [
      "Vacuum edges and under reachable furniture",
      "Mop hard floors with detailed attention",
      "Spot clean marks and build-up",
    ],
  },
  {
    title: "Extras",
    items: [
      "Bins wiped and reset",
      "Entryways and high-traffic spots refreshed",
      "Add-ons available when you request a quote",
    ],
  },
];

const popularAddOns = [
  "Oven clean",
  "Fridge clean",
  "Inside cupboards",
  "Interior windows",
];

const whoFor = [
  "Best for a first clean, seasonal reset, before guests, or after a hectic period",
  "Homes that need the most thorough option",
  "Move-in or move-out style refreshes where detail matters",
  "Busy households that need a full reset after a long stretch",
  "Properties where build-up needs proper attention",
];

const results = [
  "Crisp bathrooms with build-up cleared",
  "Kitchen feels fully reset",
  "Floors look even and refreshed",
  "No sticky bits. No missed corners.",
  "A sharp, detailed finish that lasts longer",
];

const pricingFactors = [
  "Property size, layout, and level of build-up",
  "Inventory checklist or landlord requirements",
  "Kitchen and bathroom detail level",
  "Add-ons like oven, fridge, or interior windows",
];

const timeFactors = [
  "End of tenancy cleans take longer than regular upkeep",
  "Time depends on property size, condition, and checklist",
  "Your booking estimate includes a tailored estimate",
];

const beforeAfterItems = [
  {
    beforeSrc: INCLUDE_IMAGE,
    afterSrc: RESULTS_IMAGE,
    beforeAlt: "Oven before an end of tenancy clean",
    afterAlt: "Oven after an end of tenancy clean",
    caption: "Kitchen detail reset",
  },
];

const faqs = [
  {
    question: "What is the difference between Basic, Intermediate, and Advanced?",
    answer:
      "Basic is light upkeep, Intermediate adds extra detail, and Advanced is the most thorough option for a full reset and deeper build-up.",
  },
  {
    question: "How long does an end of tenancy clean take?",
    answer:
      "Advanced cleans take longer because we go deeper into detail. Your booking estimate gives a clear baseline and we confirm timings before booking.",
  },
  {
    question: "Do I need to be home?",
    answer:
      "No. Many clients provide access details. We will confirm the plan and arrival details in advance.",
  },
  {
    question: "Do you bring supplies?",
    answer:
      "Yes, we bring our own kit. If you prefer specific products, just let us know in the quote notes.",
  },
  {
    question: "Can you focus on specific areas?",
    answer:
      "Yes. Tell us what matters most in your quote notes and we will prioritise those areas.",
  },
  {
    question: "Can you work to a landlord or letting-agent checklist?",
    answer:
      "Yes. Share the checklist or inventory notes when you request a quote and we will align the scope to those requirements.",
  },
  {
    question: "Will this help with deposit or inspection outcomes?",
    answer:
      "We clean to a detailed standard and can align with an inspection checklist, but outcomes depend on the property condition and any pre-existing issues.",
  },
  {
    question: "What about pets?",
    answer:
      "Pets are fine. Please let us know so we can plan around them calmly and safely.",
  },
  {
    question: "What if I need regular cleaning?",
    answer:
      "Advanced is best as a one-off reset. If you want regular cleaning, Basic or Intermediate can keep things on track after the reset.",
  },
  {
    question: "Can I book for a rental or end-of-tenancy style reset?",
    answer:
      "Yes. Advanced Clean is the closest fit for a rental reset. Tell us in the quote so we can confirm the scope.",
  },
];

const advancedReviews = REVIEWS.slice(3, 6);
const AXA_BADGE = "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/axa.png";

const CtaButtons = () => (
  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 lg:justify-start">
    <PrimaryButton asChild>
      <Link href={QUOTE_LINK}>Arrange a FREE clean</Link>
    </PrimaryButton>
    <Button variant="outline" asChild>
      <Link href={CONTACT_PHONE_LINK}>Call or WhatsApp us</Link>
    </Button>
  </div>
);

const AdvancedCleanPage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSON_LD) }}
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
              <HighlightText
                text="Advanced Clean"
                className="block text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground"
              />
              <h1 className="mt-4 text-3xl md:text-5xl font-semibold font-heading text-foreground break-words text-balance">
                {SERVICE.seoTitle}
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                End of tenancy cleaning for Plymouth rentals that need a full reset.
                We take more time to cover the detail that matters for landlord or
                letting-agent inspections.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Serving Plymouth only.
              </p>
              <CtaButtons />
              <p className="mt-3 text-sm text-muted-foreground">
                Arrange a FREE clean in about 60 seconds.
              </p>
              <p className="text-sm text-muted-foreground">
                Describe your space, book and pay within five minutes, and rely on us to arrive on the confirmed date while we stay in touch if we need clarity.
              </p>
              <ContactDetails
                email={CONTACT_EMAIL}
                phoneLabel={CONTACT_PHONE}
                phoneHref={CONTACT_PHONE_LINK}
                whatsappLabel={CONTACT_PHONE}
                whatsappHref={CONTACT_WHATSAPP_LINK}
              />
            </div>
            <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-card/75 p-2 shadow-[0_30px_70px_-55px_hsl(var(--primary)/0.45)]">
              <Image
                src={HERO_IMAGE}
                alt="Bright, freshly cleaned living space"
                width={1200}
                height={900}
                className="h-[280px] w-full rounded-[22px] object-cover sm:h-[340px]"
              />
            </div>
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfacePrimary}`}>
        <AnimationContainer delay={0.15}>
          <SectionHeader
            eyebrow="End of tenancy"
            title="End of Tenancy Cleaning in Plymouth"
            description="Advanced Clean is our most thorough option for rentals and inspections. It is designed for move-outs and full-property resets across Plymouth."
            align="left"
          />
          <div className="mt-6 grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card/85 p-5">
              <p className="font-medium text-foreground">Checklist-led clean</p>
              <p className="mt-2">
                We work to a clear checklist and can align with landlord or letting
                agent requirements when provided.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/85 p-5">
              <p className="font-medium text-foreground">Detail focus</p>
              <p className="mt-2">
                Extra time for kitchens, bathrooms, fixtures, and build-up areas
                that matter during inspections.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={QUOTE_LINK}>Arrange a FREE clean</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cleaning-prices-plymouth">
                See cleaning prices in Plymouth
              </Link>
            </Button>
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.18}>
          <SectionHeader
            eyebrow="Inspection ready"
            title="Deposit & Inspection Standard"
            description="We clean to a detailed standard and follow inventory checklists when supplied. It keeps expectations clear without promising outcomes we cannot control."
            align="left"
          />
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <CheckListItem>Share agent or landlord checklists in the quote form</CheckListItem>
            <CheckListItem>Oven cleaning available as an add-on</CheckListItem>
            <CheckListItem>We confirm scope and timing before the visit</CheckListItem>
          </ul>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.2}>
          <SectionHeader
            eyebrow="Move in/out"
            title="Move-Out / Move-In Cleaning"
            description="Ideal for tenants leaving a property or landlords preparing a home for new occupants. We reset kitchens, bathrooms, and high-touch areas."
            align="left"
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href="/cleaning-results-plymouth">
                See results in Plymouth
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/faq-plymouth">Read Plymouth cleaning FAQs</Link>
            </Button>
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceMuted}`}>
        <AnimationContainer delay={0.22}>
          <SectionHeader
            eyebrow="Landlords"
            title="Letting Agents & Landlords"
            description="We support letting agents and landlords with clear checklists, tidy handovers, and reliable scheduling across Plymouth."
            align="left"
          />
          <p className="mt-6 text-sm text-muted-foreground">
            Need a specific inspection date? Share it in the quote notes and we
            will confirm availability as soon as we can.
          </p>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfacePrimary}`}>
        <BubbleBackground
          className="absolute inset-0 opacity-100"
          colors={{
            first: "9,72,79",
            second: "114,75,75",
            third: "240,230,218",
            fourth: "120,170,175",
            fifth: "198,166,150",
            sixth: "255,245,236",
          }}
        />
        <AnimationContainer delay={0.2} className="relative z-10">
          <SectionHeader
            eyebrow="Reassurance"
            title="We get your concerns"
            description="Clear communication, a simple booking flow, and a payment in minutes—so you don’t have to think twice before the clean arrives."
          />
          <ul className="mt-6 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
            {concerns.map((item) => {
              const Icon = item.icon;
              return (
              <li
                key={item.text}
                className="group flex items-start gap-3 rounded-xl border border-border/50 bg-card/60 px-4 py-3 backdrop-blur-md"
              >
                <AnimateIcon animateOnHover>
                  <Icon size={16} className="mt-0.5 text-primary" />
                </AnimateIcon>
                <span>{item.text}</span>
              </li>
            );
            })}
          </ul>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceWarm}`}>
        <AnimationContainer delay={0.25}>
          <SectionHeader
            eyebrow="Scope"
            title="What this service includes"
            description="Advanced is the most thorough clean. It focuses on detail, build-up, and end-of-tenancy inspection priorities."
            align="left"
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="grid gap-6 md:grid-cols-2">
              {includeGroups.map((group) => (
                <div
                  key={group.title}
                  className="rounded-2xl border border-border/60 bg-card/90 p-5"
                >
                  <h3 className="text-lg font-semibold text-foreground">
                    {group.title}
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {group.items.map((item) => (
                      <CheckListItem key={item}>{item}</CheckListItem>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <HeartMaskedImage
              src={INCLUDE_IMAGE}
              alt="Detail-focused clean with a calm finish"
              sizeClassName="max-w-[320px] sm:max-w-[380px] lg:max-w-[420px]"
            />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Not sure which clean you need?{" "}
            <Link href={QUOTE_LINK} className="text-foreground underline">
              Arrange a FREE clean
            </Link>
            .
          </p>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.28}>
          <SectionHeader
            eyebrow="Before & After"
            title="End of tenancy results you can see"
            description="A quick look at the level of detail in an Advanced Clean."
          />
          <div className="mt-8">
            <BeforeAfterGallery items={beforeAfterItems} />
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.3}>
          <ServiceInfoSection
            eyebrow="Pricing"
            title="Pricing guidance for end of tenancy cleaning"
            description="Prices depend on size, condition, and checklist requirements. The calculator is the source of truth and includes the checklist for this service plus any add-ons."
            bullets={pricingFactors}
            ctaHref={QUOTE_LINK}
            ctaLabel="Arrange a FREE clean"
          />
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceMuted}`}>
        <AnimationContainer delay={0.32}>
          <ServiceInfoSection
            eyebrow="Timing"
            title="Typical time estimates"
            description="End of tenancy cleans take longer to meet inspection detail."
            bullets={timeFactors}
            note="Share any inspection deadline in the quote notes and we will confirm availability."
          />
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.35}>
          <SectionHeader
            eyebrow="Reviews"
            title="Advanced clean reviews from Plymouth homes"
            description="Proof that our thorough resets leave clients relaxed and ready for anything."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {advancedReviews.map((review) => (
              <Card
                key={review.name}
                className="flex h-full flex-col border-none bg-card/85"
              >
                <CardHeader className="space-y-1">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {review.name}
                  </CardTitle>
                  {review.username && (
                    <CardDescription>{review.username}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>{review.review}</p>
                </CardContent>
                <CardFooter className="gap-1">
                  {Array.from({ length: review.rating }, (_, index) => (
                    <Star
                      key={`${review.name}-star-${index}`}
                      className="h-4 w-4 text-yellow-500"
                    />
                  ))}
                </CardFooter>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground text-center">
            5 stars on Google —{" "}
            <Link
              href="https://maps.app.goo.gl/tBSCyBVDtKXqqck36"
              className="text-foreground underline"
            >
              Read reviews
            </Link>
            .
          </p>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceClean}`}>
        <AnimationContainer delay={0.4}>
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card/90 p-6 md:flex-row">
            <div className="relative h-16 w-28">
              <Image
                src={AXA_BADGE}
                alt="AXA UK badge"
                fill
                sizes="112px"
                className="object-contain"
              />
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                Certified and Insured with AXA UK
              </p>
              <p className="text-lg font-semibold text-foreground">
                Trusted by Plymouth homes and local businesses
              </p>
            </div>
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSecondary}`}>
        <HexagonBackground
          className="absolute inset-0 opacity-20"
          hexagonSize={60}
          hexagonMargin={4}
          hexagonProps={{
            className:
              "before:bg-[hsl(var(--card)/0.7)] after:bg-[hsl(var(--card)/0.6)] before:opacity-100",
          }}
        />
        <AnimationContainer delay={0.3} className="relative z-10">
          <SectionHeader
            eyebrow="Popular add-ons"
            title="Extra detail, if you want it"
            description="Optional extras that pair well with an Advanced Clean."
            align="left"
          />
          <ul className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            {popularAddOns.map((item) => (
              <CheckListItem
                key={item}
                className="rounded-xl border border-border/60 bg-card/80 px-4 py-3"
                iconClassName="mt-0 text-primary"
              >
                {item}
              </CheckListItem>
            ))}
          </ul>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.35}>
          <SectionHeader
            eyebrow="Best for"
            title="Who it is for"
            description="Ideal for a full reset and detailed finish."
            align="left"
          />
          <ul className="mt-6 space-y-2 text-muted-foreground">
            {whoFor.map((item) => (
              <CheckListItem key={item}>{item}</CheckListItem>
            ))}
          </ul>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceMuted}`}>
        <AnimationContainer delay={0.4}>
          <SectionHeader
            eyebrow="Process"
            title="How it works"
            description="Use the booking calculator, then confirm your booking."
          />
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {STEP_DETAILS.map((step) => (
              <li
                key={step.numberLabel}
                className="flex min-h-[320px] flex-col gap-4 rounded-2xl border border-border/60 bg-card/90 p-5"
              >
                <div className="relative h-[220px] overflow-hidden rounded-xl border border-border/50 bg-muted/20">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover scale-[1.05] object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/30 to-transparent" />
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/80 bg-primary/95 text-[13px] font-semibold uppercase tracking-[0.4em] text-primary-foreground shadow-[0_20px_40px_-25px_rgba(9,72,79,0.65)]">
                  {step.numberLabel}
                </span>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceClean}`}>
        <AnimationContainer delay={0.45}>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <SectionHeader
                eyebrow="Results"
                title="Results you will notice"
                description="A sharper finish that lasts longer."
                align="left"
              />
              <ul className="mt-6 space-y-2 text-muted-foreground">
                {results.map((item) => (
                  <CheckListItem key={item}>{item}</CheckListItem>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-card/75 p-2 shadow-[0_24px_60px_-50px_hsl(var(--primary)/0.4)]">
              <Image
                src={RESULTS_IMAGE}
                alt="Deep-clean finish with polished surfaces"
                width={1200}
                height={900}
                className="h-[240px] w-full rounded-[22px] object-cover sm:h-[320px]"
              />
            </div>
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.5}>
          <SectionHeader
            eyebrow="FAQs"
            title="Answers before you book"
            description="Quick answers to the questions we hear most often."
          />
          <FAQAccordion
            items={faqs.map((faq, index) => ({
              id: `advanced-faq-${index}`,
              question: faq.question,
              answer: faq.answer,
            }))}
            className="mt-8"
          />
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.53}>
          <SectionHeader
            eyebrow="Guides"
            title="End of tenancy support guides"
            description="Checklists and inspection tips for Plymouth rentals."
          />
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/guides/end-of-tenancy-cleaning-checklist-plymouth">
                End of tenancy checklist
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/guides/what-landlords-check-plymouth">
                What landlords check
              </Link>
            </Button>
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.55}>
          <SectionHeader
            eyebrow="Explore"
            title="See all cleaning services in Plymouth"
            description="Compare Basic, Intermediate, Advanced, and Commercial options."
          />
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/cleaning-services-plymouth">View all services</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={QUOTE_LINK}>Get an End of Tenancy quote</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cleaning-prices-plymouth">See pricing in Plymouth</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/cleaning-results-plymouth">
                See cleaning results in Plymouth
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/faq-plymouth">Plymouth cleaning FAQs</Link>
            </Button>
          </div>
        </AnimationContainer>
      </Section>

      <Section>
        <CTAStrip
          title="Ready for a full reset?"
          description="Arrange a FREE clean, book in minutes, and let us handle the detail."
          primaryHref={QUOTE_LINK}
          primaryLabel="Arrange a FREE clean"
          secondaryHref={CONTACT_PHONE_LINK}
          secondaryLabel="Call or WhatsApp us"
        />
              <ContactDetails
                email={CONTACT_EMAIL}
                phoneLabel={CONTACT_PHONE}
                phoneHref={CONTACT_PHONE_LINK}
                whatsappLabel={CONTACT_PHONE}
                whatsappHref={CONTACT_WHATSAPP_LINK}
              />
      </Section>
    </MaxWidthWrapper>
  );
};

export default AdvancedCleanPage;
