"use client";

import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/utils";
import {
    Building2Icon,
    CalendarDaysIcon,
    ClipboardListIcon,
    HomeIcon,
    ShieldCheckIcon,
    SparklesIcon,
    SprayCanIcon,
} from "lucide-react";
import React, { forwardRef, useRef } from "react";

const Circle = forwardRef<
    HTMLDivElement,
    { className?: string; children?: React.ReactNode }
>(function Circle({ className, children }, ref) {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-card p-3 shadow-[0_0_20px_-12px_rgba(113,75,75,0.35)]",
                className,
            )}
        >
            {children}
        </div>
    );
});

export function Integrations({
    className,
}: {
    className?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const div1Ref = useRef<HTMLDivElement>(null);
    const div2Ref = useRef<HTMLDivElement>(null);
    const div3Ref = useRef<HTMLDivElement>(null);
    const div4Ref = useRef<HTMLDivElement>(null);
    const div5Ref = useRef<HTMLDivElement>(null);
    const div6Ref = useRef<HTMLDivElement>(null);
    const div7Ref = useRef<HTMLDivElement>(null);

    return (
        <div
            className={cn(
                "relative flex w-full max-w-[500px] items-center justify-center overflow-hidden rounded-lg border bg-background p-10 md:shadow-xl",
                className,
            )}
            ref={containerRef}
        >
            <div className="flex h-full w-full flex-row items-stretch justify-between gap-10">
                <div className="flex flex-col justify-center">
                    <Circle ref={div7Ref}>
                        <HomeIcon className="h-6 w-6 text-primary" />
                    </Circle>
                </div>
                <div className="flex flex-col justify-center">
                    <Circle ref={div6Ref} className="h-16 w-16">
                        <SparklesIcon className="h-7 w-7 text-primary" />
                    </Circle>
                </div>
                <div className="flex flex-col justify-center gap-2">
                    <Circle ref={div1Ref}>
                        <SprayCanIcon className="h-6 w-6 text-foreground" />
                    </Circle>
                    <Circle ref={div2Ref}>
                        <ClipboardListIcon className="h-6 w-6 text-foreground" />
                    </Circle>
                    <Circle ref={div3Ref}>
                        <CalendarDaysIcon className="h-6 w-6 text-foreground" />
                    </Circle>
                    <Circle ref={div4Ref}>
                        <ShieldCheckIcon className="h-6 w-6 text-foreground" />
                    </Circle>
                    <Circle ref={div5Ref}>
                        <Building2Icon className="h-6 w-6 text-foreground" />
                    </Circle>
                </div>
            </div>

            {/* AnimatedBeams */}
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div6Ref}
                duration={3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div2Ref}
                toRef={div6Ref}
                duration={3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div3Ref}
                toRef={div6Ref}
                duration={3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div4Ref}
                toRef={div6Ref}
                duration={3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div5Ref}
                toRef={div6Ref}
                duration={3}
            />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div6Ref}
                toRef={div7Ref}
                duration={3}
            />
        </div>
    );
}
