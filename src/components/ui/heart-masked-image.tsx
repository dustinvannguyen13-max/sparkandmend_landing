"use client";

import Image from "next/image";

import { cn } from "@/utils";

const maskStyles: React.CSSProperties = {
  WebkitMaskImage: "url(/heart-mask.svg)",
  maskImage: "url(/heart-mask.svg)",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskPosition: "center",
  maskPosition: "center",
};

type HeartMaskedImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizeClassName?: string;
  imageClassName?: string;
};

const HeartMaskedImage = ({
  src,
  alt,
  className,
  sizeClassName,
  imageClassName,
}: HeartMaskedImageProps) => {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className={cn("relative isolate w-full max-w-[380px]", sizeClassName)}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 translate-x-6 -translate-y-4 bg-[radial-gradient(60%_60%_at_45%_40%,hsl(var(--secondary)/0.8),transparent_70%)] opacity-95"
          style={maskStyles}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] -translate-x-6 translate-y-4 bg-[radial-gradient(60%_60%_at_55%_60%,hsl(var(--primary)/0.75),transparent_70%)] opacity-95"
          style={maskStyles}
        />
        <div
          className="relative z-10 aspect-[10/11] w-full"
          style={{
            ...maskStyles,
            filter: "drop-shadow(0 28px 60px hsl(var(--primary) / 0.35))",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 38vw, (min-width: 768px) 50vw, 100vw"
            className={cn("object-cover", imageClassName)}
            style={maskStyles}
          />
        </div>
      </div>
    </div>
  );
};

export { HeartMaskedImage };
