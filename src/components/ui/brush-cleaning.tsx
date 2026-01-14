import * as React from "react";
import { Paintbrush } from "lucide-react";

import { AnimateIcon } from "@/components/ui/animate-icon";
import { cn } from "@/utils";

type BrushCleaningProps = React.ComponentProps<typeof Paintbrush> & {
  animateOnHover?: boolean;
};

const BrushCleaning = ({
  animateOnHover = false,
  className,
  ...props
}: BrushCleaningProps) => {
  const icon = (
    <Paintbrush className={cn("size-4", className)} {...props} />
  );

  if (animateOnHover) {
    return <AnimateIcon animateOnHover>{icon}</AnimateIcon>;
  }

  return icon;
};

export { BrushCleaning };
