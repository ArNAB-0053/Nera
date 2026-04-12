"use client";

import { usePathname } from "next/navigation";
import { Text, Tooltip, TooltipContent, TooltipTrigger } from "@nera/ui";
import { Clock3, FolderOpen, HardDrive, Pin, ShieldCheck, Trash2 } from "lucide-react";
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

export function FilesSidebar({ state }: FilesSidebarProps) {
  const pathname = usePathname();
  const collapsed = state === "collapsed";
  const storageUsage = 40;

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
        <div className="space-y-3">
          <div>
            <Text as="p" variant="label">
              Storage
            </Text>
            <Text as="p" variant="body" tone="foreground" className="font-medium">
              Workspace usage
            </Text>
          </div>

          <div className="file-storage-progress">
            <div className="file-storage-progress-bar" style={{ width: `${storageUsage}%` }} />
          </div>

          <Text as="p" variant="muted">
            2.1 GB of 5 GB used
          </Text>

          <Text as="p" variant="muted" className="text-xs">
            <strong>Note:</strong> Just for UI
          </Text>
        </div>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Storage usage details"
              className="mx-auto flex size-10 items-center justify-center rounded-xl border border-border/70 bg-background/55 text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-accent/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <HardDrive className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="w-64 p-4">
            <div className="space-y-3">
              <div>
                <Text as="p" variant="label">
                  Storage
                </Text>
                <Text as="p" variant="body" tone="foreground" className="font-medium">
                  Workspace usage
                </Text>
              </div>

              <div className="file-storage-progress">
                <div className="file-storage-progress-bar" style={{ width: `${storageUsage}%` }} />
              </div>

              <Text as="p" variant="muted">
                2.1 GB of 5 GB used
              </Text>

              <Text as="p" variant="muted" className="text-xs">
                <strong>Note:</strong> Just for UI
              </Text>
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
