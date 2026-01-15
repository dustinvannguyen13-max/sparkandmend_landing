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
  nativeButton,
  ...props
}: PreviewCardTriggerProps) {
  const Component = asChild ? Slot : motion.button;
  const isButtonChild =
    React.isValidElement(children) &&
    typeof children.type === "string" &&
    children.type === "button";
  const resolvedNativeButton =
    nativeButton ?? (asChild ? isButtonChild : true);

  return (
    <PreviewCardPrimitive.Trigger
      nativeButton={resolvedNativeButton}
      {...props}
      render={(triggerProps) => {
        const resolvedProps = asChild
          ? triggerProps
          : { ...triggerProps, type: "button" };
        return <Component {...resolvedProps}>{children}</Component>;
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

function PreviewCardPopup({ children, ...props }: PreviewCardPopupProps) {
  return (
    <PreviewCardPrimitive.Popup {...props}>
      {children}
    </PreviewCardPrimitive.Popup>
  );
}

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
