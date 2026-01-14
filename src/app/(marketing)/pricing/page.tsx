import Image from "next/image";
import { AnimationContainer, MaxWidthWrapper, PricingCards } from "@/components";
import CTAStrip from "@/components/ui/cta-strip";
import FAQAccordion from "@/components/ui/faq-accordion";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Section, SectionHeader } from "@/components/ui/section";
import { FAQ } from "@/utils/constants/faq";
import Link from "next/link";

const SUPPORT_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.460308-XCMNTOMRCKQFUOKREBBC/imgg-od3-4wz7yy4a.png?format=2500w";

const PricingPage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="pt-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <AnimationContainer delay={0.1}>
            <div>
              <SectionHeader
                eyebrow="Pricing"
                title="Clear, tailored pricing"
                description="Contact us for pricing. Every quote is tailored to your space, needs, and schedule."
                align="left"
              />
              <div className="mt-6">
                <PrimaryButton asChild>
                  <Link href="/get-a-quote">Get an Instant Quote</Link>
                </PrimaryButton>
              </div>
            </div>
          </AnimationContainer>
          <AnimationContainer delay={0.2}>
            <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-2 shadow-[0_28px_70px_-52px_hsl(var(--primary)/0.5)]">
              <Image
                src={SUPPORT_IMAGE}
                alt="Fresh, tidy kitchen with clean surfaces"
                width={1200}
                height={900}
                className="h-[280px] w-full rounded-[22px] object-cover sm:h-[340px]"
              />
            </div>
          </AnimationContainer>
        </div>
      </Section>

      <Section>
        <AnimationContainer delay={0.2}>
          <PricingCards />
        </AnimationContainer>
      </Section>

      <Section>
        <AnimationContainer delay={0.1}>
          <SectionHeader
            eyebrow="FAQs"
            title="Pricing questions answered"
            description="Here are the most common questions we get asked. If your question is not answered here, reach out any time."
          />
        </AnimationContainer>
        <AnimationContainer delay={0.2}>
          <FAQAccordion
            items={FAQ.map((item) => ({
              id: item.id,
              question: item.question,
              answer: item.answer,
            }))}
            className="mt-10"
          />
        </AnimationContainer>
      </Section>

      <Section>
        <CTAStrip
          title="Ready for a clear, calm clean?"
          description="Start with an instant quote and choose a slot that works for you."
          primaryHref="/get-a-quote"
          primaryLabel="Get an Instant Quote"
          secondaryHref="tel:07452824799"
          secondaryLabel="Call or WhatsApp us"
        />
      </Section>
    </MaxWidthWrapper>
  );
};

export default PricingPage;
