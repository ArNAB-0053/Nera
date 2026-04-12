"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Button, Text } from "@nera/ui";
import { ChevronLeft, ChevronRight, PanelLeft, PanelLeftClose } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilesSidebar } from "./files-sidebar";

type SidebarState = "expanded" | "collapsed";

type FilesLayoutShellProps = {
  children: ReactNode;
};

export function FilesLayoutShell({ children }: FilesLayoutShellProps) {
  const [sidebarState, setSidebarState] =
    useState<SidebarState>("expanded");

  return (
    <div className="flex min-h-screen w-screen overflow-hidden bg-transparent">

      {/* Sidebar */}
      <aside

        className={cn(
          "group/sidebar relative z-40 flex-shrink-0",
          "transition-[width] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          "border-r border-border/70 bg-card/95 backdrop-blur-xl",
          "h-screen sticky top-0 overflow-visible",
          sidebarState === "collapsed" ? "w-20" : "w-64"
        )}
      >
        <FilesSidebar
          state={sidebarState}
        />

        <Button type="button" variant="icon" size="xs" 
          aria-label={sidebarState === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() =>
              setSidebarState((current) =>
                current === "expanded" ? "collapsed" : "expanded"
              )
            }
          className={cn(
            "absolute -right-3.5 top-1/2 -translate-y-1/2 z-50 px-2",
            "opacity-0 pointer-events-none group-hover/sidebar:opacity-100 group-hover/sidebar:pointer-events-auto focus-visible:opacity-100",
            "transition-opacity duration-150",
          )}
        >
          <ChevronLeft
            className={cn(
              "size-3 text-muted-foreground",
              sidebarState === "collapsed" && "rotate-180",
            )}
          />
        </Button>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex h-screen min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300 relative",
        )}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/70 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">

            {/* Toggle */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setSidebarState((current) =>
                  current === "expanded" ? "collapsed" : "expanded"
                )
              }
            >
              {sidebarState === "collapsed" ? (
                <PanelLeft className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </Button>

            {/* Title */}
            <div className="hidden sm:block">
              <Text as="p" variant="label">
                Files
              </Text>
              <Text as="p" className="font-medium text-foreground">
                File Explorer
              </Text>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}