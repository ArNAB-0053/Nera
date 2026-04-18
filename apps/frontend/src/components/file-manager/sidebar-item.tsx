"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarItemProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  collapsed?: boolean;
  active?: boolean;
};

export function SidebarItem({
  href,
  icon: Icon,
  label,
  collapsed = false,
  active = false,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      aria-label={label}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-colors duration-150",
        collapsed && "justify-center px-0",
        active
          ? "bg-primary/12 font-medium text-primary"
          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed ? <span>{label}</span> : <span className="sr-only">{label}</span>}
    </Link>
  );
}
