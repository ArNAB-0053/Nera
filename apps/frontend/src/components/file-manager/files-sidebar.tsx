"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Text } from "@nera/ui";
import { ChevronLeft, ChevronRight, Clock3, FolderOpen, Pin, ShieldCheck, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item";

type FilesSidebarProps = {
  state: "expanded" | "collapsed";
};

const items = [
  { href: "/my-files", label: "My Files", icon: FolderOpen },
  { href: "/recent", label: "Recent", icon: Clock3 },
  { href: "/pinned", label: "Pinned", icon: Pin },
  { href: "/trash", label: "Trash", icon: Trash2 },
];

export function FilesSidebar({ state}: FilesSidebarProps) {
  const pathname = usePathname();
  const collapsed = state === "collapsed";

  return (
    <div className="flex min-h-screen w-full flex-col justify-between px-3 py-4">
      <div className="space-y-6">
        <div className={cn("flex items-center gap-3 px-2", collapsed && "justify-center px-0")}>
          <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <Text as="p" variant="label">
                Nera
              </Text>
              <Text as="p" className="truncate font-semibold text-foreground">
                File Explorer
              </Text>
            </div>
          ) : null}
        </div>

        <div className="space-y-2">
          <nav className="space-y-1">
            {items.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                collapsed={collapsed}
                active={pathname === item.href}
              />
            ))}
          </nav>
        </div>
      </div>

      {!collapsed ? (
        <div className="rounded-2xl border border-border/70 bg-background/55 px-3 py-3">
          <Text as="p" variant="muted">
            Minimal navigation, shared layout, full-width workspace.
          </Text>
        </div>
      ) : (
        <Link
          href="/my-files"
          title="Back to My Files"
          className="mx-auto flex size-10 items-center justify-center rounded-xl border border-border/70 bg-background/55 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <FolderOpen className="size-4" />
        </Link>
      )}
    </div>
  );
}
