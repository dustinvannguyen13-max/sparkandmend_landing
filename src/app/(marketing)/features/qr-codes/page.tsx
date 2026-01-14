import Image from "next/image";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import { Button } from "@/components/ui/button";
import CTAStrip from "@/components/ui/cta-strip";
import FAQAccordion from "@/components/ui/faq-accordion";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Section, SectionHeader } from "@/components/ui/section";
import { generateMetadata } from "@/utils";
import Link from "next/link";

export const metadata = generateMetadata({
  title: "Commercial Cleaning | Spark & Mend",
  description:
    "Commercial cleaning in Plymouth for offices and small businesses. Reliable, professional, consistent cleaning with clear scope. Get an instant quote in about 60 seconds.",
});

const HERO_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.460308-XCMNTOMRCKQFUOKREBBC/imgg-od3-4wz7yy4a.png?format=2500w";

const CONTACT_EMAIL = "sparkandmend@gmail.com";
const CONTACT_PHONE = "07452 824799";
const CONTACT_PHONE_LINK = "tel:07452824799";
const CONTACT_WHATSAPP_LINK = "https://wa.me/447452824799";

const concerns = [
  "Worried they will rush it and miss the details",
  "Not sure what is included",
  "Had someone cancel last minute",
  "Do not want awkward upsells or changing prices",
  "Need it done properly, first time",
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
      "It depends on the size and condition of your space. Your instant quote gives a clear estimate, and we confirm timings before booking.",
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

const CommercialCleanPage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="pt-6">
        <AnimationContainer delay={0.1}>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="text-center lg:text-left">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Commercial Cleaning
              </p>
              <h1 className="mt-4 text-3xl md:text-5xl font-semibold font-heading text-foreground">
                Commercial Cleaning - reliable, professional, consistent
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                Keep your workspace client-ready with a tidy, professional finish. We
                work around your hours and keep the scope clear.
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
            <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-2 shadow-[0_28px_70px_-52px_hsl(var(--primary)/0.5)]">
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

      <Section>
        <AnimationContainer delay={0.15}>
          <SectionHeader
            eyebrow="Reassurance"
            title="We get your concerns"
            description="That is why we keep it simple and transparent."
          />
          <ul className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            {concerns.map((item) => (
              <li key={item} className="rounded-xl border border-border/60 bg-card/80 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </AnimationContainer>
      </Section>

      <Section>
        <AnimationContainer delay={0.2}>
          <SectionHeader
            eyebrow="Scope"
            title="What this service includes"
            description="We focus on the areas that matter most for a professional, tidy workspace."
            align="left"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
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
          <p className="mt-4 text-sm text-muted-foreground">
            Not sure which clean you need?{" "}
            <Link href="/get-a-quote" className="text-foreground underline">
              Get an Instant Quote
            </Link>
            .
          </p>
        </AnimationContainer>
      </Section>

      <Section>
        <AnimationContainer delay={0.25}>
          <SectionHeader
            eyebrow="Business types"
            title="What we clean"
            description="We work with a range of local businesses across Plymouth."
            align="left"
          />
          <ul className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            {businessTypes.map((item) => (
              <li key={item} className="rounded-xl border border-border/60 bg-card/80 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </AnimationContainer>
      </Section>

      <Section>
        <AnimationContainer delay={0.3}>
          <SectionHeader
            eyebrow="Best for"
            title="Who it is for"
            description="A consistent, professional finish for client-facing spaces."
            align="left"
          />
          <ul className="mt-6 list-disc pl-5 space-y-2 text-muted-foreground">
            {whoFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </AnimationContainer>
      </Section>

      <Section>
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

      <Section>
        <AnimationContainer delay={0.4}>
          <SectionHeader
            eyebrow="Results"
            title="Results you will notice"
            description="A professional finish across the areas that matter most."
            align="left"
          />
          <ul className="mt-6 list-disc pl-5 space-y-2 text-muted-foreground">
            {results.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </AnimationContainer>
      </Section>

      <Section>
        <AnimationContainer delay={0.45}>
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
          description="Get your instant quote, choose a slot, and keep the workplace tidy and professional."
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

export default CommercialCleanPage;
