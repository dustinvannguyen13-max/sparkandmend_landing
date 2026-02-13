import { MaxWidthWrapper } from "@/components";
import CTAStrip from "@/components/ui/cta-strip";
import { CheckListItem } from "@/components/ui/check-list";
import { Section, SectionHeader } from "@/components/ui/section";

const EnterprisePage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="pt-6">
        <SectionHeader
          eyebrow="Arrange a FREE clean"
          title="Tell us what you need"
          description="Interested in our services? Share a few details and we will be in touch shortly. Prefer to book online? Use the booking calculator to arrange your clean."
        />
        <div className="mt-8 text-sm md:text-base text-muted-foreground">
          <p className="font-medium text-foreground text-center">
            To get started, share:
          </p>
          <ul className="mt-4 max-w-lg mx-auto space-y-2 text-left">
            <CheckListItem>Name (first and last)</CheckListItem>
            <CheckListItem>Email (required)</CheckListItem>
            <CheckListItem>Phone</CheckListItem>
            <CheckListItem>Service interest: Basic, Intermediate, or Advanced</CheckListItem>
            <CheckListItem>Preferred date</CheckListItem>
            <CheckListItem>How you heard about us</CheckListItem>
            <CheckListItem>Message (required)</CheckListItem>
            <CheckListItem>Optional: sign up for news and updates</CheckListItem>
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
          title="Prefer to book online instead?"
          description="Use the booking calculator to arrange a free clean and confirm the details."
          primaryHref="/get-a-quote"
          primaryLabel="Arrange a FREE clean"
          secondaryHref="tel:07452824799"
          secondaryLabel="Call or WhatsApp us"
        />
      </Section>
    </MaxWidthWrapper>
  );
};

export default EnterprisePage;
