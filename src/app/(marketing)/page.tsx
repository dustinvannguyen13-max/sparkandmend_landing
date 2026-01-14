import Image from "next/image";
import Link from "next/link";
import {
  AnimationContainer,
  MaxWidthWrapper,
  PricingCards,
} from "@/components";
import { BorderBeam } from "@/components/ui/border-beam";
import CTAStrip from "@/components/ui/cta-strip";
import FeatureGrid from "@/components/ui/feature-grid";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COMPANIES, PROCESS, REVIEWS } from "@/utils";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Clock,
  Star,
} from "lucide-react";

const SUPPORT_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.460308-XCMNTOMRCKQFUOKREBBC/imgg-od3-4wz7yy4a.png?format=2500w";
const ALT_IMAGE =
  "https://images.squarespace-cdn.com/content/v1/68f61185d7996607511c654e/1722371011.032175-FEUGECPAUDAFVQTGEIVS/imgg-od3-sa5ajg65.png?format=2500w";

const HIGHLIGHTS = [
  {
    title: "Clear scope, no surprises",
    description: "Checklist-based cleans with straightforward pricing and simple booking.",
    icon: ShieldCheck,
    href: "/get-a-quote",
    cta: "Get an Instant Quote",
  },
  {
    title: "Local, reliable team",
    description: "Friendly cleaners who arrive on time and focus on the details that matter.",
    icon: Sparkles,
    href: "/get-a-quote",
    cta: "Check availability",
  },
  {
    title: "Flexible scheduling",
    description: "Weekly, fortnightly, monthly, or one-off cleans that fit your routine.",
    icon: CalendarDays,
    href: "/pricing",
    cta: "View services",
  },
];

const SERVICE_CARDS = [
  {
    title: "Basic Clean",
    description: "Light, regular upkeep for already tidy homes and small offices.",
    icon: CheckCircle2,
    href: "/features/link-shortening",
    cta: "View Basic Clean",
  },
  {
    title: "Intermediate Clean",
    description: "Extra time on build-up and touch points for a sharper finish.",
    icon: Sparkles,
    href: "/features/password-protection",
    cta: "View Intermediate",
  },
  {
    title: "Advanced Clean",
    description: "A full reset for first cleans, seasonal refreshes, or before guests.",
    icon: ShieldCheck,
    href: "/features/analytics",
    cta: "View Advanced",
  },
  {
    title: "Commercial Cleaning",
    description: "Professional, consistent cleaning for offices and shared workspaces.",
    icon: Clock,
    href: "/features/qr-codes",
    cta: "View Commercial",
  },
];

const HomePage = async () => {
  return (
    <div className="overflow-x-hidden">
      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-center w-full text-center bg-gradient-to-t from-background">
          <AnimationContainer className="flex flex-col items-center justify-center w-full text-center">
            <button className="group relative grid overflow-hidden rounded-full px-4 py-1 shadow-[0_1000px_0_0_hsl(var(--brand-dark))_inset] transition-colors duration-200">
              <span>
                <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
              </span>
              <span className="backdrop absolute inset-[1px] rounded-full bg-primary transition-colors duration-200 group-hover:bg-primary/90" />
              <span className="h-full w-full blur-md absolute bottom-0 inset-x-0 bg-gradient-to-tr from-primary/20"></span>
              <span className="z-10 py-0.5 text-sm text-primary-foreground flex items-center justify-center gap-1">
                ✨ Local Plymouth cleaners you can rely on
                <ArrowRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </span>
            </button>
            <h1 className="text-foreground text-center py-6 text-5xl font-medium tracking-normal text-balance sm:text-6xl md:text-7xl lg:text-8xl !leading-[1.15] w-full font-heading">
              Spark &amp; Mend{" "}
              <span className="text-transparent mx-2 bg-gradient-to-r from-[#714b4b] to-[#efe6d9] bg-clip-text inline-bloc">
                cleaning
              </span>
              for homes, offices, and rentals in Plymouth
            </h1>
            <p className="mb-12 text-lg tracking-tight text-muted-foreground md:text-xl text-balance">
              Reliable home, office, and end-of-tenancy cleaning across Plymouth.
              <br className="hidden md:block" />
              <span className="hidden md:block">
                Local team, clear checklists, flexible scheduling, and fast quotes.
              </span>
            </p>
            <div className="flex items-center justify-center whitespace-nowrap gap-4 z-50">
              <PrimaryButton asChild>
                <Link href="/get-a-quote" className="flex items-center">
                  Get an Instant Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </PrimaryButton>
            </div>
          </AnimationContainer>

          <AnimationContainer
            delay={0.2}
            className="relative pt-20 pb-20 md:py-32 px-2 bg-transparent w-full"
          >
            <div className="absolute md:top-[10%] left-1/2 gradient w-3/4 -translate-x-1/2 h-1/4 md:h-1/3 inset-0 blur-[5rem] animate-image-glow"></div>
            <div className="-m-2 rounded-xl p-2 ring-1 ring-inset ring-foreground/20 lg:-m-4 lg:rounded-2xl bg-opacity-50 backdrop-blur-3xl">
              <BorderBeam size={250} duration={12} delay={9} />
              <div className="w-full h-[400px] bg-card"></div>
              <div className="absolute -bottom-4 inset-x-0 w-full h-1/2 bg-gradient-to-t from-background z-40"></div>
              <div className="absolute bottom-0 md:-bottom-8 inset-x-0 w-full h-1/4 bg-gradient-to-t from-background z-50"></div>
            </div>
          </AnimationContainer>
        </div>
      </MaxWidthWrapper>

      <MaxWidthWrapper>
        <Section>
          <AnimationContainer delay={0.1}>
            <SectionHeader
              eyebrow="Why Spark & Mend"
              title="Premium, calm cleaning that fits real schedules"
              description="Clear communication, consistent standards, and a simple booking flow so you can relax." 
            />
          </AnimationContainer>
          <AnimationContainer delay={0.2}>
            <FeatureGrid items={HIGHLIGHTS} className="mt-10" />
          </AnimationContainer>
        </Section>
      </MaxWidthWrapper>

      <MaxWidthWrapper>
        <Section>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <AnimationContainer delay={0.1}>
              <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-2 shadow-[0_28px_70px_-52px_hsl(var(--primary)/0.5)]">
                <Image
                  src={SUPPORT_IMAGE}
                  alt="Clean kitchen surfaces and tidy finishes"
                  width={1200}
                  height={900}
                  className="h-[300px] w-full rounded-[22px] object-cover sm:h-[360px]"
                />
              </div>
            </AnimationContainer>
            <AnimationContainer delay={0.2}>
              <div>
                <SectionHeader
                  eyebrow="Services"
                  title="Cleaning that fits your life"
                  description="No time after work or tired of cleaning that never stays done? Spark & Mend delivers reliable, checklist-based cleans for homes, offices, and rentals across Plymouth."
                  align="left"
                />
                <FeatureGrid items={SERVICE_CARDS} className="mt-10" />
              </div>
            </AnimationContainer>
          </div>
        </Section>
      </MaxWidthWrapper>

      <MaxWidthWrapper>
        <Section>
          <AnimationContainer delay={0.1}>
            <SectionHeader
              eyebrow="How it works"
              title="A clean space in three simple steps"
              description="Get an instant quote, choose a time, and let us handle the rest." 
            />
          </AnimationContainer>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PROCESS.map((process, index) => (
              <AnimationContainer key={process.title} delay={0.1 + index * 0.1}>
                <Card className="h-full border-border/70 bg-card/90 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <process.icon className="h-5 w-5" />
                  </div>
                  <CardHeader className="px-0 pb-0 pt-5">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {process.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 pt-3 text-sm text-muted-foreground">
                    {process.description}
                  </CardContent>
                </Card>
              </AnimationContainer>
            ))}
          </div>
        </Section>
      </MaxWidthWrapper>

      <MaxWidthWrapper>
        <Section>
          <AnimationContainer delay={0.1}>
            <SectionHeader
              eyebrow="Service areas"
              title="Trusted by Plymouth homes and local businesses"
              description="From rentals to workspaces, we keep local spaces looking their best." 
            />
          </AnimationContainer>
          <AnimationContainer delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {COMPANIES.map((company) => (
                <span
                  key={company.name}
                  className="inline-flex items-center rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {company.name}
                </span>
              ))}
            </div>
          </AnimationContainer>
        </Section>
      </MaxWidthWrapper>

      <MaxWidthWrapper>
        <Section>
          <AnimationContainer delay={0.1}>
            <SectionHeader
              eyebrow="Services & Pricing"
              title="Choose the clean that works for you"
              description="Contact us for pricing. We tailor every quote to your space and schedule." 
            />
          </AnimationContainer>
          <AnimationContainer delay={0.2}>
            <PricingCards />
          </AnimationContainer>
        </Section>
      </MaxWidthWrapper>

      <MaxWidthWrapper>
        <Section>
          <AnimationContainer delay={0.1}>
            <SectionHeader
              eyebrow="Local reviews"
              title="What Plymouth clients are saying"
              description="Feedback from homes and local businesses we clean every week." 
            />
          </AnimationContainer>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.slice(0, 6).map((review, index) => (
              <AnimationContainer key={review.name} delay={0.1 + index * 0.05}>
                <Card className="h-full border-border/70 bg-card/90 p-6">
                  <div className="flex items-center gap-1 text-secondary">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <Star key={i} className="h-4 w-4 fill-secondary" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {review.review}
                  </p>
                  <p className="mt-6 text-sm font-semibold text-foreground">
                    {review.name}
                  </p>
                </Card>
              </AnimationContainer>
            ))}
          </div>
        </Section>
      </MaxWidthWrapper>

      <MaxWidthWrapper>
        <Section>
          <AnimationContainer delay={0.1}>
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <CTAStrip
                title="A cleaner space, without the effort"
                description="Tell us about your space and we will send a fast, no-obligation quote. Prefer to talk? Call or WhatsApp us any time."
                primaryHref="/get-a-quote"
                primaryLabel="Get an Instant Quote"
                secondaryHref="tel:07452824799"
                secondaryLabel="Call or WhatsApp us"
                className="text-left lg:text-left"
              />
              <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/90 p-2 shadow-[0_24px_60px_-46px_hsl(var(--primary)/0.45)]">
                <Image
                  src={ALT_IMAGE}
                  alt="Freshly cleaned, calm interior setting"
                  width={1200}
                  height={900}
                  className="h-[260px] w-full rounded-[22px] object-cover sm:h-[320px]"
                />
              </div>
            </div>
          </AnimationContainer>
        </Section>
      </MaxWidthWrapper>
    </div>
  );
};

export default HomePage;
