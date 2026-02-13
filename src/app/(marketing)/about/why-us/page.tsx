import Image from "next/image";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import CTAStrip from "@/components/ui/cta-strip";
import { CheckListItem } from "@/components/ui/check-list";
import { PrimaryButton } from "@/components/ui/primary-button";
import ContactDetails from "@/components/ui/contact-details";
import { Section, SectionHeader } from "@/components/ui/section";
import { StarsBackground } from "@/components/ui/stars-background";
import { generateMetadata } from "@/utils";
import Link from "next/link";

export const metadata = generateMetadata({
  title: "Why Us | Spark & Mend",
  description:
    "Why choose Spark & Mend? A local Plymouth cleaning team focused on clear communication, detail-focused work, and no-fuss service.",
});

const HERO_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.032175-FEUGECPAUDAFVQTGEIVS/imgg-od3-sa5ajg65.png?format=2500w";
const STORY_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.157589-XRPOXTQECTKYUAVFQOKA/imgg-od3-4foq0c2e.png?format=2500w";
const ORIGIN_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.460308-XCMNTOMRCKQFUOKREBBC/imgg-od3-4wz7yy4a.png?format=2500w";

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
const surfaceWarm =
  "bg-[linear-gradient(135deg,hsl(var(--tertiary))_0%,hsl(var(--background))_75%)]";
const surfaceClean =
  "bg-[linear-gradient(135deg,hsl(var(--accent))_0%,hsl(var(--background))_75%)]";

const values = [
  "Clear communication",
  "Detail-focused work",
  "Turning up on time",
  "Respecting homes and workplaces",
  "No drama, no pressure",
];

const WhyUsPage = () => {
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
              <SectionHeader
                eyebrow="Why Us"
                title="Why Spark & Mend?"
                description="We are a small, local cleaning team in Plymouth focused on clear communication, consistent standards, and a calm, respectful service."
                align="left"
              />
              <div className="mt-6">
                <PrimaryButton asChild>
                  <Link href="/get-a-quote">Arrange a FREE clean</Link>
                </PrimaryButton>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Arrange a FREE clean in about 60 seconds.
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
                alt="Fresh, calm interior with clean finishes"
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
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <SectionHeader
              eyebrow="The name"
              title="Why the name Spark & Mend?"
              description="Spark is the fresh, bright feeling you get after a proper clean. Mend is our promise to fix the common issues people have with cleaners - missed details, lack of trust, and poor communication."
              align="left"
            />
            <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-2 shadow-[0_20px_60px_-50px_hsl(var(--primary)/0.45)]">
              <Image
                src={STORY_IMAGE}
                alt="Clean, light-filled interior detail"
                width={1200}
                height={900}
                className="h-[240px] w-full rounded-[22px] object-cover sm:h-[320px]"
              />
            </div>
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceWarm}`}>
          <AnimationContainer delay={0.2}>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <SectionHeader
              eyebrow="Why we started"
              title="Cleaning that gives you back your time"
              description="We kept hearing the same stories: inconsistent standards, unclear pricing, and awkward experiences. People told us they want clean homes but are too busy to keep on top of it themselves, so we built a service that lets them focus on life while we handle the cleaning."
              align="left"
            />
            <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-2 shadow-[0_20px_60px_-50px_hsl(var(--primary)/0.45)]">
              <Image
                src={ORIGIN_IMAGE}
                alt="Tidy, calm workspace after a clean"
                width={1200}
                height={900}
                className="h-[240px] w-full rounded-[22px] object-cover sm:h-[320px]"
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground lg:text-base">
              We clean so you can use the hours that open up for family, work, or rest.
              It is about giving you leverage over your time—sparkling spaces without sacrificing what matters.
            </p>
          </div>
        </AnimationContainer>
      </Section>

      <Section className={`${sectionBase} ${surfaceClean}`}>
        <AnimationContainer delay={0.25}>
          <SectionHeader
            eyebrow="Values"
            title="The values we work by"
            align="left"
          />
          <ul className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            {values.map((value) => (
              <CheckListItem
                key={value}
                className="rounded-xl border border-border/60 bg-card/80 px-4 py-3"
                iconClassName="mt-0 text-primary"
              >
                {value}
              </CheckListItem>
            ))}
          </ul>
        </AnimationContainer>
      </Section>

      <Section>
        <CTAStrip
          title="Ready to see what a clear, calm clean feels like?"
          description="Arrange a FREE clean, book in minutes, and we will take it from there."
          primaryHref="/get-a-quote"
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

export default WhyUsPage;
