"use client";

import type { LucideIcon } from "lucide-react";

type SidebarItemProps = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export function SidebarItem({ icon: Icon, label, active = false, onClick }: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150",
        active
          ? "bg-primary/12 font-medium text-primary"
          : "text-muted-foreground hover:bg-accent/30 hover:text-foreground",
      ].join(" ")}
    >
      <Icon className="ui-icon-sm" />
      <span>{label}</span>
    </button>
  );
}
