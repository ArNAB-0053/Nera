"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

type SelectProps = React.ComponentProps<"select">;

function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="ui-select-shell">
      <select className={cn("ui-select", className)} {...props}>
        {children}
      </select>
      <ChevronDown className="ui-icon-sm ui-select-icon" />
    </div>
  );
}

export { Select };
