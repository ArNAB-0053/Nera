"use client";

import { FolderSearch } from "lucide-react";
import { Surface, Text } from "@nera/ui";
import type { FileRecord, FolderRecord } from "@/services/base";
import { FileRow } from "./file-item";

type FileTableProps = {
  folders: FolderRecord[];
  files: FileRecord[];
  canGoBack: boolean;
  onGoBack: () => void;
  onOpenFolder: (folderId: string) => void;
  onOpenFile: (file: FileRecord) => void;
  activeDownloadId: string | null;
  isLoading: boolean;
};

export function FileTable({
  folders,
  files,
  canGoBack,
  onGoBack,
  onOpenFolder,
  onOpenFile,
  activeDownloadId,
  isLoading,
}: FileTableProps) {
  const isEmpty = !isLoading && folders.length === 0 && files.length === 0;

  return (
    <Surface variant="elevated" padding="none" className="panel-outline file-table-shell">
      {isLoading ? (
        <div className="px-6 py-8">
          <Text as="p" variant="body">
            Loading files and folders...
          </Text>
        </div>
      ) : isEmpty ? (
        <div className="p-6">
          <div className="file-empty">
            <FolderSearch className="ui-icon-md text-primary" />
            <Text as="h3" variant="h3" tone="foreground">
              This folder is empty
            </Text>
            <Text as="p" variant="muted">
              Upload a file or create a folder to start organizing your vault.
            </Text>
          </div>
        </div>
      ) : (
        <table className="file-table">
          <thead className="file-table-head">
            <tr>
              <th className="file-table-cell">Name</th>
              <th className="file-table-cell">Type</th>
              <th className="file-table-cell">Size</th>
              <th className="file-table-cell">Last Modified</th>
              <th className="file-table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {canGoBack ? <FileRow kind="back" onOpen={onGoBack} /> : null}
            {folders.map((folder) => (
              <FileRow key={folder.id} kind="folder" item={folder} onOpen={onOpenFolder} />
            ))}
            {files.map((file) => (
              <FileRow
                key={file.id}
                kind="file"
                item={file}
                onOpen={onOpenFile}
                isBusy={activeDownloadId === file.id}
              />
            ))}
          </tbody>
        </table>
      )}
    </Surface>
  );
}
