import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const surfaceVariants = cva(
  "relative isolate overflow-hidden rounded-[var(--radius-panel)] border border-border/70 backdrop-blur-[18px] transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        elevated:
          "bg-surface-elevated text-card-foreground shadow-[0_24px_80px_-48px_rgba(12,32,82,0.35)]",
        soft: "bg-surface text-card-foreground",
        contrast: "bg-primary text-primary-foreground border-primary/20",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

type SurfaceProps = React.ComponentProps<"div"> &
  VariantProps<typeof surfaceVariants>;

function Surface({ className, variant, padding, ...props }: SurfaceProps) {
  return (
    <div
      className={cn(surfaceVariants({ variant, padding, className }))}
      {...props}
    />
  );
}

export { Surface, surfaceVariants };
