"use client";

import * as React from "react";
import { cn } from "../lib/utils";

type InputProps = React.ComponentProps<"input">;

function Input({ className, ...props }: InputProps) {
  return <input className={cn("ui-field", className)} {...props} />;
}

export { Input };
