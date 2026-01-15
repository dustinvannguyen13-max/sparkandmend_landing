"use client";

import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/primary-button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn, NAV_LINKS } from "@/utils";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "../global/max-width-wrapper";
import MobileNavbar from "./mobile-navbar";
import AnimationContainer from "../global/animation-container";
import { Icons } from "../global/icons";
import { BrushCleaning } from "../ui/brush-cleaning";

type NavMenuItem = NonNullable<(typeof NAV_LINKS)[number]["menu"]>[number];

const DEFAULT_SERVICE_CARD = {
  title: "All Services",
  tagline: "Regular, intermediate, advanced, and commercial options for every space.",
  href: "/",
};

const SERVICE_CARD_BACKGROUNDS: Record<string, string> = {
  "All Services":
    "bg-[radial-gradient(120%_120%_at_0%_0%,hsl(var(--primary)/0.12),transparent_60%)]",
  "Basic Clean":
    "bg-[radial-gradient(120%_120%_at_0%_0%,hsl(var(--primary)/0.16),transparent_60%)]",
  "Intermediate Clean":
    "bg-[radial-gradient(120%_120%_at_0%_0%,hsl(var(--secondary)/0.2),transparent_60%)]",
  "Advanced Clean":
    "bg-[radial-gradient(120%_120%_at_0%_0%,hsl(var(--primary)/0.22),hsl(var(--secondary)/0.12)_55%,transparent)]",
  "Commercial Cleaning":
    "bg-[radial-gradient(120%_120%_at_0%_0%,hsl(var(--secondary)/0.22),transparent_60%)]",
};

const SERVICE_CARD_IMAGES: Record<string, { src: string; alt: string }> = {
  "All Services": {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/clean-sink.jpg",
    alt: "Clean sink and fixtures",
  },
  "Basic Clean": {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/sofa-clean.jpg",
    alt: "Freshly cleaned sofa",
  },
  "Intermediate Clean": {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/carpet-stain-removed-clean.jpg",
    alt: "Carpet stain removed after cleaning",
  },
  "Advanced Clean": {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/oven-cleaned.jpg",
    alt: "Oven after a deep clean",
  },
  "Commercial Cleaning": {
    src: "https://fmijmundotmgtsemfdat.supabase.co/storage/v1/object/public/media/restaurant-kitchen-clean-1.jpg",
    alt: "Commercial kitchen cleaned surfaces",
  },
};

const Navbar = () => {
  const [scroll, setScroll] = useState(false);
  const [activeService, setActiveService] = useState<NavMenuItem | null>(null);

  const handleScroll = () => {
    if (window.scrollY > 8) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 inset-x-0 h-16 w-full border-b border-transparent z-[99999] select-none",
        scroll && "border-border/60 bg-background/80 backdrop-blur-lg"
      )}
    >
      <AnimationContainer reverse delay={0.1} className="size-full">
        <MaxWidthWrapper className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link
              href="/"
              className="flex items-center gap-x-2"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event("spark-mend-close-nav"));
                }
              }}
            >
              <Icons.logo className="w-6 h-6" />
              <h1 className="text-base md:text-lg font-semibold uppercase tracking-[0.02em] text-primary whitespace-nowrap">
                Spark &amp; Mend
              </h1>
            </Link>

            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {NAV_LINKS.map((link) => (
                  <NavigationMenuItem key={link.title}>
                    {link.menu ? (
                      <>
                        <NavigationMenuTrigger>
                          {link.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul
                            className={cn(
                              "grid gap-1 p-4 md:w-[400px] lg:w-[500px] rounded-xl",
                              link.title === "Services"
                                ? "lg:grid-cols-[.75fr_1fr]"
                                : "lg:grid-cols-2"
                            )}
                            onMouseLeave={() => {
                              if (link.title === "Services") setActiveService(null);
                            }}
                            onBlur={(event) => {
                              if (
                                link.title === "Services" &&
                                !event.currentTarget.contains(event.relatedTarget as Node)
                              ) {
                                setActiveService(null);
                              }
                            }}
                          >
                            {link.title === "Services" && (
                              <li className="row-span-4 pr-2 relative rounded-xl overflow-hidden">
                                <NavigationMenuLink asChild className="z-20 relative">
                                  <Link
                                    href={activeService?.href ?? DEFAULT_SERVICE_CARD.href}
                                    className={cn(
                                      "relative flex h-full w-full select-none flex-col justify-end overflow-hidden rounded-xl border border-border/60 bg-card/90 p-4 no-underline outline-none transition-all focus:shadow-md",
                                      SERVICE_CARD_BACKGROUNDS[
                                        activeService?.title ?? DEFAULT_SERVICE_CARD.title
                                      ] ?? SERVICE_CARD_BACKGROUNDS["All Services"]
                                    )}
                                  >
                                    <div className="absolute inset-0">
                                      <Image
                                        src={
                                          SERVICE_CARD_IMAGES[
                                            activeService?.title ?? DEFAULT_SERVICE_CARD.title
                                          ]?.src ?? SERVICE_CARD_IMAGES["All Services"].src
                                        }
                                        alt={
                                          SERVICE_CARD_IMAGES[
                                            activeService?.title ?? DEFAULT_SERVICE_CARD.title
                                          ]?.alt ?? SERVICE_CARD_IMAGES["All Services"].alt
                                        }
                                        fill
                                        sizes="240px"
                                        className="object-cover filter brightness-80 contrast-105 saturate-110 transition duration-700"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/90 to-transparent" />
                                    </div>
                                    <h6 className="relative z-10 mb-2 mt-4 text-lg font-semibold">
                                      {activeService?.title ?? DEFAULT_SERVICE_CARD.title}
                                    </h6>
                                    <p className="relative z-10 text-sm leading-tight text-muted-foreground">
                                      {activeService?.tagline ?? DEFAULT_SERVICE_CARD.tagline}
                                    </p>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            )}
                            {link.menu.map((menuItem) => (
                              <ListItem
                                key={menuItem.title}
                                title={menuItem.title}
                                href={menuItem.href}
                                icon={menuItem.icon}
                                onMouseEnter={() => {
                                  if (link.title === "Services") setActiveService(menuItem);
                                }}
                                onFocus={() => {
                                  if (link.title === "Services") setActiveService(menuItem);
                                }}
                              >
                                {menuItem.tagline}
                              </ListItem>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link href={link.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          {link.title}
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden lg:flex items-center">
            <div className="flex items-center gap-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="tel:07452824799">Call 07452 824799</Link>
              </Button>
              <PrimaryButton size="sm" asChild>
                <Link href="/get-a-quote" className="flex items-center gap-2 group">
                  Get an Instant Quote
                  <BrushCleaning className="size-3.5" animateOnHover />
                </Link>
              </PrimaryButton>
            </div>
          </div>

          <MobileNavbar />
        </MaxWidthWrapper>
      </AnimationContainer>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; icon: LucideIcon }
>(({ className, title, href, icon: Icon, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href!}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-100 ease-out hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center space-x-2 text-foreground">
            <Icon className="h-4 w-4" />
            <h6 className="text-sm font-medium !leading-none">{title}</h6>
          </div>
          <p
            title={children! as string}
            className="line-clamp-1 text-sm leading-snug text-muted-foreground"
          >
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
