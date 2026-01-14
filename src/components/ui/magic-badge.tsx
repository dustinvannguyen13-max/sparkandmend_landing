import React from 'react'

interface Props {
    title: string;
}

const MagicBadge = ({ title }: Props) => {
    return (
        <div className="inline-flex items-center rounded-full border border-border/70 bg-background/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-secondary shadow-[0_10px_30px_-24px_hsl(var(--secondary)/0.35)]">
            {title}
        </div>
    )
};

export default MagicBadge
