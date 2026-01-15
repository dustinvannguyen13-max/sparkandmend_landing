"use client";

import * as React from "react";

import {
  PreviewCard as PreviewCardPrimitive,
  PreviewCardTrigger as PreviewCardTriggerPrimitive,
  PreviewCardPositioner as PreviewCardPositionerPrimitive,
  PreviewCardPopup as PreviewCardPopupPrimitive,
  PreviewCardPortal as PreviewCardPortalPrimitive,
  PreviewCardArrow as PreviewCardArrowPrimitive,
  PreviewCardBackdrop as PreviewCardBackdropPrimitive,
  type PreviewCardProps as PreviewCardPrimitiveProps,
  type PreviewCardTriggerProps as PreviewCardTriggerPrimitiveProps,
  type PreviewCardPositionerProps as PreviewCardPositionerPrimitiveProps,
  type PreviewCardPopupProps as PreviewCardPopupPrimitiveProps,
  type PreviewCardArrowProps as PreviewCardArrowPrimitiveProps,
  type PreviewCardBackdropProps as PreviewCardBackdropPrimitiveProps,
} from "@/registry/primitives/base/preview-card";
import { cn } from "@/utils";

type PreviewCardProps = PreviewCardPrimitiveProps;

function PreviewCard(props: PreviewCardProps) {
  return <PreviewCardPrimitive {...props} />;
}

type PreviewCardTriggerProps = PreviewCardTriggerPrimitiveProps;

function PreviewCardTrigger(props: PreviewCardTriggerProps) {
  return <PreviewCardTriggerPrimitive {...props} />;
}

type PreviewCardPositionerProps = PreviewCardPositionerPrimitiveProps;

function PreviewCardPositioner(props: PreviewCardPositionerProps) {
  return <PreviewCardPositionerPrimitive {...props} />;
}

type PreviewCardPopupProps = PreviewCardPopupPrimitiveProps;

function PreviewCardPopup({ className, ...props }: PreviewCardPopupProps) {
  return (
    <PreviewCardPopupPrimitive
      className={cn(
        "z-50 w-72 rounded-2xl border border-border/70 bg-popover/95 p-4 text-sm text-popover-foreground shadow-[0_22px_60px_-35px_hsl(var(--primary)/0.35)] backdrop-blur transition duration-200 data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95 data-[closed]:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

type PreviewCardPortalProps = React.ComponentPropsWithoutRef<
  typeof PreviewCardPortalPrimitive
>;

function PreviewCardPortal(props: PreviewCardPortalProps) {
  return <PreviewCardPortalPrimitive {...props} />;
}

type PreviewCardPanelProps = PreviewCardPopupProps & {
  align?: PreviewCardPositionerProps["align"];
  side?: PreviewCardPositionerProps["side"];
  sideOffset?: PreviewCardPositionerProps["sideOffset"];
  alignOffset?: PreviewCardPositionerProps["alignOffset"];
};

const PreviewCardPanel = React.forwardRef<HTMLDivElement, PreviewCardPanelProps>(
  ({ align, side, sideOffset = 8, alignOffset, className, children, ...props }, ref) => (
    <PreviewCardPortal>
      <PreviewCardPositioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
      >
        <PreviewCardPopup ref={ref} className={className} {...props}>
          {children}
        </PreviewCardPopup>
      </PreviewCardPositioner>
    </PreviewCardPortal>
  ),
);
PreviewCardPanel.displayName = "PreviewCardPanel";

type PreviewCardArrowProps = PreviewCardArrowPrimitiveProps;

function PreviewCardArrow({ className, ...props }: PreviewCardArrowProps) {
  return (
    <PreviewCardArrowPrimitive
      className={cn("bg-popover border border-border/60", className)}
      {...props}
    />
  );
}

type PreviewCardBackdropProps = PreviewCardBackdropPrimitiveProps;

function PreviewCardBackdrop(props: PreviewCardBackdropProps) {
  return <PreviewCardBackdropPrimitive {...props} />;
}

export {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardPositioner,
  PreviewCardPopup,
  PreviewCardPortal,
  PreviewCardPanel,
  PreviewCardArrow,
  PreviewCardBackdrop,
  type PreviewCardProps,
  type PreviewCardTriggerProps,
  type PreviewCardPositionerProps,
  type PreviewCardPopupProps,
  type PreviewCardPortalProps,
  type PreviewCardPanelProps,
  type PreviewCardArrowProps,
  type PreviewCardBackdropProps,
};
