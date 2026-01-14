import { AnimationContainer, MaxWidthWrapper } from "@/components";
import { Button } from "@/components/ui/button";
import { generateMetadata } from "@/utils";
import Link from "next/link";

export const metadata = generateMetadata({
  title: "Commercial Cleaning | Spark & Mend",
  description:
    "Commercial cleaning in Plymouth for offices and small businesses. Reliable, professional, consistent cleaning with clear scope. Get an instant quote in about 60 seconds.",
});

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
  <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
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
  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
    <Button asChild>
      <Link href="/get-a-quote">Get an Instant Quote</Link>
    </Button>
    <Button variant="outline" asChild>
      <Link href={CONTACT_PHONE_LINK}>Call or WhatsApp us</Link>
    </Button>
  </div>
);

const CommercialCleanPage = () => {
  return (
    <MaxWidthWrapper className="py-16 space-y-16">
      <AnimationContainer delay={0.1}>
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Commercial Cleaning
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold font-heading text-foreground">
            Commercial Cleaning - reliable, professional, consistent
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Keep your workspace client-ready with a tidy, professional finish. We
            work around your hours and keep the scope clear.
          </p>
          <CtaButtons />
          <p className="text-sm text-muted-foreground">
            Instant quote takes about 60 seconds.
          </p>
          <p className="text-sm text-muted-foreground">
            Fast quote. Clear scope. No pressure.
          </p>
          <ContactDetails />
        </section>
      </AnimationContainer>

      <AnimationContainer delay={0.15}>
        <section className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            We get your concerns
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            {concerns.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-muted-foreground">
            That is why we keep it simple and transparent.
          </p>
        </section>
      </AnimationContainer>

      <AnimationContainer delay={0.2}>
        <section className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              What this service includes
            </h2>
            <p className="mt-3 text-muted-foreground">
              We focus on the areas that matter most for a professional, tidy
              workspace.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {includeGroups.map((group) => (
              <div key={group.title} className="rounded-2xl border border-border/60 p-5">
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
          <p className="text-sm text-muted-foreground">
            Not sure which clean you need?{" "}
            <Link href="/get-a-quote" className="text-foreground underline">
              Get an Instant Quote
            </Link>
            .
          </p>
        </section>
      </AnimationContainer>

      <AnimationContainer delay={0.25}>
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            What we clean
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            {businessTypes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </AnimationContainer>

      <AnimationContainer delay={0.3}>
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Who it is for
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            {whoFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </AnimationContainer>

      <AnimationContainer delay={0.35}>
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              How it works
            </h2>
          </div>
          <ol className="grid gap-4 md:grid-cols-3">
            <li className="rounded-2xl border border-border/60 p-5">
              <p className="text-sm font-semibold text-foreground">1)</p>
              <p className="mt-2 text-muted-foreground">
                <Link href="/get-a-quote" className="text-foreground underline">
                  Get an instant quote
                </Link>{" "}
                in about 60 seconds.
              </p>
            </li>
            <li className="rounded-2xl border border-border/60 p-5">
              <p className="text-sm font-semibold text-foreground">2)</p>
              <p className="mt-2 text-muted-foreground">
                Choose a slot and any add-ons you want.
              </p>
            </li>
            <li className="rounded-2xl border border-border/60 p-5">
              <p className="text-sm font-semibold text-foreground">3)</p>
              <p className="mt-2 text-muted-foreground">
                We arrive and clean to a clear standard.
              </p>
            </li>
          </ol>
          <p className="text-muted-foreground">
            No back-and-forth. Just a straightforward booking.
          </p>
        </section>
      </AnimationContainer>

      <AnimationContainer delay={0.4}>
        <section className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Results you will notice
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            {results.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </AnimationContainer>

      <AnimationContainer delay={0.45}>
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">FAQs</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-border/60 p-5">
                <h3 className="text-base font-semibold text-foreground">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </AnimationContainer>

      <AnimationContainer delay={0.5}>
        <section className="rounded-3xl border border-border/60 p-8 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Ready to keep your workspace client-ready?
          </h2>
          <p className="text-muted-foreground">
            Get your instant quote, choose a slot, and keep the workplace tidy
            and professional.
          </p>
          <CtaButtons />
          <p className="text-sm text-muted-foreground">
            Fast quote. Clear scope. No pressure.
          </p>
          <ContactDetails />
        </section>
      </AnimationContainer>
    </MaxWidthWrapper>
  );
};

export default CommercialCleanPage;
