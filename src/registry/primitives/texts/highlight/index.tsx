"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

import {
  useIsInView,
  type UseIsInViewOptions,
} from "@/registry/hooks/use-is-in-view";

type HighlightTextProps = Omit<HTMLMotionProps<"span">, "children"> & {
  text: string;
  gradient?: string;
  delay?: number;
} & UseIsInViewOptions;

const DEFAULT_GRADIENT =
  "linear-gradient(90deg, rgba(9, 72, 79, 0.25) 0%, rgba(114, 75, 75, 0.25) 55%, rgba(9, 72, 79, 0.25) 100%)";

function HighlightText({
  ref,
  text,
  style,
  gradient = DEFAULT_GRADIENT,
  inView = false,
  inViewMargin = "0px",
  inViewOnce = true,
  transition = { duration: 2, ease: "easeInOut" },
  delay = 0,
  ...props
}: HighlightTextProps) {
  const { ref: localRef, isInView } = useIsInView(
    ref as React.Ref<HTMLElement>,
    {
      inView,
      inViewOnce,
      inViewMargin,
    },
  );

  return (
    <motion.span
      ref={localRef}
      data-slot="highlight-text"
      initial={{ backgroundSize: "0% 100%" }}
      animate={isInView ? { backgroundSize: "100% 100%" } : undefined}
      transition={{
        ...transition,
        delay: (transition?.delay ?? 0) + delay / 1000,
      }}
      style={{
        position: "relative",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        backgroundImage: gradient,
        display: "inline-block",
        ...style,
      }}
      {...props}
    >
      {text}
    </motion.span>
  );
}

export { HighlightText, type HighlightTextProps };
