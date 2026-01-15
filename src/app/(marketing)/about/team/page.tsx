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
  title: "Meet the Team | Spark & Mend",
  description:
    "Meet the small Spark & Mend team in Plymouth. Consistent standards, friendly service, and clear communication.",
});

const HERO_IMAGE =
  "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/team.png";
const heroSurface =
  "relative overflow-hidden rounded-[36px] border border-border/50 bg-[radial-gradient(120%_120%_at_80%_0%,hsl(var(--background))_0%,hsl(var(--subtle))_45%,hsl(var(--background))_100%)] px-6 pt-10 pb-12 md:px-12 md:pt-12 md:pb-14 shadow-[0_45px_100px_-70px_hsl(var(--primary)/0.45)]";

const CONTACT_EMAIL = "sparkandmend@gmail.com";
const CONTACT_PHONE = "07452 824799";
const CONTACT_PHONE_LINK = "tel:07452824799";
const CONTACT_WHATSAPP_LINK = "https://wa.me/447452824799";

const team = [
  
  {
    name: "Tino G",
    role: "Director / Cleaning Lead",
    image:
      "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/tino.png",
    imageAlt: "Spark & Mend tidy workspace",
    traits: [
      "Consistent standards",
      "Quick, tidy finish",
      "Respectful in homes and workplaces",
      "Happy to work around schedules",
    ],
    why: "Tino enjoys helping people feel more relaxed in their space without the fuss.",
  },
  {
    name: "Lenny B",
    role: "Sales & Marketing",
    image:
      "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/lenny.png",
    imageAlt: "Spark & Mend cleaning detail",
    traits: [
      "Detail-focused and methodical",
      "Calm and friendly on site",
      "Reliable and punctual",
      "Clear communicator",
    ],
    why: "Lenny likes seeing the before-and-after difference a proper clean makes for busy households.",
  },
];

const TeamPage = () => {
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
                <div className="overflow-hidden rounded-xl border border-border/50 bg-muted/20">
                  <Image
                    src={member.image}
                    alt={member.imageAlt}
                    width={1200}
                    height={900}
                    className="h-80 w-full object-cover object-top transition duration-500 hover:scale-[1.02] sm:h-[360px] lg:h-[420px]"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {member.traits.map((trait) => (
                    <CheckListItem key={trait}>{trait}</CheckListItem>
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
          description="Get a fixed instant quote, book instantly, and we will take it from there."
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

export default TeamPage;
