"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/utils";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from "@/registry/components/headless/accordion";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

const FAQAccordion = ({ items, className }: FAQAccordionProps) => {
  return (
    <Accordion className={cn("space-y-3", className)}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          className="overflow-hidden rounded-2xl border border-border/70 bg-card/80"
        >
          <AccordionButton
            showArrow={false}
            className={cn(
              "group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-foreground transition-colors hover:text-foreground/90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            <span>{item.question}</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground transition-all group-data-[open]:bg-primary group-data-[open]:text-primary-foreground">
              <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[open]:rotate-180" />
            </span>
          </AccordionButton>
          <AccordionPanel className="px-5 pt-0 pb-5 text-sm text-muted-foreground">
            {item.answer}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQAccordion;
