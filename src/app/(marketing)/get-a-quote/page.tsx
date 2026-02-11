import Image from "next/image";
import { Suspense } from "react";
import { AnimationContainer, MaxWidthWrapper } from "@/components";
import StripeTestButton from "@/components/payment/stripe-test-button";
import QuoteCalculator from "@/components/quote/quote-calculator";
import MagicBadge from "@/components/ui/magic-badge";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Section, SectionHeader } from "@/components/ui/section";
import { StarsBackground } from "@/components/ui/stars-background";

const HERO_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.157589-XRPOXTQECTKYUAVFQOKA/imgg-od3-4foq0c2e.png?format=2500w";
const heroSurface =
  "relative overflow-hidden rounded-[36px] border border-border/50 bg-[radial-gradient(120%_120%_at_80%_0%,hsl(var(--background))_0%,hsl(var(--subtle))_45%,hsl(var(--background))_100%)] px-6 pt-10 pb-12 md:px-12 md:pt-12 md:pb-14 shadow-[0_45px_100px_-70px_hsl(var(--primary)/0.45)]";

const SHOW_STRIPE_TEST_BUTTON =
  process.env.NEXT_PUBLIC_ENABLE_STRIPE_TEST_BUTTON === "true";

interface GetAQuotePageProps {
  searchParams?: {
    stripeTest?: string;
  };
}

const GetAQuotePage = ({ searchParams }: GetAQuotePageProps) => {
  const stripeTestStatus = searchParams?.stripeTest;

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
              <MagicBadge title="Instant Quote" />
              <SectionHeader
                title="Get an instant cleaning quote in minutes"
                description="Pick a service, define your requirements, and get a fixed instant quote. Book instantly via the calculator."
                align="left"
                className="mt-6"
              />
              <p className="mt-4 text-sm text-muted-foreground">
                Fixed instant quote takes about 60 seconds.
              </p>
              <div className="mt-6 flex justify-center lg:justify-start">
                <PrimaryButton asChild>
                  <a href="#instant-quote-form">Jump to the quote form</a>
                </PrimaryButton>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-card/75 p-2 shadow-[0_30px_70px_-55px_hsl(var(--primary)/0.45)]">
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

      <Section id="instant-quote-form" className="scroll-mt-24">
        <AnimationContainer delay={0.2}>
          <Suspense
            fallback={
              <div className="rounded-3xl border border-border/60 bg-card/70 p-6 text-sm text-muted-foreground">
                Loading the instant quote form...
              </div>
            }
          >
            <QuoteCalculator />
          </Suspense>
        </AnimationContainer>
      </Section>

      {SHOW_STRIPE_TEST_BUTTON && (
        <Section className="pt-6">
          <AnimationContainer delay={0.25}>
            <div className="rounded-3xl border border-border/70 bg-card/90 p-6 text-center shadow-[0_30px_70px_-50px_hsl(var(--primary)/0.45)]">
              <SectionHeader
                eyebrow="Stripe test"
                title="Run a £1 test payment"
                description="Temporary button to verify Stripe Checkout is working."
              />
              {stripeTestStatus === "success" && (
                <p className="mt-4 text-sm text-emerald-600">
                  Test payment completed. Stripe Checkout returned successfully.
                </p>
              )}
              {stripeTestStatus === "cancel" && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Test checkout was cancelled.
                </p>
              )}
              <div className="mt-6 mx-auto max-w-xs">
                <StripeTestButton />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Disable with <code>NEXT_PUBLIC_ENABLE_STRIPE_TEST_BUTTON</code>{" "}
                when finished testing.
              </p>
            </div>
          </AnimationContainer>
        </Section>
      )}
    </MaxWidthWrapper>
  );
};

export default GetAQuotePage;
