import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/utils";
import { Card } from "@/components/ui/card";

export interface FeatureItem {
  title: string;
  description: string;
  icon: React.ElementType;
  href?: string;
  cta?: string;
}

interface FeatureGridProps {
  items: FeatureItem[];
  className?: string;
}

const FeatureGrid = ({ items, className }: FeatureGridProps) => {
  return (
    <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.title}
            className="group h-full border-border/70 bg-card/90 p-6 transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_28px_70px_-44px_hsl(var(--primary)/0.4)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="mt-5 space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
            {item.href && item.cta ? (
              <div className="mt-4">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-foreground/80 transition-colors group-hover:text-foreground"
                >
                  {item.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
};

export default FeatureGrid;
