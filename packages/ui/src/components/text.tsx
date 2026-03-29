import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const textVariants = cva("text-pretty", {
  variants: {
    variant: {
      display:
        "font-sans text-[length:var(--text-display)] leading-[var(--leading-display)] tracking-[var(--tracking-display)] font-semibold",
      h1: "font-sans text-[length:var(--text-h1)] leading-[var(--leading-h1)] tracking-[var(--tracking-tight)] font-semibold",
      h2: "font-sans text-[length:var(--text-h2)] leading-[var(--leading-h2)] tracking-[var(--tracking-tight)] font-semibold",
      h3: "font-sans text-[length:var(--text-h3)] leading-[var(--leading-h3)] tracking-[var(--tracking-tight)] font-semibold",
      body: "font-sans text-[length:var(--text-body)] leading-[var(--leading-body)] text-foreground/88",
      lead: "font-sans text-[length:var(--text-lead)] leading-[var(--leading-lead)] text-foreground/78",
      muted: "font-sans text-[length:var(--text-body-sm)] leading-[var(--leading-body)] text-muted-foreground",
      label:
        "font-sans text-[length:var(--text-label)] leading-none tracking-[0.22em] uppercase text-muted-foreground",
    },
    tone: {
      default: "",
      foreground: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      inverse: "text-primary-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
    tone: "default",
  },
});

type TextProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
} & VariantProps<typeof textVariants> &
  Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">;

function Text<T extends React.ElementType = "p">({
  as,
  className,
  variant,
  tone,
  ...props
}: TextProps<T>) {
  const Comp = as ?? "p";

  return <Comp className={cn(textVariants({ variant, tone, className }))} {...props} />;
}

export { Text, textVariants };
