"use client";

import * as React from "react";
import { PreviewCard as PreviewCardPrimitive } from "@base-ui-components/react/preview-card";
import { motion, type HTMLMotionProps } from "framer-motion";

import { Slot, type WithAsChild } from "@/registry/primitives/animate/slot";

type PreviewCardProps = React.ComponentProps<typeof PreviewCardPrimitive.Root>;

function PreviewCard(props: PreviewCardProps) {
  return <PreviewCardPrimitive.Root {...props} />;
}

type PreviewCardTriggerProps = WithAsChild<
  Omit<React.ComponentPropsWithoutRef<typeof PreviewCardPrimitive.Trigger>, "render"> &
    HTMLMotionProps<"button">
>;

function PreviewCardTrigger({
  asChild = false,
  children,
  ...props
}: PreviewCardTriggerProps) {
  const Component = asChild ? Slot : motion.button;
  const { ref, ...restProps } = props;

  return (
    <PreviewCardPrimitive.Trigger
      {...restProps}
      render={(triggerProps) => {
        const resolvedProps = asChild
          ? (triggerProps as React.ComponentProps<typeof Slot>)
          : ({
              ...triggerProps,
              type: "button",
            } as React.ComponentProps<typeof motion.button>);
        return <Component {...(resolvedProps as any)}>{children}</Component>;
      }}
    />
  );
}

type PreviewCardPositionerProps = React.ComponentPropsWithoutRef<
  typeof PreviewCardPrimitive.Positioner
>;

function PreviewCardPositioner(props: PreviewCardPositionerProps) {
  return <PreviewCardPrimitive.Positioner {...props} />;
}

type PreviewCardPopupProps = React.ComponentPropsWithoutRef<
  typeof PreviewCardPrimitive.Popup
>;

const PreviewCardPopup = React.forwardRef<HTMLDivElement, PreviewCardPopupProps>(
  ({ children, ...props }, ref) => (
    <PreviewCardPrimitive.Popup ref={ref} {...props}>
      {children}
    </PreviewCardPrimitive.Popup>
  ),
);
PreviewCardPopup.displayName = "PreviewCardPopup";

type PreviewCardPortalProps = React.ComponentPropsWithoutRef<
  typeof PreviewCardPrimitive.Portal
>;

function PreviewCardPortal(props: PreviewCardPortalProps) {
  return <PreviewCardPrimitive.Portal {...props} />;
}

type PreviewCardArrowProps = React.ComponentPropsWithoutRef<
  typeof PreviewCardPrimitive.Arrow
>;

function PreviewCardArrow(props: PreviewCardArrowProps) {
  return <PreviewCardPrimitive.Arrow {...props} />;
}

type PreviewCardBackdropProps = React.ComponentPropsWithoutRef<
  typeof PreviewCardPrimitive.Backdrop
>;

function PreviewCardBackdrop(props: PreviewCardBackdropProps) {
  return <PreviewCardPrimitive.Backdrop {...props} />;
}

export {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardPositioner,
  PreviewCardPopup,
  PreviewCardPortal,
  PreviewCardArrow,
  PreviewCardBackdrop,
  type PreviewCardProps,
  type PreviewCardTriggerProps,
  type PreviewCardPositionerProps,
  type PreviewCardPopupProps,
  type PreviewCardPortalProps,
  type PreviewCardArrowProps,
  type PreviewCardBackdropProps,
};
