import * as React from "react";

import { cn } from "@/utils";

interface AnimateIconProps {
  children: React.ReactElement;
  className?: string;
  animateOnHover?: boolean;
}

const AnimateIcon = ({
  children,
  className,
  animateOnHover = true,
}: AnimateIconProps) => {
  const child = React.cloneElement(children, {
    className: cn(
      children.props.className,
      animateOnHover &&
        "transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:rotate-6 hover:-translate-y-0.5 hover:rotate-6 motion-reduce:transition-none motion-reduce:transform-none",
    ),
  });

  return (
    <span className={cn("inline-flex items-center", animateOnHover && "group", className)}>
      {child}
    </span>
  );
};

export { AnimateIcon };
