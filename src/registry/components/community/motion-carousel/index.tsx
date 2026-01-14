"use client";

import * as React from "react";
import Image from "next/image";
import { motion, type Transition } from "framer-motion";
import type { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

type Slide =
  | number
  | {
      src: string;
      alt: string;
      label?: string;
      className?: string;
    };

type MotionCarouselProps = {
  slides: Slide[];
  options?: EmblaOptionsType;
};

type EmblaControls = {
  selectedIndex: number;
  scrollSnaps: number[];
  prevDisabled: boolean;
  nextDisabled: boolean;
  onDotClick: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

type DotButtonProps = {
  selected?: boolean;
  label: string;
  onClick: () => void;
};

const transition: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 24,
  mass: 1,
};

const useEmblaControls = (
  emblaApi: EmblaCarouselType | undefined,
): EmblaControls => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [prevDisabled, setPrevDisabled] = React.useState(true);
  const [nextDisabled, setNextDisabled] = React.useState(true);

  const onDotClick = React.useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const onPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const onNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const updateSelectionState = (api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
    setPrevDisabled(!api.canScrollPrev());
    setNextDisabled(!api.canScrollNext());
  };

  const onInit = React.useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
    updateSelectionState(api);
  }, []);

  const onSelect = React.useCallback((api: EmblaCarouselType) => {
    updateSelectionState(api);
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    emblaApi.on("reInit", onInit).on("select", onSelect);

    return () => {
      emblaApi.off("reInit", onInit).off("select", onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  };
};

function MotionCarousel({ slides, options }: MotionCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const {
    selectedIndex,
    scrollSnaps,
    prevDisabled,
    nextDisabled,
    onDotClick,
    onPrev,
    onNext,
  } = useEmblaControls(emblaApi);

  if (slides.length === 0) return null;

  const dotLabels = slides.map((slide, index) =>
    typeof slide === "number"
      ? `Slide ${slide + 1}`
      : slide.label ?? `Slide ${index + 1}`,
  );

  return (
    <div className="w-full space-y-4 [--slide-height:9rem] sm:[--slide-height:12rem] lg:[--slide-height:15rem] [--slide-spacing:1.25rem] [--slide-size:70%]">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {slides.map((slide, index) => {
            const isActive = index === selectedIndex;
            const isNumber = typeof slide === "number";
            const slideData = isNumber ? null : slide;

            return (
              <motion.div
                key={isNumber ? slide : slide.src}
                className="mr-[var(--slide-spacing)] flex min-w-0 basis-[var(--slide-size)] flex-none"
              >
                <motion.div
                  className={cn(
                    "relative flex h-[var(--slide-height)] w-full items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-card/90 text-3xl font-semibold shadow-[0_18px_40px_-32px_hsl(var(--primary)/0.4)] md:text-4xl",
                    slideData?.className,
                  )}
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.92,
                  }}
                  transition={transition}
                >
                  {isNumber ? (
                    slide + 1
                  ) : (
                    <>
                      <Image
                        src={slideData.src}
                        alt={slideData.alt}
                        fill
                        sizes="(max-width: 768px) 80vw, 520px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                    </>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button size="icon" variant="outline" onClick={onPrev} disabled={prevDisabled}>
          <ChevronLeft className="size-5" />
        </Button>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              label={dotLabels[index] ?? `Slide ${index + 1}`}
              selected={index === selectedIndex}
              onClick={() => onDotClick(index)}
            />
          ))}
        </div>

        <Button size="icon" variant="outline" onClick={onNext} disabled={nextDisabled}>
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}

function DotButton({ selected = false, label, onClick }: DotButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      initial={false}
      className="flex cursor-pointer select-none items-center justify-center rounded-full border border-transparent bg-primary text-sm text-primary-foreground"
      animate={{
        width: selected ? 68 : 12,
        height: selected ? 28 : 12,
      }}
      transition={transition}
      aria-label={label}
    >
      <motion.span
        layout
        initial={false}
        className="block whitespace-nowrap px-3 py-1"
        animate={{
          opacity: selected ? 1 : 0,
          scale: selected ? 1 : 0,
          filter: selected ? "blur(0)" : "blur(4px)",
        }}
        transition={transition}
      >
        {label}
      </motion.span>
    </motion.button>
  );
}

export { MotionCarousel, type MotionCarouselProps, type Slide };
