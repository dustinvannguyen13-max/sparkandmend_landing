import { AnimationContainer, MaxWidthWrapper } from "@/components";
import { Button } from "@/components/ui/button";
import { generateMetadata } from "@/utils";
import Link from "next/link";

export const metadata = generateMetadata({
  title: "Meet the Team | Spark & Mend",
  description:
    "Meet the small Spark & Mend team in Plymouth. Consistent standards, friendly service, and clear communication.",
});

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

const TeamPage = () => {
  return (
    <MaxWidthWrapper className="py-16 space-y-16">
      <AnimationContainer delay={0.1}>
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Team
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold font-heading text-foreground">
            Meet the Spark &amp; Mend team
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            A small team with consistent standards. You will see the same faces
            and the same level of care each visit.
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
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center">
            Small team, consistent standards
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {team.map((member) => (
              <div key={member.name} className="rounded-2xl border border-border/60 p-6">
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
        </section>
      </AnimationContainer>

      <AnimationContainer delay={0.2}>
        <section className="rounded-3xl border border-border/60 p-8 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Ready to book a clean with a consistent team?
          </h2>
          <p className="text-muted-foreground">
            Get your instant quote, choose a slot, and we will take it from
            there.
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

export default TeamPage;
