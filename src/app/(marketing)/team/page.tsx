import Image from "next/image";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import CTAStrip from "@/components/ui/cta-strip";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Section, SectionHeader } from "@/components/ui/section";
import { generateMetadata } from "@/utils";
import Link from "next/link";

export const metadata = generateMetadata({
  title: "Meet the Team | Spark & Mend",
  description:
    "Meet the small Spark & Mend team in Plymouth. Consistent standards, friendly service, and clear communication.",
});

const HERO_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.460308-XCMNTOMRCKQFUOKREBBC/imgg-od3-4wz7yy4a.png?format=2500w";

const CONTACT_EMAIL = "sparkandmend@gmail.com";
const CONTACT_PHONE = "07452 824799";
const CONTACT_PHONE_LINK = "tel:07452824799";
const CONTACT_WHATSAPP_LINK = "https://wa.me/447452824799";

const team = [
  {
    name: "Lenny B",
    role: "Co-founder / Cleaning Lead",
    traits: [
      "Detail-focused and methodical",
      "Calm and friendly on site",
      "Reliable and punctual",
      "Clear communicator",
    ],
    why: "Lenny likes seeing the before-and-after difference a proper clean makes for busy households.",
  },
  {
    name: "Tino G",
    role: "Cleaning Specialist",
    traits: [
      "Consistent standards",
      "Quick, tidy finish",
      "Respectful in homes and workplaces",
      "Happy to work around schedules",
    ],
    why: "Tino enjoys helping people feel more relaxed in their space without the fuss.",
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

const TeamPage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="pt-6">
        <AnimationContainer delay={0.1}>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="text-center lg:text-left">
              <SectionHeader
                eyebrow="Team"
                title="Meet the Spark & Mend team"
                description="A small team with consistent standards. You will see the same faces and the same level of care each visit."
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
                alt="Clean, organised workspace with tidy finishes"
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
            eyebrow="People"
            title="Small team, consistent standards"
            description="Friendly, reliable, and detail-focused at every visit."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-border/60 bg-card/90 p-6"
              >
                <h3 className="text-xl font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  {member.traits.map((trait) => (
                    <li key={trait}>{trait}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-muted-foreground">{member.why}</p>
              </div>
            ))}
          </div>
        </AnimationContainer>
      </Section>

      <Section>
        <CTAStrip
          title="Ready to book a clean with a consistent team?"
          description="Get your instant quote, choose a slot, and we will take it from there."
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

export default TeamPage;
