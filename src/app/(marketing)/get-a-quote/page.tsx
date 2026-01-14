import Image from "next/image";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import QuoteCalculator from "@/components/quote/quote-calculator";
import MagicBadge from "@/components/ui/magic-badge";
import { Section, SectionHeader } from "@/components/ui/section";

const HERO_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.157589-XRPOXTQECTKYUAVFQOKA/imgg-od3-4foq0c2e.png?format=2500w";

const GetAQuotePage = () => {
  return (
    <MaxWidthWrapper className="pt-16 pb-20">
      <Section className="pt-6">
        <AnimationContainer delay={0.1}>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="text-center lg:text-left">
              <MagicBadge title="Instant Quote" />
              <SectionHeader
                title="Get an instant cleaning quote in minutes"
                description="Pick a service, tell us about your property, and we will calculate a personalised estimate right away."
                align="left"
                className="mt-6"
              />
              <p className="mt-4 text-sm text-muted-foreground">
                Instant quote takes about 60 seconds.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-2 shadow-[0_28px_70px_-52px_hsl(var(--primary)/0.5)]">
              <Image
                src={HERO_IMAGE}
                alt="Bright, freshly cleaned living space"
                width={1200}
                height={900}
                className="h-[280px] w-full rounded-[22px] object-cover sm:h-[340px]"
              />
            </div>
          </div>
        </AnimationContainer>
      </Section>

      <Section>
        <AnimationContainer delay={0.2}>
          <QuoteCalculator />
        </AnimationContainer>
      </Section>
    </MaxWidthWrapper>
  );
};

export default GetAQuotePage;
