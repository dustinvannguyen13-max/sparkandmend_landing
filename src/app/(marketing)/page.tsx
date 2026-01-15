import Link from "next/link";
import {
  AnimationContainer,
  MaxWidthWrapper,
} from "@/components";
import { BentoCard, BentoGrid, CARDS } from "@/components/ui/bento-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LampContainer } from "@/components/ui/lamp";
import MagicBadge from "@/components/ui/magic-badge";
import MagicCard from "@/components/ui/magic-card";
import { PrimaryButton } from "@/components/ui/primary-button";
import { RotatingText, RotatingTextContainer } from "@/components/ui/rotating-text";
import { StarsBackground } from "@/components/ui/stars-background";
import { COMPANIES, PROCESS, REVIEWS } from "@/utils";
import { ArrowRight, Star } from "lucide-react";

const HomePage = async () => {
  return (
    <div className="overflow-x-hidden scrollbar-hide size-full">
      <MaxWidthWrapper>
        <div className="relative flex flex-col items-center justify-center w-full text-center bg-gradient-to-t from-background">
          <StarsBackground
            className="absolute inset-0 opacity-35"
            starColor="#09484F"
            pointerEvents={false}
          />
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
            <h1 className="text-foreground text-center py-6 text-5xl font-medium tracking-normal text-balance break-words sm:text-6xl md:text-7xl lg:text-8xl !leading-[1.15] w-full font-heading">
              Spark &amp; Mend{" "}
              <span className="text-transparent mx-2 bg-gradient-to-r from-[#714b4b] to-[#efe6d9] bg-clip-text inline-bloc">
                cleaning
              </span>
              for{" "}
              <RotatingTextContainer
                text={["homes", "offices", "rentals"]}
                duration={2200}
                y={32}
                className="inline-flex min-w-[7ch] items-baseline"
                style={{ paddingBlock: 0 }}
              >
                <RotatingText className="text-primary font-semibold" />
              </RotatingTextContainer>{" "}
              in Plymouth
            </h1>
            <p className="mb-12 text-lg tracking-tight text-muted-foreground md:text-xl text-balance">
              Reliable home, office, and end-of-tenancy cleaning across Plymouth.
              <br className="hidden md:block" />
              <span className="hidden md:block">
                Define your requirements in our quote calculator for a fixed instant quote and instant booking.
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
              <div
                className="relative w-full h-[460px] md:h-[540px] lg:h-[600px] max-h-[200px] sm:max-h-none overflow-hidden rounded-[inherit] bg-center bg-cover bg-no-repeat"
                style={{
                  backgroundImage:
                    "url('https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/spark-and-mend-cover.png')",
                }}
              >
                <BorderBeam size={250} duration={12} delay={9} />
              </div>
              <div className="absolute -bottom-4 inset-x-0 w-full h-1/2 bg-gradient-to-t from-background z-40"></div>
              <div className="absolute bottom-0 md:-bottom-8 inset-x-0 w-full h-1/4 bg-gradient-to-t from-background z-50"></div>
            </div>
          </AnimationContainer>
        </div>
      </MaxWidthWrapper>

      {/* Companies Section */}
      <MaxWidthWrapper>
        <AnimationContainer delay={0.4}>
          <div className="py-14">
            <div className="mx-auto px-4 md:px-8">
              <h2 className="text-center text-sm font-medium font-heading text-muted-foreground uppercase">
                Trusted by Plymouth homes and local businesses
              </h2>
              <div className="mt-8">
                <ul className="flex flex-wrap items-center gap-3 md:gap-4 justify-center">
                  {COMPANIES.map((company) => (
                    <li key={company.name}>
                      <span className="inline-flex items-center rounded-full border border-border/60 px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {company.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </AnimationContainer>
      </MaxWidthWrapper>

      {/* Features Section */}
      <MaxWidthWrapper className="pt-10">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col w-full items-center lg:items-center justify-center py-8">
            <MagicBadge title="Services" />
            <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
              Cleaning that fits your life
            </h2>
            <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
              No time after work or tired of cleaning that never stays done? Spark
              and Mend delivers reliable, checklist-based cleans for homes,
              offices, and rentals across Plymouth.
            </p>
          </div>
        </AnimationContainer>
        <AnimationContainer delay={0.2}>
          <BentoGrid className="py-8">
            {CARDS.map((feature, idx) => (
              <BentoCard key={idx} {...feature} />
            ))}
          </BentoGrid>
        </AnimationContainer>
      </MaxWidthWrapper>

      {/* Process Section */}
      <MaxWidthWrapper className="py-10">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
            <MagicBadge title="How It Works" />
            <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
              A clean space in 3 simple steps
            </h2>
            <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
              Get a fixed instant quote with the calculator, book instantly, and let us handle the rest.
            </p>
          </div>
        </AnimationContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full py-8 gap-4 md:gap-8">
          {PROCESS.map((process, id) => (
            <AnimationContainer delay={0.2 * id} key={id}>
              <MagicCard className="group md:py-8">
                <div className="flex flex-col items-start justify-center w-full">
                  <process.icon
                    strokeWidth={1.5}
                    className="w-10 h-10 text-foreground"
                  />
                  <div className="flex flex-col relative items-start">
                    <span className="absolute -top-6 right-0 border-2 border-border text-foreground font-medium text-2xl rounded-full w-12 h-12 flex items-center justify-center pt-0.5">
                      {id + 1}
                    </span>
                    <h3 className="text-base mt-6 font-medium text-foreground">
                      {process.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {process.description}
                    </p>
                  </div>
                </div>
              </MagicCard>
            </AnimationContainer>
          ))}
        </div>
      </MaxWidthWrapper>

      {/* Reviews Section */}
      <MaxWidthWrapper className="py-10">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-center lg:items-center justify-center w-full py-8 max-w-xl mx-auto">
            <MagicBadge title="Local Reviews" />
            <h2 className="text-center lg:text-center text-3xl md:text-5xl !leading-[1.1] font-medium font-heading text-foreground mt-6">
              What Plymouth clients are saying
            </h2>
            <p className="mt-4 text-center lg:text-center text-lg text-muted-foreground max-w-lg">
              Feedback from homes and local businesses we clean every week.
            </p>
          </div>
        </AnimationContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-start gap-4 md:gap-8 py-10">
          <div className="flex flex-col items-start h-min gap-6">
            {REVIEWS.slice(0, 3).map((review, index) => (
              <AnimationContainer delay={0.2 * index} key={index}>
                <MagicCard key={index} className="md:p-0">
                  <Card className="flex flex-col w-full border-none h-min">
                    <CardHeader className="space-y-0">
                      <CardTitle className="text-lg font-medium text-muted-foreground">
                        {review.name}
                      </CardTitle>
                      <CardDescription>{review.username}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-4">
                      <p className="text-muted-foreground">{review.review}</p>
                    </CardContent>
                    <CardFooter className="w-full space-x-1 mt-auto">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </CardFooter>
                  </Card>
                </MagicCard>
              </AnimationContainer>
            ))}
          </div>
          <div className="flex flex-col items-start h-min gap-6">
            {REVIEWS.slice(3, 6).map((review, index) => (
              <AnimationContainer delay={0.2 * index} key={index}>
                <MagicCard key={index} className="md:p-0">
                  <Card className="flex flex-col w-full border-none h-min">
                    <CardHeader className="space-y-0">
                      <CardTitle className="text-lg font-medium text-muted-foreground">
                        {review.name}
                      </CardTitle>
                      <CardDescription>{review.username}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-4">
                      <p className="text-muted-foreground">{review.review}</p>
                    </CardContent>
                    <CardFooter className="w-full space-x-1 mt-auto">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </CardFooter>
                  </Card>
                </MagicCard>
              </AnimationContainer>
            ))}
          </div>
          <div className="flex flex-col items-start h-min gap-6">
            {REVIEWS.slice(6, 9).map((review, index) => (
              <AnimationContainer delay={0.2 * index} key={index}>
                <MagicCard key={index} className="md:p-0">
                  <Card className="flex flex-col w-full border-none h-min">
                    <CardHeader className="space-y-0">
                      <CardTitle className="text-lg font-medium text-muted-foreground">
                        {review.name}
                      </CardTitle>
                      <CardDescription>{review.username}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-4">
                      <p className="text-muted-foreground">{review.review}</p>
                    </CardContent>
                    <CardFooter className="w-full space-x-1 mt-auto">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </CardFooter>
                  </Card>
                </MagicCard>
              </AnimationContainer>
            ))}
          </div>
        </div>
      </MaxWidthWrapper>

      {/* CTA Section */}
      <MaxWidthWrapper className="mt-20 max-w-[100vw] overflow-x-hidden scrollbar-hide">
        <AnimationContainer delay={0.1}>
          <LampContainer>
            <div className="flex flex-col items-center justify-center relative w-full text-center">
              <h2 className="bg-gradient-to-b from-[#efe6d9] to-[#714b4b] py-4 bg-clip-text text-center text-4xl md:text-7xl !leading-[1.15] font-medium font-heading tracking-tight text-transparent mt-8">
                A cleaner space, without the effort
              </h2>
              <p className="text-muted-foreground mt-6 max-w-md mx-auto">
                Tell us about your space and we will send a free, no-obligation
                quote. Prefer to talk? Call or email us any time.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/get-a-quote" className="flex items-center">
                    Get an Instant Quote
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </LampContainer>
        </AnimationContainer>
      </MaxWidthWrapper>
    </div>
  );
};

export default HomePage;
