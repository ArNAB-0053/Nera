"use client";

import { ChevronRight } from "lucide-react";
import { Text } from "@nera/ui";
import type { FolderBreadcrumb as FolderBreadcrumbItem } from "@/services/base";

type FolderBreadcrumbProps = {
  breadcrumbs: FolderBreadcrumbItem[];
  onNavigate: (folderId: string | null) => void;
};

export function FolderBreadcrumb({ breadcrumbs, onNavigate }: FolderBreadcrumbProps) {
  return (
    <div className="file-breadcrumbs">
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={`${breadcrumb.id ?? "root"}-${breadcrumb.name}`} className="flex items-center gap-2">
            <button
              type="button"
              className={`file-breadcrumb-button ${isLast ? "file-breadcrumb-button-active" : ""}`}
              onClick={() => onNavigate(breadcrumb.id)}
            >
              {breadcrumb.name}
            </button>
            {!isLast ? (
              <ChevronRight className="ui-icon-sm text-muted-foreground" />
            ) : (
              <Text as="span" variant="muted">
                Current
              </Text>
            )}
          </div>
        );
      })}
    </div>
  );
}
