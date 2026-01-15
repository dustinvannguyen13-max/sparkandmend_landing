"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type SpringOptions,
} from "framer-motion";

import { cn } from "@/utils";

type BubbleColors = {
  first: string;
  second: string;
  third: string;
  fourth: string;
  fifth: string;
  sixth: string;
};

type BubbleBackgroundProps = React.ComponentProps<"div"> & {
  interactive?: boolean;
  transition?: SpringOptions;
  colors?: BubbleColors;
};

const DEFAULT_COLORS: BubbleColors = {
  first: "9,72,79",
  second: "114,75,75",
  third: "240,230,218",
  fourth: "96,156,160",
  fifth: "200,176,160",
  sixth: "250,242,232",
};

const BubbleBackground = React.forwardRef<HTMLDivElement, BubbleBackgroundProps>(
  (
    {
      className,
      children,
      interactive = false,
      transition = { stiffness: 100, damping: 20 },
      colors = DEFAULT_COLORS,
      style,
      ...props
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, transition);
    const springY = useSpring(mouseY, transition);

    const rectRef = React.useRef<DOMRect | null>(null);
    const rafIdRef = React.useRef<number | null>(null);

    React.useLayoutEffect(() => {
      const updateRect = () => {
        if (containerRef.current) {
          rectRef.current = containerRef.current.getBoundingClientRect();
        }
      };

      updateRect();

      const el = containerRef.current;
      const ro = new ResizeObserver(updateRect);
      if (el) ro.observe(el);

      window.addEventListener("resize", updateRect);
      window.addEventListener("scroll", updateRect, { passive: true });

      return () => {
        ro.disconnect();
        window.removeEventListener("resize", updateRect);
        window.removeEventListener("scroll", updateRect);
      };
    }, []);

    React.useEffect(() => {
      if (!interactive) return;

      const el = containerRef.current;
      if (!el) return;

      const handleMouseMove = (event: MouseEvent) => {
        const rect = rectRef.current;
        if (!rect) return;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(() => {
          mouseX.set(event.clientX - centerX);
          mouseY.set(event.clientY - centerY);
        });
      };

      el.addEventListener("mousemove", handleMouseMove as EventListener, {
        passive: true,
      });
      return () => {
        el.removeEventListener("mousemove", handleMouseMove as EventListener);
        if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      };
    }, [interactive, mouseX, mouseY]);

    return (
      <div
        ref={containerRef}
        data-slot="bubble-background"
        className={cn(
          "relative size-full overflow-hidden",
          interactive ? "pointer-events-auto" : "pointer-events-none",
          className,
        )}
        style={{
          ...(style ?? {}),
          ["--first-color" as string]: colors.first,
          ["--second-color" as string]: colors.second,
          ["--third-color" as string]: colors.third,
          ["--fourth-color" as string]: colors.fourth,
          ["--fifth-color" as string]: colors.fifth,
          ["--sixth-color" as string]: colors.sixth,
        }}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-0 top-0 h-0 w-0"
        >
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>

        <div
          className="absolute inset-0"
          style={{ filter: "url(#goo) blur(40px)" }}
        >
          <motion.div
            className="absolute left-[10%] top-[10%] size-[80%] rounded-full mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--first-color),0.95)_0%,rgba(var(--first-color),0)_55%)]"
            animate={{ y: [-50, 50, -50] }}
            transition={{ duration: 30, ease: "easeInOut", repeat: Infinity }}
            style={{ transform: "translateZ(0)", willChange: "transform" }}
          />

          <motion.div
            className="absolute inset-0 flex items-center justify-center origin-[calc(50%-400px)]"
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
            style={{ transform: "translateZ(0)", willChange: "transform" }}
          >
            <div className="size-[80%] rounded-full mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--second-color),0.95)_0%,rgba(var(--second-color),0)_55%)]" />
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center origin-[calc(50%+400px)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
            style={{ transform: "translateZ(0)", willChange: "transform" }}
          >
            <div className="absolute left-[calc(50%-500px)] top-[calc(50%+200px)] size-[80%] rounded-full mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--third-color),0.95)_0%,rgba(var(--third-color),0)_55%)]" />
          </motion.div>

          <motion.div
            className="absolute left-[10%] top-[10%] size-[80%] rounded-full mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--fourth-color),0.85)_0%,rgba(var(--fourth-color),0)_55%)] opacity-90"
            animate={{ x: [-50, 50, -50] }}
            transition={{ duration: 40, ease: "easeInOut", repeat: Infinity }}
            style={{ transform: "translateZ(0)", willChange: "transform" }}
          />

          <motion.div
            className="absolute inset-0 flex items-center justify-center origin-[calc(50%_-_800px)_calc(50%_+_200px)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
            style={{ transform: "translateZ(0)", willChange: "transform" }}
          >
            <div className="absolute left-[calc(50%-80%)] top-[calc(50%-80%)] size-[160%] rounded-full mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--fifth-color),0.85)_0%,rgba(var(--fifth-color),0)_55%)]" />
          </motion.div>

          {interactive ? (
            <motion.div
              className="absolute size-full rounded-full mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--sixth-color),0.85)_0%,rgba(var(--sixth-color),0)_55%)] opacity-90"
              style={{
                x: springX,
                y: springY,
                transform: "translateZ(0)",
                willChange: "transform",
              }}
            />
          ) : null}
        </div>

        {children}
      </div>
    );
  },
);

BubbleBackground.displayName = "BubbleBackground";

export { BubbleBackground, type BubbleBackgroundProps, type BubbleColors };
