"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

type DropdownContextValue = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const context = React.useContext(DropdownContext);

  if (!context) {
    throw new Error("Dropdown components must be used within Dropdown.");
  }

  return context;
}

type DropdownProps = {
  children: React.ReactNode;
};

function Dropdown({ children }: DropdownProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="ui-dropdown">{children}</div>
    </DropdownContext.Provider>
  );
}

type DropdownTriggerProps = React.ComponentProps<"button"> & {
  label?: string;
  showChevron?: boolean;
  variant?: "normal" | "avatar"
};

function DropdownTrigger({
  variant,
  children,
  className,
  label,
  showChevron = true,
  ...props
}: DropdownTriggerProps) {
  const { open, setOpen } = useDropdownContext();

  return (
    <button
      type="button"
      className={cn(variant === "avatar" ? "" : "ui-dropdown-trigger", className)}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children ?? <span>{label}</span>}
      {showChevron ? <ChevronDown className="ui-icon-sm" /> : null}
    </button>
  );
}

type DropdownContentProps = React.ComponentProps<"div">;

function DropdownContent({ className, ...props }: DropdownContentProps) {
  const { open, setOpen } = useDropdownContext();
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointer = (event: MouseEvent) => {
      if (!contentRef.current) {
        return;
      }

      if (!contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, [open, setOpen]);

  if (!open) {
    return null;
  }

  return <div ref={contentRef} className={cn("ui-dropdown-content", className)} {...props} />;
}

type DropdownItemProps = React.ComponentProps<"button"> & {
  active?: boolean;
  needCheck?: boolean;
};

function DropdownItem({ className, needCheck = true, active, children, ...props }: DropdownItemProps) {
  return (
    <button type="button" className={cn("ui-dropdown-item", className)} {...props}>
      <>{children}</>
      {needCheck ? (active ? <Check className="ui-icon-sm text-primary" /> : <span className="ui-icon-sm" />) : null}
    </button>
  );
}

export { Dropdown, DropdownContent, DropdownItem, DropdownTrigger };
