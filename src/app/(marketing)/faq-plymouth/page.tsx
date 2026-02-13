import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import CTAStrip from "@/components/ui/cta-strip";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ContactDetails from "@/components/ui/contact-details";
import { Section, SectionHeader } from "@/components/ui/section";
import { StarsBackground } from "@/components/ui/stars-background";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from "@/registry/components/headless/accordion";
import { AREA, BRAND } from "@/lib/seo/keywords";
import { generateMetadata } from "@/utils";

const TITLE = `Cleaning FAQs for ${AREA} | ${BRAND}`;
const DESCRIPTION =
  "Cleaning FAQs for Plymouth covering deposits, inspections, timing, ovens, carpets, and products. Spark & Mend serves Plymouth only with clear pricing.";
const CANONICAL = "/faq-plymouth";

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

const CONTACT_EMAIL = "sparkandmend@gmail.com";
const CONTACT_PHONE = "07452 824799";
const CONTACT_PHONE_LINK = "tel:07452824799";
const CONTACT_WHATSAPP_LINK = "https://wa.me/447452824799";

const FAQ_SECTIONS = [
  {
    title: "End of Tenancy & Deposit",
    description: "For tenants, landlords, and letting agents in Plymouth.",
    items: [
      {
        id: "deposit-1",
        question: "Do you offer end of tenancy cleaning in Plymouth?",
        answer: (
          <p>
            Yes. Our Advanced Clean is designed for end of tenancy resets and
            detailed finishes. See the full scope on the{" "}
            <Link href="/advanced-clean" className="text-foreground underline">
              end of tenancy cleaning page
            </Link>
            .
          </p>
        ),
        answerText:
          "Yes. Our Advanced Clean is designed for end of tenancy resets and detailed finishes. See the full scope on the end of tenancy cleaning page.",
      },
      {
        id: "deposit-2",
        question: "Can you work to a landlord or letting-agent checklist?",
        answer: (
          <p>
            Yes. Share the checklist in your quote notes and we will align the
            clean to those priorities. Use the{" "}
            <Link href="/advanced-clean" className="text-foreground underline">
              Advanced Clean service
            </Link>
            .
          </p>
        ),
        answerText:
          "Yes. Share the checklist in your quote notes and we will align the clean to those priorities. Use the Advanced Clean service.",
      },
      {
        id: "deposit-3",
        question: "Will this guarantee my deposit back?",
        answer: (
          <p>
            We clean to a detailed standard and can follow inspection checklists,
            but we cannot guarantee deposit outcomes. For the most thorough option,
            book the{" "}
            <Link href="/advanced-clean" className="text-foreground underline">
              Advanced Clean
            </Link>
            .
          </p>
        ),
        answerText:
          "We clean to a detailed standard and can follow inspection checklists, but we cannot guarantee deposit outcomes. For the most thorough option, book the Advanced Clean.",
      },
      {
        id: "deposit-4",
        question: "Is inside cupboard cleaning included?",
        answer: (
          <p>
            Inside cupboards can be added when you request a quote. Add it in the
            extras section of the{" "}
            <Link href="/get-a-quote" className="text-foreground underline">
              booking form
            </Link>
            so pricing stays accurate.
          </p>
        ),
        answerText:
          "Inside cupboards can be added when you request a quote. Add it in the extras section of the booking form so pricing stays accurate.",
      },
      {
        id: "deposit-5",
        question: "Can you help with move-out deadlines or inspection dates?",
        answer: (
          <p>
            We will do our best to accommodate deadlines when availability allows.
            Share your date in the{" "}
            <Link href="/get-a-quote" className="text-foreground underline">
              quote request
            </Link>
            and we will confirm the schedule.
          </p>
        ),
        answerText:
          "We will do our best to accommodate deadlines when availability allows. Share your date in the quote request and we will confirm the schedule.",
      },
    ],
  },
  {
    title: "Timing & Scheduling",
    description: "How long cleans take and how we schedule visits.",
    items: [
      {
        id: "timing-1",
        question: "How long does a clean take?",
        answer: (
          <p>
            Timings depend on the service level, property size, and condition. Your
            booking estimate includes a tailored time range. See pricing guidance on the{" "}
            <Link
              href="/cleaning-prices-plymouth"
              className="text-foreground underline"
            >
              Plymouth prices page
            </Link>
            .
          </p>
        ),
        answerText:
          "Timings depend on the service level, property size, and condition. Your booking estimate includes a tailored time range. See pricing guidance on the Plymouth prices page.",
      },
      {
        id: "timing-2",
        question: "Do you offer same-day or next-day cleaning?",
        answer: (
          <p>
            We cannot promise same-day availability, but we will always check our
            schedule. Submit a request via the{" "}
            <Link href="/get-a-quote" className="text-foreground underline">
              booking form
            </Link>
            {" "}and we will confirm the earliest slot.
          </p>
        ),
        answerText:
          "We cannot promise same-day availability, but we will always check our schedule. Submit a request via the booking form and we will confirm the earliest slot.",
      },
      {
        id: "timing-3",
        question: "What time do you arrive for a booking?",
        answer: (
          <p>
            We confirm arrival windows before your clean and keep in touch if
            anything changes. Add any preferred time notes in the{" "}
            <Link href="/get-a-quote" className="text-foreground underline">
              booking form
            </Link>
            .
          </p>
        ),
        answerText:
          "We confirm arrival windows before your clean and keep in touch if anything changes. Add any preferred time notes in the booking form.",
      },
      {
        id: "timing-4",
        question: "Can I book recurring cleaning?",
        answer: (
          <p>
            Yes. Regular weekly or fortnightly visits are handled through the{" "}
            <Link href="/basic-clean" className="text-foreground underline">
              Basic Clean service
            </Link>
            {" "}and you can choose the frequency when you request a quote.
          </p>
        ),
        answerText:
          "Yes. Regular weekly or fortnightly visits are handled through the Basic Clean service and you can choose the frequency when you request a quote.",
      },
    ],
  },
  {
    title: "What’s Included",
    description: "Service scope and what each clean focuses on.",
    items: [
      {
        id: "included-1",
        question: "What is included in Regular Cleaning?",
        answer: (
          <p>
            Regular cleaning covers visible areas, kitchens, bathrooms, dusting,
            and floors for ongoing upkeep. Review the checklist on the{" "}
            <Link href="/basic-clean" className="text-foreground underline">
              Basic Clean page
            </Link>
            .
          </p>
        ),
        answerText:
          "Regular cleaning covers visible areas, kitchens, bathrooms, dusting, and floors for ongoing upkeep. Review the checklist on the Basic Clean page.",
      },
      {
        id: "included-2",
        question: "What is included in Deep Cleaning?",
        answer: (
          <p>
            Deep cleaning adds extra time for build-up, touch points, and detailed
            areas. See the full checklist on the{" "}
            <Link href="/intermediate-clean" className="text-foreground underline">
              Intermediate Clean page
            </Link>
            .
          </p>
        ),
        answerText:
          "Deep cleaning adds extra time for build-up, touch points, and detailed areas. See the full checklist on the Intermediate Clean page.",
      },
      {
        id: "included-3",
        question: "What is included in Commercial Cleaning?",
        answer: (
          <p>
            Commercial cleaning is tailored to your workspace, with clear scope and
            agreed frequency. Review the scope on the{" "}
            <Link href="/commercial-cleaning" className="text-foreground underline">
              Commercial Cleaning page
            </Link>
            .
          </p>
        ),
        answerText:
          "Commercial cleaning is tailored to your workspace, with clear scope and agreed frequency. Review the scope on the Commercial Cleaning page.",
      },
    ],
  },
  {
    title: "Products & Supplies",
    description: "What we bring and how we handle preferences.",
    items: [
      {
        id: "products-1",
        question: "Do you bring cleaning products and equipment?",
        answer: (
          <p>
            Yes. We bring our own kit for every clean. If you have preferences,
            add a note in the{" "}
            <Link href="/get-a-quote" className="text-foreground underline">
              booking form
            </Link>
            .
          </p>
        ),
        answerText:
          "Yes. We bring our own kit for every clean. If you have preferences, add a note in the booking form.",
      },
      {
        id: "products-2",
        question: "Can you use my preferred products or eco-friendly supplies?",
        answer: (
          <p>
            If you want us to use specific products, let us know and we can work
            with what you provide. Share details in the{" "}
            <Link href="/get-a-quote" className="text-foreground underline">
              booking notes
            </Link>
            .
          </p>
        ),
        answerText:
          "If you want us to use specific products, let us know and we can work with what you provide. Share details in the booking notes.",
      },
      {
        id: "products-3",
        question: "Do I need to be home during the clean?",
        answer: (
          <p>
            No. Many clients provide access details ahead of time. Learn more about
            service options on the{" "}
            <Link
              href="/cleaning-services-plymouth"
              className="text-foreground underline"
            >
              Plymouth services hub
            </Link>
            .
          </p>
        ),
        answerText:
          "No. Many clients provide access details ahead of time. Learn more about service options on the Plymouth services hub.",
      },
    ],
  },
  {
    title: "Ovens, Appliances, Carpets",
    description: "Common add-ons and specialist areas.",
    items: [
      {
        id: "appliances-1",
        question: "Is oven cleaning included?",
        answer: (
          <p>
            Interior oven cleaning is available as an add-on. Select it in the{" "}
            <Link href="/get-a-quote" className="text-foreground underline">
              booking form
            </Link>
            {" "}and we will price it accurately.
          </p>
        ),
        answerText:
          "Interior oven cleaning is available as an add-on. Select it in the booking form and we will price it accurately.",
      },
      {
        id: "appliances-2",
        question: "Do you clean fridges or interior windows?",
        answer: (
          <p>
            Yes, both can be added to your booking. Choose the add-ons in the{" "}
            <Link href="/get-a-quote" className="text-foreground underline">
              booking form
            </Link>
            {" "}to keep the scope clear.
          </p>
        ),
        answerText:
          "Yes, both can be added to your booking. Choose the add-ons in the booking form to keep the scope clear.",
      },
      {
        id: "appliances-3",
        question: "Do you clean carpets?",
        answer: (
          <p>
            We offer a carpet and rug refresh add-on that covers vacuuming and spot
            treatment, not full carpet extraction. If you need this, select the
            add-on in the{" "}
            <Link href="/intermediate-clean" className="text-foreground underline">
              Deep Cleaning service
            </Link>
            {" "}flow.
          </p>
        ),
        answerText:
          "We offer a carpet and rug refresh add-on that covers vacuuming and spot treatment, not full carpet extraction. If you need this, select the add-on in the Deep Cleaning service flow.",
      },
    ],
  },
  {
    title: "Commercial Cleaning",
    description: "For offices, studios, and shared spaces.",
    items: [
      {
        id: "commercial-1",
        question: "Can you clean outside business hours?",
        answer: (
          <p>
            Yes. We can schedule around your opening hours when possible. Learn
            more on the{" "}
            <Link href="/commercial-cleaning" className="text-foreground underline">
              Commercial Cleaning page
            </Link>
            .
          </p>
        ),
        answerText:
          "Yes. We can schedule around your opening hours when possible. Learn more on the Commercial Cleaning page.",
      },
      {
        id: "commercial-2",
        question: "What commercial spaces do you cover?",
        answer: (
          <p>
            We work with offices, clinics, studios, and retail spaces across
            Plymouth. See the list of spaces on the{" "}
            <Link href="/commercial-cleaning" className="text-foreground underline">
              Commercial Cleaning page
            </Link>
            .
          </p>
        ),
        answerText:
          "We work with offices, clinics, studios, and retail spaces across Plymouth. See the list of spaces on the Commercial Cleaning page.",
      },
    ],
  },
  {
    title: "Pricing & Quotes",
    description: "How pricing is calculated and where to start.",
    items: [
      {
        id: "pricing-0",
        question: "How are regular cleans billed?",
        answer: (
          <p>
            Regular weekly or fortnightly cleans are billed automatically via a
            subscription once you confirm your schedule. One-off cleans are a
            single payment. Manage billing anytime in{" "}
            <Link href="/my-booking" className="text-foreground underline">
              My booking
            </Link>
            .
          </p>
        ),
        answerText:
          "Regular weekly or fortnightly cleans are billed automatically via a subscription once you confirm your schedule. One-off cleans are a single payment. Manage billing anytime in My booking.",
      },
      {
        id: "pricing-1",
        question: "How is the price calculated?",
        answer: (
          <p>
            Pricing is based on service level, property size, frequency, and any
            add-ons. See how it works on the{" "}
            <Link
              href="/cleaning-prices-plymouth"
              className="text-foreground underline"
            >
              Plymouth prices page
            </Link>
            .
          </p>
        ),
        answerText:
          "Pricing is based on service level, property size, frequency, and any add-ons. See how it works on the Plymouth prices page.",
      },
      {
        id: "pricing-2",
        question: "Can I get a quote without calling?",
        answer: (
          <p>
            Yes. Use the online calculator to get a fixed price. Start on
            the{" "}
            <Link href="/get-a-quote" className="text-foreground underline">
              booking page
            </Link>
            .
          </p>
        ),
        answerText:
          "Yes. Use the online calculator to get a fixed price. Start on the booking page.",
      },
      {
        id: "pricing-3",
        question: "Can I pause or cancel a subscription clean?",
        answer: (
          <p>
            Yes. You can manage or cancel your subscription in{" "}
            <Link href="/my-booking" className="text-foreground underline">
              My booking
            </Link>
            , or contact us if you want to reschedule.
          </p>
        ),
        answerText:
          "Yes. You can manage or cancel your subscription in My booking, or contact us if you want to reschedule.",
      },
    ],
  },
];

const allFaqItems = FAQ_SECTIONS.flatMap((section) => section.items);

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allFaqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answerText,
    },
  })),
};

const relatedServices = [
  {
    title: "Regular Cleaning",
    description: "Weekly or fortnightly upkeep for tidy homes.",
    href: "/basic-clean",
  },
  {
    title: "Deep Cleaning",
    description: "Extra detail for build-up and touch points.",
    href: "/intermediate-clean",
  },
  {
    title: "End of Tenancy",
    description: "Full reset detail for inspections and move-outs.",
    href: "/advanced-clean",
  },
  {
    title: "Commercial Cleaning",
    description: "Consistent visits for offices and workspaces.",
    href: "/commercial-cleaning",
  },
];

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

const FaqPlymouthPage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <Section className={heroSurface}>
        <StarsBackground
          className="absolute inset-0 opacity-55"
          starColor="#09484F"
          pointerEvents={false}
        />
        <div className="relative z-10">
          <SectionHeader
            eyebrow="FAQs"
            title={`Cleaning FAQs for ${AREA}`}
            description="Answers for tenants, landlords, letting agents, and homeowners in Plymouth."
          />
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Serving Plymouth only.
          </p>
        </div>
      </Section>

      <Section className={`${sectionBase} ${surfacePrimary}`}>
        <AnimationContainer delay={0.2}>
          <SectionHeader
            eyebrow="Questions"
            title="Everything people ask before they book"
            description="Pick a section to find answers about deposits, timing, products, and more."
          />
          <div className="mt-10 grid gap-10">
            {FAQ_SECTIONS.map((section) => (
              <div key={section.title} className="rounded-3xl border border-border/60 bg-card/90 p-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {section.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <Accordion className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <AccordionItem
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-border/70 bg-card/80"
                    >
                      <AccordionButton
                        showArrow={false}
                        className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground transition-colors hover:text-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <span>{item.question}</span>
                        <span className="flex h-8 min-w-[32px] items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground transition-all group-data-[open]:bg-primary group-data-[open]:text-primary-foreground flex-shrink-0">
                          <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[open]:rotate-180" />
                        </span>
                      </AccordionButton>
                      <AccordionPanel className="px-5 pt-0 pb-5 text-sm text-muted-foreground">
                        <div className="space-y-3">{item.answer}</div>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceSoft}`}>
        <AnimationContainer delay={0.25}>
          <SectionHeader
            eyebrow="Related"
            title="Related services"
            description="Match your question to the right service in Plymouth."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {relatedServices.map((service) => (
              <Card key={service.title} className="border-none bg-card/85">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {service.title}
                  </CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={service.href}>View service</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceNeutral}`}>
        <CTAStrip
          title="Still have questions?"
          description="Get a fixed price or send us your checklist so we can confirm the scope."
          primaryHref="/get-a-quote"
          primaryLabel="Arrange a FREE clean"
          secondaryHref={CONTACT_PHONE_LINK}
          secondaryLabel="Call or WhatsApp us"
        />
        <div className="mt-8 flex justify-center">
          <ContactDetails
            email={CONTACT_EMAIL}
            phoneLabel={CONTACT_PHONE}
            phoneHref={CONTACT_PHONE_LINK}
            whatsappLabel={CONTACT_PHONE}
            whatsappHref={CONTACT_WHATSAPP_LINK}
          />
        </div>
      </Section>
    </MaxWidthWrapper>
  );
};

export default FaqPlymouthPage;
