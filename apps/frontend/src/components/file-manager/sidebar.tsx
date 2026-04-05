"use client";

import { Clock3, FolderOpen, Pin, ShieldCheck, Trash2 } from "lucide-react";
import { Text } from "@nera/ui";
import { SidebarItem } from "./sidebar-item";

type SidebarProps = {
  onOpenRoot: () => void;
};

export function Sidebar({ onOpenRoot }: SidebarProps) {
  return (
    <aside className="border-r border-border/50 px-5 py-6">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-full border border-primary/30 bg-primary/10 px-3 py-3 text-primary">
            <ShieldCheck className="ui-icon-sm" />
          </div>
          <Text as="h1" variant="h3" tone="foreground">
            Nera Drive
          </Text>
        </div>

        <nav className="flex flex-col gap-1">
          <SidebarItem icon={FolderOpen} label="My Files" active onClick={onOpenRoot} />
          <SidebarItem icon={Clock3} label="Recent" />
          <SidebarItem icon={Pin} label="Pinned" />
          <SidebarItem icon={Trash2} label="Trash" />
        </nav>
      </div>
    </aside>
  );
}
