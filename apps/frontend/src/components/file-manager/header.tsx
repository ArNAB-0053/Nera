"use client";

import { Text } from "@nera/ui";
import type { FolderBreadcrumb as BreadcrumbItem } from "@/services/base";
import { Breadcrumb } from "../ui/breadcrumb";

type HeaderProps = {
  breadcrumbs?: BreadcrumbItem[];
  onNavigate: (folderId: string | null) => void;
};

export function Header({ breadcrumbs, onNavigate }: HeaderProps) {
  return (
    <div className="file-header-shell">
      <Text as="h1" variant="h2" tone="foreground" className="mb-4">
        File Manager
      </Text>
      <Breadcrumb breadcrumbs={breadcrumbs?? []} onNavigate={onNavigate} />
    </div>
  );
}
