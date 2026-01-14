import { AnimationContainer, MaxWidthWrapper } from "@/components";
import QuoteCalculator from "@/components/quote/quote-calculator";
import MagicBadge from "@/components/ui/magic-badge";

const GetAQuotePage = () => {
  return (
    <MaxWidthWrapper className="py-16">
      <AnimationContainer delay={0.1}>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <MagicBadge title="Instant Quote" />
          <h1 className="text-3xl md:text-5xl font-semibold font-heading text-foreground mt-6">
            Get an instant cleaning quote in minutes
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Pick a service, tell us about your property, and we will calculate a
            personalised estimate right away.
          </p>
        </div>
      </AnimationContainer>
      <AnimationContainer delay={0.2} className="mt-12">
        <QuoteCalculator />
      </AnimationContainer>
    </MaxWidthWrapper>
  );
};

export default GetAQuotePage;
