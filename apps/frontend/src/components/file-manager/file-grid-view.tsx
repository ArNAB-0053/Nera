"use client";

import { Text } from "@nera/ui";
import { CornerUpLeft } from "lucide-react";
import { formatDateLabel } from "@/lib/utils";
import type { FileRecord, FolderRecord } from "@/services/base";
import { FileEntryActions } from "./file-entry-actions";
import { FileEntryIcon } from "./file-entry-icon";

/* ---------------------------------- */
/*           Folder Card              */
/* ---------------------------------- */

type FolderCardProps = {
  folder: FolderRecord;
  onOpen: (id: string) => void;
  onDelete: () => void;
};

function FolderCard({ folder, onOpen, onDelete }: FolderCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(folder.id)}
      className="group flex h-24 items-center gap-4 rounded-xl border border-border/70 bg-card/70 p-4 text-left transition hover:bg-accent"
    >
      <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <FileEntryIcon kind="folder" className="size-6" />
      </div>

      <div className="flex flex-col overflow-hidden">
        <Text className="truncate font-semibold text-foreground">
          {folder.name}
        </Text>
        <Text variant="muted">
          {formatDateLabel(folder.updatedAt)}
        </Text>
      </div>

      <div className="ml-auto">
        <FileEntryActions
          itemLabel={folder.name}
          canDownload={false}
          onDelete={onDelete}
        />
      </div>
    </button>
  );
}

/* ---------------------------------- */
/*             File Card              */
/* ---------------------------------- */

type FileCardProps = {
  file: FileRecord;
  onDownload: () => void;
  onDelete: () => void;
  isDeleting: boolean;
};

function FileCard({
  file,
  onDownload,
  onDelete,
  isDeleting,
}: FileCardProps) {
  return (
    <div className="relative overflow-hidden flex items-center justify-between h-50 w-full flex-col rounded-xl border border-border/70 bg-card/75 shadow-sm transition hover:border-primary/30 hover:bg-card">
      <div className="flex w-full h-8/10 items-center justify-center bg-primary/10 p-6 text-primary">
          <FileEntryIcon kind="file" file={file} className=" w-full h-full " />
        </div>

      <div className="flex items-center justify-center overflow-hidden w-full relative ">
        <Text className=" truncate text-nowrap font-semibold text-sm text-foreground py-3 px-12 ">
          {file.name}
        </Text>

        <div className="absolute right-0 -top-1/2 translate-y-1/2">
          <FileEntryActions
          itemLabel={file.name}
          canDownload
          isDeleting={isDeleting}
          onDownload={onDownload}
          onDelete={onDelete}
        />
        </div>
      
      </div>

      {/* <div className="mt-4 space-y-1">
        <Text className="line-clamp-2 font-semibold text-foreground">
          {file.name}
        </Text>
        <Text variant="muted">{file.mimeType ?? "File"}</Text>
      </div> */}

      {/* <div className="mt-auto pt-4">
        <Text variant="muted">
          {isDownloading
            ? "Preparing..."
            : `${formatBytes(file.size)} · ${formatDateLabel(file.updatedAt)}`}
        </Text>
      </div> */}
    </div>
  );
}

/* ---------------------------------- */
/*         File Grid View             */
/* ---------------------------------- */

type FileGridViewProps = {
  folders: FolderRecord[];
  files: FileRecord[];
  canGoBack: boolean;
  onGoBack: () => void;
  onOpenFolder: (folderId: string) => void;
  onOpenFile: (file: FileRecord) => void;
  onDeletePlaceholder: (itemName: string) => void;
  onDeleteFile: (file: FileRecord) => void;
  activeDeleteId: string | null;
};

export function FileGridView({
  folders,
  files,
  canGoBack,
  onGoBack,
  onOpenFolder,
  onOpenFile,
  onDeletePlaceholder,
  onDeleteFile,
  activeDeleteId,
}: FileGridViewProps) {
  return (
    <div className="space-y-6">
      {/* ---------------- FOLDERS ---------------- */}
      {(folders.length > 0 || canGoBack) && (
        <div>
          <Text variant="label" className="mb-2">
            Folders
          </Text>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {canGoBack && (
              <button
                onClick={onGoBack}
                className="flex h-24 items-center gap-4 rounded-xl border border-border/70 bg-card/70 p-4 hover:bg-accent"
              >
                <CornerUpLeft className="size-5" />
                <Text>Go Back</Text>
              </button>
            )}

            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onOpen={onOpenFolder}
                onDelete={() => onDeletePlaceholder(folder.name)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ---------------- FILES ---------------- */}
      {files.length > 0 && (
        <div>
          <Text variant="label" className="mb-2">
            Files
          </Text>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDownload={() => onOpenFile(file)}
                onDelete={() => onDeleteFile(file)}
                isDeleting={activeDeleteId === file.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
