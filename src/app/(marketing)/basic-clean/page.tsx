import Image from "next/image";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import { Button } from "@/components/ui/button";
import CTAStrip from "@/components/ui/cta-strip";
import FAQAccordion from "@/components/ui/faq-accordion";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { BubbleBackground } from "@/components/ui/bubble-background";
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
  title: "Basic Clean | Spark & Mend",
  description:
    "Basic cleaning in Plymouth for already tidy homes. A simple, regular reset focused on visible areas. Get an instant quote in about 60 seconds.",
});

const HERO_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.460308-XCMNTOMRCKQFUOKREBBC/imgg-od3-4wz7yy4a.png?format=2500w";
const INCLUDE_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.157589-XRPOXTQECTKYUAVFQOKA/imgg-od3-4foq0c2e.png?format=2500w";
const RESULTS_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.032175-FEUGECPAUDAFVQTGEIVS/imgg-od3-sa5ajg65.png?format=2500w";

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
      "Worktops and cupboard fronts wiped",
      "Sink, taps, and splashback cleaned",
      "Hob exterior wiped and polished",
      "Bins emptied and liners tidied",
    ],
  },
  {
    title: "Bathroom",
    items: [
      "Toilet, sink, taps, and mirror cleaned",
      "Shower or bath surfaces wiped",
      "Quick tidy of counters and toiletries",
    ],
  },
  {
    title: "Living areas",
    items: [
      "Dust reachable surfaces and shelves",
      "Straighten cushions and tidy surfaces",
      "Light touch points wiped in main rooms",
    ],
  },
  {
    title: "Floors",
    items: [
      "Vacuum carpets and rugs",
      "Mop hard floors",
      "Spot wipe obvious marks",
    ],
  },
  {
    title: "Extras",
    items: [
      "Entryway tidy and quick refresh",
      "Recycling emptied if accessible",
      "Add-ons available when you request a quote",
    ],
  },
];

const whoFor = [
  "Already fairly tidy homes that need a regular reset",
  "Busy households who want weekly or fortnightly upkeep",
  "Renters staying on top between deeper cleans",
  "Small offices that need a light, reliable clean",
  "Anyone who wants quick freshness without deep detail",
];

const results = [
  "Crisp bathrooms",
  "Kitchen feels reset",
  "Floors look even and fresh",
  "No sticky bits. No missed corners.",
  "A lighter, easier-to-maintain feel",
];

const faqs = [
  {
    question: "What is the difference between Basic, Intermediate, and Advanced?",
    answer:
      "Basic is a light, visible-area clean for regular upkeep. Intermediate goes deeper on build-up and touch points. Advanced is the most thorough option for a full reset.",
  },
  {
    question: "How long does it take?",
    answer:
      "It depends on the size and condition of the property. Your instant quote gives a clear estimate, and we confirm timings before booking.",
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
      "Choose weekly or fortnightly in the quote form. We will line up a consistent schedule that works for you.",
  },
  {
    question: "Can I book for a rental or end-of-tenancy style reset?",
    answer:
      "Yes. If you need a fuller reset, Advanced Clean is the closest fit. Tell us in the quote so we can confirm the scope.",
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

const BasicCleanPage = () => {
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
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Basic Clean
              </p>
              <h1 className="mt-4 text-3xl md:text-5xl font-semibold font-heading text-foreground">
                Basic Clean - a simple reset for busy weeks
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                A light, regular clean for already fairly tidy homes in Plymouth. We
                focus on visible areas for quick freshness. It is not a deep or
                detail clean.
              </p>
              <CtaButtons />
              <p className="mt-3 text-sm text-muted-foreground">
                Instant quote takes about 60 seconds.
              </p>
              <p className="text-sm text-muted-foreground">
                Fast quote. Clear scope. No pressure.
              </p>
              <ContactDetails />
            </div>
            <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-card/75 p-2 shadow-[0_30px_70px_-55px_hsl(var(--primary)/0.45)]">
              <Image
                src={HERO_IMAGE}
                alt="Neatly cleaned kitchen and dining area"
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
            description="A basic clean keeps the everyday areas in good order with a tidy, refreshed finish."
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
                  <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-2">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-2 shadow-[0_20px_60px_-50px_hsl(var(--primary)/0.45)]">
              <Image
                src={INCLUDE_IMAGE}
                alt="Freshly cleaned kitchen surfaces"
                width={1200}
                height={900}
                className="h-[240px] w-full rounded-[22px] object-cover sm:h-[320px] lg:h-[420px]"
              />
            </div>
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
        <AnimationContainer delay={0.25}>
          <SectionHeader
            eyebrow="Comparison"
            title="Basic vs Intermediate"
            description="Choose the clean that matches your space right now."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card/90 p-5">
              <h3 className="text-lg font-semibold text-foreground">Basic Clean</h3>
              <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>Light upkeep for visible areas</li>
                <li>Best for already tidy homes</li>
                <li>Shorter visits for regular refresh</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/90 p-5">
              <h3 className="text-lg font-semibold text-foreground">
                Intermediate Clean
              </h3>
              <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>More time on build-up and touch points</li>
                <li>Better for monthly resets</li>
                <li>Extra detail in kitchens and bathrooms</li>
              </ul>
            </div>
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.3}>
          <SectionHeader
            eyebrow="Best for"
            title="Who it is for"
            description="Ideal for keeping things tidy without deep detail."
            align="left"
          />
          <ul className="mt-6 list-disc pl-5 space-y-2 text-muted-foreground">
            {whoFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceMuted}`}>
        <AnimationContainer delay={0.35}>
          <SectionHeader
            eyebrow="Process"
            title="How it works"
            description="No back-and-forth. Just a straightforward booking."
          />
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            <li className="rounded-2xl border border-border/60 bg-card/90 p-5">
              <p className="text-sm font-semibold text-foreground">1)</p>
              <p className="mt-2 text-muted-foreground">
                <Link href="/get-a-quote" className="text-foreground underline">
                  Get an instant quote
                </Link>{" "}
                in about 60 seconds.
              </p>
            </li>
            <li className="rounded-2xl border border-border/60 bg-card/90 p-5">
              <p className="text-sm font-semibold text-foreground">2)</p>
              <p className="mt-2 text-muted-foreground">
                Choose a slot and any add-ons you want.
              </p>
            </li>
            <li className="rounded-2xl border border-border/60 bg-card/90 p-5">
              <p className="text-sm font-semibold text-foreground">3)</p>
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
                description="A lighter, fresher feel across the main areas."
                align="left"
              />
              <ul className="mt-6 list-disc pl-5 space-y-2 text-muted-foreground">
                {results.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-card/75 p-2 shadow-[0_24px_60px_-50px_hsl(var(--primary)/0.4)]">
              <Image
                src={RESULTS_IMAGE}
                alt="Fresh, bright living area after a clean"
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
              id: `basic-faq-${index}`,
              question: faq.question,
              answer: faq.answer,
            }))}
            className="mt-8"
          />
        </AnimationContainer>
      </Section>

      <Section>
        <CTAStrip
          title="Ready for a simple, reliable clean?"
          description="Get your instant quote, pick a time, and keep things tidy without the fuss."
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

export default BasicCleanPage;
