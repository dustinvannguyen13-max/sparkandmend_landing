import { MaxWidthWrapper } from "@/components";
import CTAStrip from "@/components/ui/cta-strip";
import { Section, SectionHeader } from "@/components/ui/section";

const HelpPage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="pt-6">
        <SectionHeader
          eyebrow="Help & Support"
          title="Need a hand with booking?"
          description="Email sparkandmend@gmail.com or call 07452 824799 and we will help you book the right clean."
        />
      </Section>

      <Section>
        <CTAStrip
          title="Prefer an instant quote instead?"
          description="Get a fast estimate and choose a slot that works for you."
          primaryHref="/get-a-quote"
          primaryLabel="Get an Instant Quote"
          secondaryHref="tel:07452824799"
          secondaryLabel="Call or WhatsApp us"
        />
      </Section>
    </MaxWidthWrapper>
  );
};

export default HelpPage;
