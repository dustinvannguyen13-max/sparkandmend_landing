import Image from "next/image";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import CTAStrip from "@/components/ui/cta-strip";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Section, SectionHeader } from "@/components/ui/section";
import { generateMetadata } from "@/utils";
import Link from "next/link";

export const metadata = generateMetadata({
  title: "About Spark & Mend",
  description:
    "Learn about Spark & Mend, a local Plymouth cleaning team focused on clear communication, detail-focused work, and no-fuss service.",
});

const HERO_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.032175-FEUGECPAUDAFVQTGEIVS/imgg-od3-sa5ajg65.png?format=2500w";

const CONTACT_EMAIL = "sparkandmend@gmail.com";
const CONTACT_PHONE = "07452 824799";
const CONTACT_PHONE_LINK = "tel:07452824799";
const CONTACT_WHATSAPP_LINK = "https://wa.me/447452824799";

const values = [
  "Clear communication",
  "Detail-focused work",
  "Turning up on time",
  "Respecting homes and workplaces",
  "No drama, no pressure",
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

const AboutPage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="pt-6">
        <AnimationContainer delay={0.1}>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="text-center lg:text-left">
              <SectionHeader
                eyebrow="About"
                title="About Spark & Mend"
                description="We are a small, local cleaning team in Plymouth focused on clear communication, consistent standards, and a calm, respectful service."
                align="left"
              />
              <div className="mt-6">
                <PrimaryButton asChild>
                  <Link href="/get-a-quote">Get an Instant Quote</Link>
                </PrimaryButton>
              </div>
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
                alt="Fresh, calm interior with clean finishes"
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
            eyebrow="The name"
            title="Why the name Spark & Mend?"
            description="Spark is the fresh, bright feeling you get after a proper clean. Mend is our promise to fix the common issues people have with cleaners - missed details, lack of trust, and poor communication."
            align="left"
          />
        </AnimationContainer>
      </Section>

      <Section>
        <AnimationContainer delay={0.2}>
          <SectionHeader
            eyebrow="Why we started"
            title="Cleaning that feels simple and respectful"
            description="We kept hearing the same stories: inconsistent standards, unclear pricing, and awkward experiences. We wanted to build a cleaning service that feels simple, respectful, and consistent - with a clear scope and a straightforward booking process."
            align="left"
          />
        </AnimationContainer>
      </Section>

      <Section>
        <AnimationContainer delay={0.25}>
          <SectionHeader
            eyebrow="Values"
            title="The values we work by"
            align="left"
          />
          <ul className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            {values.map((value) => (
              <li key={value} className="rounded-xl border border-border/60 bg-card/80 px-4 py-3">
                {value}
              </li>
            ))}
          </ul>
        </AnimationContainer>
      </Section>

      <Section>
        <CTAStrip
          title="Ready to see what a clear, calm clean feels like?"
          description="Get your instant quote, choose a time, and we will take it from there."
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

export default AboutPage;
