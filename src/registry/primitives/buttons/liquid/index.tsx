"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

import { Slot, type WithAsChild } from "@/registry/primitives/animate/slot";

type LiquidButtonProps = WithAsChild<
  HTMLMotionProps<"button"> & {
    delay?: string;
    fillHeight?: string;
    hoverScale?: number;
    tapScale?: number;
  }
>;

function LiquidButton({
  delay = "0.3s",
  fillHeight = "3px",
  hoverScale = 1.05,
  tapScale = 0.95,
  asChild = false,
  ...props
}: LiquidButtonProps) {
  const Component = asChild ? Slot : motion.button;
  const isTouchRef = React.useRef(false);

  const resetTouchStyles = React.useCallback(
    (target: HTMLElement) => {
      target.style.setProperty("--liquid-button-fill-width", "-1%");
      target.style.setProperty("--liquid-button-fill-height", fillHeight);
      target.style.setProperty("--liquid-button-delay", "0s");
      target.style.setProperty(
        "--liquid-button-text-color",
        "var(--liquid-button-text-rest-color, currentColor)",
      );
      isTouchRef.current = false;
    },
    [fillHeight],
  );

  const {
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onBlur,
    ref,
    ...restProps
  } = props;

  return (
    <Component
      onPointerDown={(event: React.PointerEvent<HTMLButtonElement>) => {
        if (event.pointerType === "touch" || event.pointerType === "pen") {
          isTouchRef.current = true;
        }
        onPointerDown?.(event);
      }}
      onPointerUp={(event: React.PointerEvent<HTMLButtonElement>) => {
        onPointerUp?.(event);
        if (isTouchRef.current) {
          resetTouchStyles(event.currentTarget);
        }
      }}
      onPointerCancel={(event: React.PointerEvent<HTMLButtonElement>) => {
        onPointerCancel?.(event);
        if (isTouchRef.current) {
          resetTouchStyles(event.currentTarget);
        }
      }}
      onBlur={(event: React.FocusEvent<HTMLButtonElement>) => {
        onBlur?.(event);
        if (isTouchRef.current) {
          resetTouchStyles(event.currentTarget);
        }
      }}
      whileTap={{
        scale: tapScale,
        "--liquid-button-fill-width": "100%",
        "--liquid-button-fill-height": "100%",
        "--liquid-button-delay": "0s",
        "--liquid-button-text-color":
          "var(--liquid-button-text-hover-color, currentColor)",
      }}
      whileHover={{
        scale: hoverScale,
        "--liquid-button-fill-width": "100%",
        "--liquid-button-fill-height": "100%",
        "--liquid-button-delay": delay,
        "--liquid-button-text-color":
          "var(--liquid-button-text-hover-color, currentColor)",
        transition: {
          "--liquid-button-fill-width": { duration: 0 },
          "--liquid-button-fill-height": { duration: 0 },
          "--liquid-button-delay": { duration: 0 },
          "--liquid-button-text-color": { duration: 0 },
        },
      }}
      style={
        {
          "--liquid-button-fill-width": "-1%",
          "--liquid-button-fill-height": fillHeight,
          "--liquid-button-delay": "0s",
          "--liquid-button-text-color":
            "var(--liquid-button-text-rest-color, currentColor)",
          background:
            "linear-gradient(var(--liquid-button-color) 0 0) no-repeat calc(200% - var(--liquid-button-fill-width, -1%)) 100% / 200% var(--liquid-button-fill-height, 0.2em)",
          backgroundColor: "var(--liquid-button-background-color)",
          transition: `background ${delay} var(--liquid-button-delay, 0s), color ${delay} ${delay}, background-position ${delay} calc(${delay} - var(--liquid-button-delay, 0s))`,
          color: "var(--liquid-button-text-color, currentColor)",
        } as React.CSSProperties
      }
      {...(restProps as any)}
    />
  );
}

export { LiquidButton, type LiquidButtonProps };
