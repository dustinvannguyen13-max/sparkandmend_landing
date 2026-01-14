"use client";

import * as React from "react";
import type { SpringOptions } from "framer-motion";

import Particles from "@/components/ui/particles";
import { cn } from "@/utils";

interface StarsBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  factor?: number;
  speed?: number;
  transition?: SpringOptions;
  starColor?: string;
  pointerEvents?: boolean;
}

const StarsBackground = ({
  factor = 0.05,
  speed = 50,
  transition,
  starColor = "#ffffff",
  pointerEvents = true,
  className,
  ...props
}: StarsBackgroundProps) => {
  const quantity = Math.max(40, Math.round(1200 * factor));
  const baseSize = Math.max(0.6, Math.min(2, factor * 16));
  const drift = speed / 2000;
  const ease = transition?.stiffness ? Math.max(20, transition.stiffness / 2) : 50;
  const staticity = transition?.damping ? Math.max(40, transition.damping + 30) : 70;

  return (
    <div
      className={cn(
        "relative h-full w-full",
        !pointerEvents && "pointer-events-none",
        className,
      )}
      aria-hidden="true"
      {...props}
    >
      <Particles
        className="absolute inset-0"
        quantity={quantity}
        staticity={staticity}
        ease={ease}
        size={baseSize}
        color={starColor}
        vx={drift * 0.3}
        vy={drift}
      />
    </div>
  );
};

export { StarsBackground, type StarsBackgroundProps };
