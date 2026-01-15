"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type ShimmeringTextProps = Omit<HTMLMotionProps<"span">, "children"> & {
  text: string;
  duration?: number;
  wave?: boolean;
  color?: string;
  shimmeringColor?: string;
};

function ShimmeringText({
  text,
  duration = 1,
  transition,
  wave = false,
  color = "var(--color-neutral-500)",
  shimmeringColor = "var(--color-neutral-300)",
  ...props
}: ShimmeringTextProps) {
  const words = text?.split(" ") ?? [];
  let charIndex = 0;
  const totalChars = text?.length ?? 0;

  return (
    <motion.span
      style={
        {
          "--shimmering-color": shimmeringColor,
          "--color": color,
          color: "var(--color)",
          position: "relative",
          display: "inline-block",
          perspective: "500px",
        } as React.CSSProperties
      }
      {...props}
    >
      {words.map((word, wordIndex) => {
        const isLast = wordIndex === words.length - 1;
        const wordChars = word.split("").map((char) => {
          const currentIndex = charIndex;
          charIndex += 1;

          return (
            <motion.span
              key={`${char}-${currentIndex}`}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                transformStyle: "preserve-3d",
              }}
              initial={{
                ...(wave
                  ? {
                      scale: 1,
                      rotateY: 0,
                    }
                  : {}),
                color: "var(--color)",
              }}
              animate={{
                ...(wave
                  ? {
                      x: [0, 5, 0],
                      y: [0, -5, 0],
                      scale: [1, 1.1, 1],
                      rotateY: [0, 15, 0],
                    }
                  : {}),
                color: [
                  "var(--color)",
                  "var(--shimmering-color)",
                  "var(--color)",
                ],
              }}
              transition={{
                duration,
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: totalChars * 0.05,
                delay: totalChars
                  ? (currentIndex * duration) / totalChars
                  : 0,
                ease: "easeInOut",
                ...transition,
              }}
            >
              {char}
            </motion.span>
          );
        });

        if (!isLast) {
          charIndex += 1;
        }

        return (
          <React.Fragment key={`${word}-${wordIndex}`}>
            <span style={{ display: "inline-flex", whiteSpace: "nowrap" }}>
              {wordChars}
            </span>
            {!isLast ? " " : null}
          </React.Fragment>
        );
      })}
    </motion.span>
  );
}

export { ShimmeringText, type ShimmeringTextProps };
