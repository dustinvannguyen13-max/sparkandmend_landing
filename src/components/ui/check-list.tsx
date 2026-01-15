"use client";

import * as React from "react";

import { cn } from "@/utils";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { Check } from "@/registry/icons/check";

type CheckListItemProps = React.LiHTMLAttributes<HTMLLIElement> & {
  iconClassName?: string;
  contentClassName?: string;
};

const CheckListItem = ({
  className,
  iconClassName,
  contentClassName,
  children,
  ...props
}: CheckListItemProps) => (
  <li className={cn("flex items-start gap-2", className)} {...props}>
    <AnimateIcon animateOnHover>
      <Check className={cn("mt-0.5 size-4 text-primary", iconClassName)} />
    </AnimateIcon>
    <span className={cn("flex-1", contentClassName)}>{children}</span>
  </li>
);

export { CheckListItem, type CheckListItemProps };
