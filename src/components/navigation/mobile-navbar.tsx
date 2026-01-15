"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/primary-button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, NAV_LINKS } from "@/utils";
import { Facebook, Instagram, LucideIcon, Menu, Music2, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex lg:hidden items-center justify-end">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-screen">
          <SheetClose
            asChild
            className="absolute top-3 right-5 bg-background z-20 flex items-center justify-center"
          >
            <Button size="icon" variant="ghost" className="text-foreground">
              <X className="w-5 h-5" />
            </Button>
          </SheetClose>
          <div className="flex flex-col items-start w-full py-2 mt-10">
            <div className="grid w-full grid-cols-2 gap-2">
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-auto w-full px-3 py-2 text-[11px] leading-snug whitespace-normal"
                  asChild
                >
                  <Link href="tel:07452824799" onClick={handleClose}>
                    Call 07452 824799
                  </Link>
                </Button>
                <PrimaryButton
                  className="h-auto w-full px-3 py-2 text-[11px] leading-snug whitespace-normal"
                  size="sm"
                  asChild
                >
                  <Link href="/get-a-quote" onClick={handleClose}>
                    Get an Instant Quote
                  </Link>
                </PrimaryButton>
              </>
            </div>
            <ul className="flex flex-col items-start w-full mt-6">
              <Accordion type="single" collapsible className="!w-full">
                {NAV_LINKS.map((link) => (
                  <AccordionItem
                    key={link.title}
                    value={link.title}
                    className="last:border-none"
                  >
                    {link.menu ? (
                      <>
                        <AccordionTrigger>{link.title}</AccordionTrigger>
                        <AccordionContent>
                          <ul onClick={handleClose} className={cn("w-full")}>
                            {link.menu.map((menuItem) => (
                              <ListItem
                                key={menuItem.title}
                                title={menuItem.title}
                                href={menuItem.href}
                                icon={menuItem.icon}
                              >
                                {menuItem.tagline}
                              </ListItem>
                            ))}
                          </ul>
                        </AccordionContent>
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={handleClose}
                        className="flex items-center w-full py-4 font-medium text-muted-foreground hover:text-foreground"
                      >
                        <span>{link.title}</span>
                      </Link>
                    )}
                  </AccordionItem>
                ))}
              </Accordion>
            </ul>
            <div className="mt-8 border-t border-border/60 pt-6 w-full">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.4em] text-muted-foreground">
                Follow us
              </h3>
              <div className="mt-3 grid gap-2">
                {[
                  {
                    href: "https://www.facebook.com/sparkandmend/",
                    label: "Facebook",
                    icon: Facebook,
                  },
                  {
                    href: "https://www.instagram.com/spark_mend/",
                    label: "Instagram",
                    icon: Instagram,
                  },
                  {
                    href: "https://www.tiktok.com/@spark.mend",
                    label: "TikTok",
                    icon: Music2,
                  },
                ].map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleClose}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <social.icon className="h-4 w-4" />
                    {social.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; icon: LucideIcon }
>(({ className, title, href, icon: Icon, children, ...props }, ref) => {
  return (
    <li>
      <Link
        href={href!}
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="flex items-center space-x-2 text-foreground">
          <Icon className="h-4 w-4" />
          <h6 className="text-sm !leading-none">{title}</h6>
        </div>
        <p
          title={children! as string}
          className="line-clamp-1 text-sm leading-snug text-muted-foreground"
        >
          {children}
        </p>
      </Link>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default MobileNavbar;
