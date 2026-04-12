"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@nera/ui";
import { Download, MoreHorizontal, Trash2 } from "lucide-react";

type FileEntryActionsProps = {
  itemLabel: string;
  canDownload: boolean;
  isDeleting?: boolean;
  onDownload?: () => void;
  onDelete: () => void;
};

export function FileEntryActions({
  itemLabel,
  canDownload,
  isDeleting = false,
  onDownload,
  onDelete,
}: FileEntryActionsProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-end"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={`Open actions for ${itemLabel}`}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((current) => !current);
        }}
      >
        <MoreHorizontal className="size-4" />
      </Button>

      {open ? (
        <div className="absolute right-0 top-11 z-20 min-w-40 rounded-2xl border border-border/70 bg-popover p-1.5 shadow-[var(--shadow-soft)]">
          <button
            type="button"
            disabled={!canDownload}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              setOpen(false);
              onDownload?.();
            }}
          >
            <Download className="size-4" />
            Download
          </button>
          <button
            type="button"
            disabled={isDeleting}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
            onClick={(event: ReactMouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              setOpen(false);
              onDelete();
            }}
          >
            <Trash2 className="size-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
