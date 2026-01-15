"use client";

import * as React from "react";
import { useInView, type UseInViewOptions } from "framer-motion";

interface UseIsInViewOptions {
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: UseInViewOptions["margin"];
}

export interface UseIsInViewResult<T extends HTMLElement> {
  ref: React.MutableRefObject<T | null>;
  isInView: boolean;
}

function useIsInView<T extends HTMLElement = HTMLElement>(
  ref: React.Ref<T>,
  options: UseIsInViewOptions = {},
): UseIsInViewResult<T> {
  const { inView, inViewOnce = false, inViewMargin = "0px" } = options;
  const localRef = React.useRef<T>(null);
  React.useImperativeHandle(ref, () => localRef.current as T);
  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;
  return { ref: localRef, isInView };
}

export { useIsInView };
export type { UseIsInViewOptions };
