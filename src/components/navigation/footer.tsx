import Link from "next/link";
import { AnimationContainer, Icons } from "@/components";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { Clock, Facebook, Instagram, Mail, MessageCircle, Phone, Music2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-border/60 bg-[radial-gradient(40%_160px_at_50%_0%,hsl(var(--primary)/0.08),transparent)]">
      <div className="flex flex-col items-center justify-center px-6 lg:px-10 pt-16 pb-8 md:pb-0 w-full max-w-6xl mx-auto lg:pt-24">
        <div className="absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-1.5 bg-foreground rounded-full"></div>

        <div className="grid gap-10 xl:grid-cols-3 xl:gap-12 w-full">
          <AnimationContainer delay={0.1}>
            <div className="flex flex-col items-start justify-start md:max-w-[200px]">
              <div className="flex items-start">
                <Icons.logo className="w-7 h-7" />
                <span className="mt-1 "><strong>SPARK & MEND</strong></span>
              </div>
              <p className="text-muted-foreground mt-4 text-sm text-start">
                Reliable cleaning for homes, offices, and rentals in Plymouth.
              </p>
              <div className="mt-4 text-[11px] text-muted-foreground space-y-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground">
                  SPARK AND MEND LTD
                </p>
                <p>Company number 16553723</p>
                <p>25 Belgrave Road, Plymouth, England, PL4 7DP</p>
              </div>
            </div>
          </AnimationContainer>

          <div className="grid gap-8 mt-10 xl:col-span-2 xl:mt-0 sm:grid-cols-2 lg:grid-cols-3">
            <AnimationContainer delay={0.2}>
              <div className="flex flex-col">
                <h3 className="text-base font-medium text-foreground">Services</h3>
              <ul className="mt-4 text-sm text-muted-foreground">
                <li className="mt-2">
                  <Link
                    href="/basic-clean"
                    className="hover:text-foreground transition-all duration-300"
                  >
                    Basic Clean
                  </Link>
                </li>
                <li className="mt-2">
                  <Link
                    href="/intermediate-clean"
                    className="hover:text-foreground transition-all duration-300"
                  >
                    Intermediate Clean
                  </Link>
                </li>
                <li className="mt-2">
                  <Link
                    href="/advanced-clean"
                    className="hover:text-foreground transition-all duration-300"
                  >
                    Advanced Clean
                  </Link>
                </li>
                <li className="mt-2">
                  <Link
                    href="/commercial-cleaning"
                    className="hover:text-foreground transition-all duration-300"
                  >
                    Commercial Cleaning
                  </Link>
                </li>
              </ul>
            </div>
          </AnimationContainer>
          <AnimationContainer delay={0.3}>
            <div className="flex flex-col">
              <h3 className="text-base font-medium text-foreground">Contact</h3>
              <ul className="mt-4 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="mailto:sparkandmend@gmail.com"
                    className="flex items-center gap-2 hover:text-foreground transition-all duration-300"
                  >
                    <Mail className="h-4 w-4" />
                    Email: sparkandmend@gmail.com
                  </Link>
                </li>
                <li className="mt-2">
                  <Link
                    href="tel:07452824799"
                    className="flex items-center gap-2 hover:text-foreground transition-all duration-300"
                  >
                    <Phone className="h-4 w-4" />
                    Call: 07452 824799
                  </Link>
                </li>
                <li className="mt-2">
                  <Link
                    href="https://wa.me/447452824799"
                    className="flex items-center gap-2 hover:text-foreground transition-all duration-300"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp: 07452 824799
                  </Link>
                </li>
                <li className="mt-2">
                  <Link
                    href="/get-a-quote"
                    className="flex items-center gap-2 hover:text-foreground transition-all duration-300"
                  >
                    <Clock className="h-4 w-4" />
                    Hours: Mon-Fri 9am-6pm
                  </Link>
                </li>
              </ul>
            </div>
          </AnimationContainer>
          <AnimationContainer delay={0.4}>
            <div className="flex flex-col">
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
                    Gallery
                  </Link>
                </li>
              </ul>
            </div>
          </AnimationContainer>
            <AnimationContainer delay={0.5}>
            <div className="flex flex-col">
              <h3 className="text-base font-medium text-foreground">Company</h3>
              <ul className="mt-4 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/about/why-us"
                    className="hover:text-foreground transition-all duration-300"
                  >
                    Why Us
                  </Link>
                </li>
                <li className="mt-2">
                  <Link
                    href="/about/team"
                    className="hover:text-foreground transition-all duration-300"
                  >
                    Meet the Team
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
                <li className="mt-2">
                  <Link
                    href="/cookie-policy"
                    className="hover:text-foreground transition-all duration-300"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </AnimationContainer>
          <AnimationContainer delay={0.6}>
            <div className="flex flex-col">
              <h3 className="text-base font-medium text-foreground">Socials</h3>
              <ul className="mt-4 text-sm text-muted-foreground">
                <li className="mt-2">
                  <Link
                    href="https://www.facebook.com/sparkandmend/"
                    className="flex items-center gap-2 hover:text-foreground transition-all duration-300"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Link>
                </li>
                <li className="mt-2">
                  <Link
                    href="https://www.instagram.com/spark_mend/"
                    className="flex items-center gap-2 hover:text-foreground transition-all duration-300"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Link>
                </li>
                <li className="mt-2">
                  <Link
                    href="https://www.tiktok.com/@spark.mend"
                    className="flex items-center gap-2 hover:text-foreground transition-all duration-300"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Music2 className="h-4 w-4" />
                    TikTok
                  </Link>
                </li>
              </ul>
            </div>
          </AnimationContainer>
          </div>
        </div>

        <div className="mt-10 border-t border-border/40 pt-4 md:pt-8 md:flex md:items-center md:justify-between w-full">
          <AnimationContainer delay={0.6} className="w-full md:flex md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground mt-8 md:mt-0">
              &copy; {new Date().getFullYear()} Spark & Mend. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              Built by{" "}
              <Link href="https://ghostseed.io" className="hover:text-foreground">
                ghostseed.io
              </Link>
            </p>
          </AnimationContainer>
        </div>

        <div className="h-[16rem] hidden md:flex items-center justify-center">
          <TextHoverEffect text="S & M" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
