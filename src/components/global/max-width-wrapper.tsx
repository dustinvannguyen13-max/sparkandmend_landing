import { cn } from "@/utils";
import React from 'react';

interface Props {
    className?: string;
    children: React.ReactNode;
}

const MaxWidthWrapper = ({ className, children }: Props) => {
    return (
        <section
            className={cn(
                "h-full mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10",
                className,
            )}
        >
            {children}
        </section>
    )
};

export default MaxWidthWrapper
