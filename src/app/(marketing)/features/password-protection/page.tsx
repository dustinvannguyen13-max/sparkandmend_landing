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
  title: "Intermediate Clean | Spark & Mend",
  description:
    "Intermediate cleaning in Plymouth for when it is getting on top of you. Extra detail on build-up and touch points for a sharper finish. Get an instant quote in about 60 seconds.",
});

const HERO_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.032175-FEUGECPAUDAFVQTGEIVS/imgg-od3-sa5ajg65.png?format=2500w";

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
    title: "Kitchen",
    items: [
      "Worktops, cupboard fronts, and splashbacks wiped",
      "Sink, taps, and hob exterior detailed",
      "Appliance exteriors wiped and polished",
      "Extra attention to build-up around edges",
    ],
  },
  {
    title: "Bathroom",
    items: [
      "Toilet, sink, taps, and mirror cleaned",
      "Shower or bath surfaces with limescale focus",
      "Tiles and grout spot attention where reachable",
      "Chrome polished for a sharper finish",
    ],
  },
  {
    title: "Living areas",
    items: [
      "Dusting including skirting boards and ledges",
      "Handles, switches, and touch points wiped",
      "Tidy surfaces and straighten soft furnishings",
    ],
  },
  {
    title: "Floors",
    items: [
      "Vacuum edges and under reachable furniture",
      "Mop hard floors with extra attention",
      "Spot clean obvious marks",
    ],
  },
  {
    title: "Extras",
    items: [
      "Spot clean marks on doors and frames",
      "Bins wiped and reset",
      "Add-ons available when you request a quote",
    ],
  },
];

const whoFor = [
  "Homes where it is getting on top of you and needs a proper reset",
  "Busy households who want a monthly clean with more detail",
  "Homes with pets or kids where touch points build up",
  "Pre-guest refreshes when you want a sharper finish",
  "Small offices that need more than a quick tidy",
];

const results = [
  "Crisp bathrooms with reduced build-up",
  "Kitchen feels properly reset",
  "Floors look even and freshly finished",
  "Touch points feel clean and smooth",
  "No sticky bits. No missed corners.",
];

const faqs = [
  {
    question: "What is the difference between Basic, Intermediate, and Advanced?",
    answer:
      "Basic is for light, regular upkeep. Intermediate gives extra time to build-up and touch points. Advanced is the most thorough option for a full reset.",
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
      "Choose weekly, fortnightly, or monthly in the quote form. We will line up a consistent schedule that works for you.",
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

const IntermediateCleanPage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="pt-6">
        <AnimationContainer delay={0.1}>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="text-center lg:text-left">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Intermediate Clean
              </p>
              <h1 className="mt-4 text-3xl md:text-5xl font-semibold font-heading text-foreground">
                Intermediate Clean - more detail, more time, better finish
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                Best for when it is getting on top of you and you want a proper
                reset. We put extra attention into build-up and touch points for a
                sharper finish.
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
                alt="Freshly cleaned living area with calm finish"
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
            description="Intermediate is a more detailed clean that tackles build-up and high-touch areas without going fully deep."
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
            eyebrow="Comparison"
            title="Intermediate vs Advanced"
            description="Pick the depth that suits your space today."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card/90 p-5">
              <h3 className="text-lg font-semibold text-foreground">
                Intermediate Clean
              </h3>
              <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>Extra attention to build-up and touch points</li>
                <li>Great for monthly resets</li>
                <li>More detail without full deep work</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/90 p-5">
              <h3 className="text-lg font-semibold text-foreground">
                Advanced Clean
              </h3>
              <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>Most thorough option for a full reset</li>
                <li>Best for first cleans or seasonal refresh</li>
                <li>More time on detailed areas and build-up</li>
              </ul>
            </div>
          </div>
        </AnimationContainer>
      </Section>

      <Section>
        <AnimationContainer delay={0.3}>
          <SectionHeader
            eyebrow="Best for"
            title="Who it is for"
            description="Best for when it is getting on top of you."
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
            description="Extra detail with a sharper finish."
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
              id: `intermediate-faq-${index}`,
              question: faq.question,
              answer: faq.answer,
            }))}
            className="mt-8"
          />
        </AnimationContainer>
      </Section>

      <Section>
        <CTAStrip
          title="Ready for a more detailed clean?"
          description="Get your instant quote, choose a slot, and let us handle the reset."
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

export default IntermediateCleanPage;
