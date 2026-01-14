import { cn } from "@/utils";
import React from "react";

interface Props {
    children: React.ReactNode;
    className?: string;
}

const MagicCard = ({ children, className }: Props) => {
    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-4 shadow-[0_24px_60px_-42px_hsl(var(--primary)/0.35)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_28px_70px_-42px_hsl(var(--primary)/0.4)]",
                className
            )}
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,hsl(var(--primary)/0.08),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {children}
        </div>
    );
};

export default MagicCard;
