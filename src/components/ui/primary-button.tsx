"use client";

import * as React from "react";

import { LiquidButton, type LiquidButtonProps } from "@/components/ui/liquid-button";

const PrimaryButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ size, ...props }, ref) => {
    return <LiquidButton ref={ref} size={size} {...props} />;
  }
);

PrimaryButton.displayName = "PrimaryButton";

export { PrimaryButton };
