"use client";

import type { ReactNode } from "react";
import { Text } from "@nera/ui";
import { CornerUpLeft } from "lucide-react";
import { formatBytes, formatDateLabel } from "@/lib/utils";
import type { FileRecord, FolderRecord } from "@/services/base";
import { FileEntryActions } from "./file-entry-actions";
import { FileEntryIcon } from "./file-entry-icon";

type FileGridViewProps = {
  folders: FolderRecord[];
  files: FileRecord[];
  canGoBack: boolean;
  onGoBack: () => void;
  onOpenFolder: (folderId: string) => void;
  onOpenFile: (file: FileRecord) => void;
  onDeletePlaceholder: (itemName: string) => void;
  activeDownloadId: string | null;
};

type CardButtonProps = {
  title: string;
  subtitle: string;
  meta: string;
  onClick: () => void;
  onDelete: () => void;
  onDownload?: () => void;
  canDownload: boolean;
  icon: ReactNode;
};

function CardButton({
  title,
  subtitle,
  meta,
  onClick,
  onDelete,
  onDownload,
  canDownload,
  icon,
}: CardButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-44 flex-col rounded-[var(--radius-panel)] border border-border/70 bg-card/75 p-4 text-left shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
        <FileEntryActions
          itemLabel={title}
          canDownload={canDownload}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      </div>

      <div className="mt-6 space-y-2">
        <Text as="p" className="line-clamp-2 font-semibold text-foreground">
          {title}
        </Text>
        <Text as="p" variant="muted">
          {subtitle}
        </Text>
      </div>

      <div className="mt-auto pt-6">
        <Text as="span" variant="muted">
          {meta}
        </Text>
      </div>
    </button>
  );
}

export function FileGridView({
  folders,
  files,
  canGoBack,
  onGoBack,
  onOpenFolder,
  onOpenFile,
  onDeletePlaceholder,
  activeDownloadId,
}: FileGridViewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {canGoBack ? (
        <CardButton
          title="Go Back"
          subtitle="Return to parent folder"
          meta="Navigation"
          onClick={onGoBack}
          onDelete={() => onDeletePlaceholder("parent folder shortcut")}
          canDownload={false}
          icon={<CornerUpLeft className="size-5" />}
        />
      ) : null}

      {folders.map((folder) => (
        <CardButton
          key={folder.id}
          title={folder.name}
          subtitle="Folder"
          meta={formatDateLabel(folder.updatedAt)}
          onClick={() => onOpenFolder(folder.id)}
          onDelete={() => onDeletePlaceholder(folder.name)}
          canDownload={false}
          icon={<FileEntryIcon kind="folder" className="size-5" />}
        />
      ))}

      {files.map((file) => (
        <CardButton
          key={file.id}
          title={file.name}
          subtitle={file.mimeType ?? "File"}
          meta={
            activeDownloadId === file.id
              ? "Preparing..."
              : `${formatBytes(file.size)} · ${formatDateLabel(file.updatedAt)}`
          }
          onClick={() => onOpenFile(file)}
          onDownload={() => onOpenFile(file)}
          onDelete={() => onDeletePlaceholder(file.name)}
          canDownload
          icon={<FileEntryIcon kind="file" file={file} className="size-5" />}
        />
      ))}
    </div>
  );
}
