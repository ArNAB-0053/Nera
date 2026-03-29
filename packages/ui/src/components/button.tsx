"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-pill)] border px-5 text-sm font-semibold shadow-[0_16px_36px_-24px_rgba(15,23,42,0.42)] transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-primary/90 bg-primary text-primary-foreground shadow-[0_18px_46px_-24px_color-mix(in_oklab,var(--primary)_65%,transparent)] hover:-translate-y-0.5 hover:bg-primary/92",
        secondary:
          "border-border/80 bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:bg-secondary/82",
        outline:
          "border-border/80 bg-background/78 text-foreground backdrop-blur-sm hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent/78 hover:text-accent-foreground",
        ghost:
          "border-transparent bg-transparent text-foreground shadow-none hover:bg-accent hover:text-accent-foreground",
        hero: "border-primary/90 bg-primary text-primary-foreground shadow-[0_24px_60px_-28px_color-mix(in_oklab,var(--primary)_78%,transparent)] hover:-translate-y-1 hover:bg-primary/92",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
