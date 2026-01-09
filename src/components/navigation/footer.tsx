import Link from "next/link";
import { AnimationContainer, Icons } from "@/components";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

const Footer = () => {
  return (
    <footer className="flex flex-col relative items-center justify-center border-t border-border pt-16 pb-8 md:pb-0 px-6 lg:px-8 w-full max-w-6xl mx-auto lg:pt-32 bg-[radial-gradient(35%_128px_at_50%_0%,hsl(var(--brand-dark)/0.08),transparent)]">
      <div className="absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1.5 bg-foreground rounded-full"></div>

      <div className="grid gap-8 xl:grid-cols-3 xl:gap-8 w-full">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col items-start justify-start md:max-w-[200px]">
            <div className="flex items-start">
              <Icons.logo className="w-7 h-7" />
            </div>
            <p className="text-muted-foreground mt-4 text-sm text-start">
              Reliable cleaning for homes, offices, and rentals in Plymouth.
            </p>
            <span className="mt-4 text-muted-foreground text-sm">
              Plymouth, UK
            </span>
          </div>
        </AnimationContainer>

        <div className="grid-cols-2 gap-8 grid mt-16 xl:col-span-2 xl:mt-0">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <AnimationContainer delay={0.2}>
              <div className="">
                <h3 className="text-base font-medium text-foreground">Services</h3>
                <ul className="mt-4 text-sm text-muted-foreground">
                  <li className="mt-2">
                    <Link
                      href="/features/link-shortening"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Basic Clean
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="/features/password-protection"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Intermediate Clean
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="/features/analytics"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Advanced Clean
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="/features/qr-codes"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Commercial Cleaning
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimationContainer>
            <AnimationContainer delay={0.3}>
              <div className="mt-10 md:mt-0 flex flex-col">
                <h3 className="text-base font-medium text-foreground">Contact</h3>
                <ul className="mt-4 text-sm text-muted-foreground">
                  <li className="">
                    <Link
                      href="mailto:sparkandmend@gmail.com"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Email: sparkandmend@gmail.com
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="tel:07715293761"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Call: 07715 293761
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="tel:07452824799"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Call: 07452 824799
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="/enterprise"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Hours: Mon-Fri 9am-6pm
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="https://facebook.com"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Facebook
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="https://instagram.com"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Instagram
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimationContainer>
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <AnimationContainer delay={0.4}>
              <div className="">
                <h3 className="text-base font-medium text-foreground">Resources</h3>
                <ul className="mt-4 text-sm text-muted-foreground">
                  <li className="mt-2">
                    <Link
                      href="/resources/blog"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Blog
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="/resources/help"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Help &amp; Support
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimationContainer>
            <AnimationContainer delay={0.5}>
              <div className="mt-10 md:mt-0 flex flex-col">
                <h3 className="text-base font-medium text-foreground">Company</h3>
                <ul className="mt-4 text-sm text-muted-foreground">
                  <li className="">
                    <Link
                      href="/changelog"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      About Spark and Mend
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="/privacy"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      href="/terms"
                      className="hover:text-foreground transition-all duration-300"
                    >
                      Terms & Conditions
                    </Link>
                  </li>
                </ul>
              </div>
            </AnimationContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-border/40 pt-4 md:pt-8 md:flex md:items-center md:justify-between w-full">
        <AnimationContainer delay={0.6}>
          <p className="text-sm text-muted-foreground mt-8 md:mt-0">
            &copy; {new Date().getFullYear()} Spark and Mend. All rights reserved.
          </p>
        </AnimationContainer>
      </div>

      <div className="h-[20rem] lg:h-[20rem] hidden md:flex items-center justify-center">
        <TextHoverEffect text="Spark & Mend" />
      </div>
    </footer>
  );
};

export default Footer;
