import Image from "next/image";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import { Button } from "@/components/ui/button";
import CTAStrip from "@/components/ui/cta-strip";
import FAQAccordion from "@/components/ui/faq-accordion";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { BubbleBackground } from "@/components/ui/bubble-background";
import { CheckListItem } from "@/components/ui/check-list";
import { HeartMaskedImage } from "@/components/ui/heart-masked-image";
import { HighlightText } from "@/components/ui/highlight-text";
import { HexagonBackground } from "@/components/ui/hexagon-background";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Section, SectionHeader } from "@/components/ui/section";
import { StarsBackground } from "@/components/ui/stars-background";
import { generateMetadata } from "@/utils";
import Link from "next/link";
import { CheckCheck } from "@/registry/icons/check-check";
import { ClipboardList } from "@/registry/icons/clipboard-list";
import { Key } from "@/registry/icons/key";
import { MessageCircleQuestion } from "@/registry/icons/message-circle-question";
import { MessageCircleX } from "@/registry/icons/message-circle-x";
import { Timer } from "@/registry/icons/timer";

export const metadata = generateMetadata({
  title: "Advanced Clean | Spark & Mend",
  description:
    "Advanced cleaning in Plymouth for a full reset. Best for first cleans, seasonal refreshes, and post-busy periods. Get a fixed instant quote in about 60 seconds and book instantly via our quote calculator.",
});

const HERO_IMAGE =
  "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-cleaned.jpg";
const INCLUDE_IMAGE =
  "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-dirty.jpg";
const RESULTS_IMAGE =
  "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-clean-3.jpg";

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

const faqs = [
  {
    question: "What is the difference between Basic, Intermediate, and Advanced?",
    answer:
      "Basic is light upkeep, Intermediate adds extra detail, and Advanced is the most thorough option for a full reset and deeper build-up.",
  },
  {
    question: "How long does it take?",
    answer:
      "Advanced cleans take longer because we go deeper into detail. Your fixed instant quote gives a clear estimate and we confirm timings before booking.",
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

const ContactDetails = () => (
  <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground lg:justify-start">
    <Link href={`mailto:${CONTACT_EMAIL}`} className="hover:text-foreground">
      Email: {CONTACT_EMAIL}
    </Link>
    <Link href={CONTACT_PHONE_LINK} className="hover:text-foreground">
      Call: {CONTACT_PHONE}
    </Link>
    <Link href={CONTACT_WHATSAPP_LINK} className="hover:text-foreground">
      WhatsApp: {CONTACT_PHONE}
    </Link>
  </div>
);

const CtaButtons = () => (
  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 lg:justify-start">
    <PrimaryButton asChild>
      <Link href="/get-a-quote">Get an Instant Quote</Link>
    </PrimaryButton>
    <Button variant="outline" asChild>
      <Link href={CONTACT_PHONE_LINK}>Call or WhatsApp us</Link>
    </Button>
  </div>
);

const AdvancedCleanPage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
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
                Advanced Clean - a full reset with the details done
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                Our most thorough option, best for a first clean, seasonal reset,
                before guests, or after a hectic period. We take more time to cover
                the detail that makes the difference.
              </p>
              <CtaButtons />
              <p className="mt-3 text-sm text-muted-foreground">
                Fixed instant quote takes about 60 seconds.
              </p>
              <p className="text-sm text-muted-foreground">
                Define your requirements in the calculator and book instantly.
              </p>
              <ContactDetails />
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
        <AnimationContainer delay={0.15} className="relative z-10">
          <SectionHeader
            eyebrow="Reassurance"
            title="We get your concerns"
            description="That is why we keep it simple and transparent."
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
        <AnimationContainer delay={0.2}>
          <SectionHeader
            eyebrow="Scope"
            title="What this service includes"
            description="Advanced is the most thorough clean. It focuses on detail, build-up, and the areas that make a full reset feel complete."
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
            <Link href="/get-a-quote" className="text-foreground underline">
              Get an Instant Quote
            </Link>
            .
          </p>
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
        <AnimationContainer delay={0.25} className="relative z-10">
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
        <AnimationContainer delay={0.3}>
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
        <AnimationContainer delay={0.35}>
          <SectionHeader
            eyebrow="Process"
            title="How it works"
            description="Fixed instant quote via the calculator, then book instantly."
          />
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            <li className="rounded-2xl border border-border/60 bg-card/90 p-5">
              <div className="overflow-hidden rounded-xl border border-border/50 bg-muted/20">
                <Image
                  src={HERO_IMAGE}
                  alt="Spark & Mend cleaning scene"
                  width={1200}
                  height={900}
                  className="h-28 w-full object-cover sm:h-32"
                />
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground">1)</p>
              <p className="mt-2 text-muted-foreground">
                <Link href="/get-a-quote" className="text-foreground underline">
                  Get a fixed instant quote
                </Link>{" "}
                in about 60 seconds with the calculator.
              </p>
            </li>
            <li className="rounded-2xl border border-border/60 bg-card/90 p-5">
              <div className="overflow-hidden rounded-xl border border-border/50 bg-muted/20">
                <Image
                  src={INCLUDE_IMAGE}
                  alt="Spark & Mend tidy workspace"
                  width={1200}
                  height={900}
                  className="h-28 w-full object-cover sm:h-32"
                />
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground">2)</p>
              <p className="mt-2 text-muted-foreground">
                Choose a slot and book instantly, with any add-ons you want.
              </p>
            </li>
            <li className="rounded-2xl border border-border/60 bg-card/90 p-5">
              <div className="overflow-hidden rounded-xl border border-border/50 bg-muted/20">
                <Image
                  src={RESULTS_IMAGE}
                  alt="Spark & Mend clean interior"
                  width={1200}
                  height={900}
                  className="h-28 w-full object-cover sm:h-32"
                />
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground">3)</p>
              <p className="mt-2 text-muted-foreground">
                We arrive and clean to a clear standard.
              </p>
            </li>
          </ol>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceClean}`}>
        <AnimationContainer delay={0.4}>
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
        <AnimationContainer delay={0.45}>
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

      <Section>
        <CTAStrip
          title="Ready for a full reset?"
          description="Get a fixed instant quote, book instantly, and let us handle the detail."
          primaryHref="/get-a-quote"
          primaryLabel="Get an Instant Quote"
          secondaryHref={CONTACT_PHONE_LINK}
          secondaryLabel="Call or WhatsApp us"
        />
        <ContactDetails />
      </Section>
    </MaxWidthWrapper>
  );
};

export default AdvancedCleanPage;
