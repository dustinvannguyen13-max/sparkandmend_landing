import { MaxWidthWrapper } from "@/components";
import CTAStrip from "@/components/ui/cta-strip";
import { Section, SectionHeader } from "@/components/ui/section";

const EnterprisePage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="pt-6">
        <SectionHeader
          eyebrow="Get an instant quote"
          title="Tell us what you need"
          description="Interested in our services? Share a few details and we will be in touch shortly."
        />
        <div className="mt-8 text-sm md:text-base text-muted-foreground">
          <p className="font-medium text-foreground text-center">
            To get started, share:
          </p>
          <ul className="list-disc text-left mt-4 max-w-lg mx-auto">
            <li>Name (first and last)</li>
            <li>Email (required)</li>
            <li>Phone</li>
            <li>Service interest: Basic, Intermediate, or Advanced</li>
            <li>Preferred date</li>
            <li>How you heard about us</li>
            <li>Message (required)</li>
            <li>Optional: sign up for news and updates</li>
          </ul>
        </div>
        <div className="mt-10 text-base md:text-lg text-center text-muted-foreground space-y-2">
          <p>Spark &amp; Mend</p>
          <p>Email: sparkandmend@gmail.com</p>
          <p>Call: 07452 824799</p>
          <p>Hours: Monday - Friday, 9am - 6pm</p>
        </div>
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

export default EnterprisePage;
