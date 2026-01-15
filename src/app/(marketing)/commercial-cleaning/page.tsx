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
import { PrimaryButton } from "@/components/ui/primary-button";
import ContactDetails from "@/components/ui/contact-details";
import { Section, SectionHeader } from "@/components/ui/section";
import { StarsBackground } from "@/components/ui/stars-background";
import { REVIEWS, generateMetadata } from "@/utils";
import Link from "next/link";
import { CheckCheck } from "@/registry/icons/check-check";
import { ClipboardList } from "@/registry/icons/clipboard-list";
import { Key } from "@/registry/icons/key";
import { MessageCircleQuestion } from "@/registry/icons/message-circle-question";
import { MessageCircleX } from "@/registry/icons/message-circle-x";
import { Timer } from "@/registry/icons/timer";
import { Star } from "lucide-react";

export const metadata = generateMetadata({
  title: "Commercial Cleaning | Spark & Mend",
  description:
    "Commercial cleaning in Plymouth for offices and small businesses. Reliable, professional, consistent cleaning with clear scope. Get a fixed instant quote in about 60 seconds and book instantly via our quote calculator.",
});

const HERO_IMAGE =
  "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/restaurant-kitchen-clean-4.jpg";
const INCLUDE_IMAGE =
  "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/restaurant-kitchen-clean-2.jpg";
const RESULTS_IMAGE =
  "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/restaurant-kitchen-clean-1.jpg";
const STEP_IMAGES = [
  "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/step-1.webp",
  "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/step-2.webp",
  "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/step-3.webp",
];
const STEP_DETAILS = [
  {
    image: STEP_IMAGES[0],
    alt: "Calculator for instant quote",
    numberLabel: "01",
    description: (
      <>
        <Link href="/get-a-quote" className="text-foreground underline">
          Get a fixed instant quote
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
const AXA_BADGE = "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/axa.png";
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
    title: "Work areas",
    items: [
      "Desks and shared surfaces wiped",
      "Reception and meeting rooms tidied",
      "Touch points cleaned across key areas",
    ],
  },
  {
    title: "Washrooms",
    items: [
      "Toilets, sinks, taps, and mirrors cleaned",
      "Soap and paper areas wiped",
      "Bins emptied and reset",
    ],
  },
  {
    title: "Kitchens",
    items: [
      "Worktops and sinks cleaned",
      "Appliance exteriors wiped",
      "Tables and shared areas tidied",
    ],
  },
  {
    title: "Floors",
    items: [
      "Vacuum carpets and rugs",
      "Mop hard floors",
      "Spot clean obvious marks",
    ],
  },
  {
    title: "Extras",
    items: [
      "Bins and recycling taken out",
      "High-traffic touch points wiped",
      "Add-ons available when you request a quote",
    ],
  },
];

const businessTypes = [
  "Offices and meeting rooms",
  "Clinics and treatment rooms",
  "Salons and studios",
  "Retail shops and showrooms",
  "Cafes and restaurant front-of-house areas",
  "Landlord common areas and stairwells",
];

const whoFor = [
  "Small businesses that need a consistent, professional finish",
  "Offices that want tidy, client-ready spaces",
  "Clinics, salons, and studios with steady footfall",
  "Retail and hospitality spaces that need reliable upkeep",
  "Landlord-managed common areas",
];

const results = [
  "Tidy work areas that feel professional",
  "Crisp washrooms and kitchens",
  "Floors that look even and fresh",
  "Touch points feel clean and well kept",
  "No sticky bits. No missed corners.",
];

const faqs = [
  {
    question: "What is the difference between Basic, Intermediate, and Advanced?",
    answer:
      "Those are residential options. Commercial cleaning is scoped to your workspace needs, with clear areas and frequency agreed in advance.",
  },
  {
    question: "How long does it take?",
    answer:
      "It depends on the size and condition of your space. Your fixed instant quote gives a clear estimate, and we confirm timings before booking.",
  },
  {
    question: "Do we need to be on site?",
    answer:
      "Not necessarily. We can work around your hours and access preferences once we confirm the booking.",
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
    question: "What about pets or staff on site?",
    answer:
      "No problem. We work around people calmly and keep disruption low.",
  },
  {
    question: "What if I need regular cleaning?",
    answer:
      "Choose weekly or fortnightly in the quote form. We will line up a consistent schedule that suits your space.",
  },
  {
    question: "Can I book for a rental or end-of-tenancy style reset?",
    answer:
      "Yes. If you need a full reset for a property, tell us in the quote and we will confirm the scope.",
  },
];

const commercialReviews = REVIEWS.slice(5, 8);

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

const CommercialCleanPage = () => {
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
                text="Commercial Cleaning"
                className="block text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground"
              />
              <h1 className="mt-4 text-3xl md:text-5xl font-semibold font-heading text-foreground break-words text-balance">
                Commercial Cleaning - reliable, professional, consistent
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                Keep your workspace client-ready with a tidy, professional finish. We
                work around your hours and keep the scope clear.
              </p>
              <CtaButtons />
              <p className="mt-3 text-sm text-muted-foreground">
                Fixed instant quote takes about 60 seconds.
              </p>
              <p className="text-sm text-muted-foreground">
                Define your requirements in the calculator and book instantly.
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
                alt="Clean, professional workspace environment"
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
        <AnimationContainer delay={0.2} className="relative z-10">
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
        <AnimationContainer delay={0.25}>
          <SectionHeader
            eyebrow="Scope"
            title="What this service includes"
            description="We focus on the areas that matter most for a professional, tidy workspace."
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
              alt="Fresh, professional workspaces with clean finishes"
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

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <AnimationContainer delay={0.35}>
          <SectionHeader
            eyebrow="Reviews"
            title="Trusted by local businesses and households"
            description="Fixed instant quotes, clear scope, and professionals you can rely on time after time."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {commercialReviews.map((review) => (
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
        <AnimationContainer delay={0.3}>
          <SectionHeader
            eyebrow="Business types"
            title="What we clean"
            description="We work with a range of local businesses across Plymouth."
            align="left"
          />
          <ul className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            {businessTypes.map((item) => (
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
            description="A consistent, professional finish for client-facing spaces."
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
            description="Fixed instant quote via the calculator, then book instantly."
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
                description="A professional finish across the areas that matter most."
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
                alt="Professional workspace with clean finishes"
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
              id: `commercial-faq-${index}`,
              question: faq.question,
              answer: faq.answer,
            }))}
            className="mt-8"
          />
        </AnimationContainer>
      </Section>

      <Section>
        <CTAStrip
          title="Ready to keep your workspace client-ready?"
          description="Get a fixed instant quote, book instantly, and keep the workplace tidy and professional."
          primaryHref="/get-a-quote"
          primaryLabel="Get an Instant Quote"
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

export default CommercialCleanPage;
