"use client";

import { ChevronRight } from "lucide-react";
import type { FolderBreadcrumb as BreadcrumbItem } from "@/services/base";

type BreadcrumbProps = {
  breadcrumbs: BreadcrumbItem[];
  onNavigate: (folderId: string | null) => void;
};

export function Breadcrumb({ breadcrumbs, onNavigate }: BreadcrumbProps) {
  return (
    <div className="file-breadcrumbs">
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={`${breadcrumb.id ?? "root"}-${breadcrumb.name}`} className="flex items-center gap-2">
            <button
              type="button"
              className={`file-breadcrumb-button ${isLast ? "file-breadcrumb-button-active" : ""}`}
              onClick={() => !isLast && onNavigate(breadcrumb.id)}
            >
              {breadcrumb.name}
            </button>
            {!isLast ? <ChevronRight className="ui-icon-sm text-muted-foreground" /> : null}
          </div>
        );
      })}
    </div>
  );
}
