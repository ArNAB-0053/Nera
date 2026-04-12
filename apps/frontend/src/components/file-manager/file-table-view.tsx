"use client";

import { Text } from "@nera/ui";
import { CornerUpLeft } from "lucide-react";
import { formatBytes, formatDateLabel } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FileRecord, FolderRecord } from "@/services/base";
import { FileEntryActions } from "./file-entry-actions";
import { FileEntryIcon } from "./file-entry-icon";

type FileTableViewProps = {
  folders: FolderRecord[];
  files: FileRecord[];
  canGoBack: boolean;
  onGoBack: () => void;
  onOpenFolder: (folderId: string) => void;
  onOpenFile: (file: FileRecord) => void;
  onDeletePlaceholder: (itemName: string) => void;
  activeDownloadId: string | null;
};

export function FileTableView({
  folders,
  files,
  canGoBack,
  onGoBack,
  onOpenFolder,
  onOpenFile,
  onDeletePlaceholder,
  activeDownloadId,
}: FileTableViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="w-32">Size</TableHead>
          <TableHead className="w-52">Last Modified</TableHead>
          <TableHead className="w-20 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {canGoBack ? (
          <TableRow
            tabIndex={0}
            role="button"
            onClick={onGoBack}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onGoBack();
              }
            }}
            className="cursor-pointer "
          >
            <TableCell>
              <div className="flex items-center gap-3 font-medium">
                <CornerUpLeft className="size-4 text-primary" />
                <span>Go Back</span>
              </div>
            </TableCell>
            <TableCell>
              <Text as="span" variant="muted">
                Folder
              </Text>
            </TableCell>
            <TableCell>
              <Text as="span" variant="muted">
                --
              </Text>
            </TableCell>
            <TableCell>
              <Text as="span" variant="muted">
                Parent folder
              </Text>
            </TableCell>
            <TableCell className="text-right">
              <FileEntryActions
                itemLabel="Go Back"
                canDownload={false}
                onDelete={() => onDeletePlaceholder("parent folder shortcut")}
              />
            </TableCell>
          </TableRow>
        ) : null}

        {folders.map((folder) => (
          <TableRow
            key={folder.id}
            tabIndex={0}
            role="button"
            onClick={() => onOpenFolder(folder.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpenFolder(folder.id);
              }
            }}
            className="cursor-pointer"
          >
            <TableCell>
              <div className="flex items-center gap-3 font-medium text-foreground">
                <FileEntryIcon kind="folder" className="size-4 text-primary" />
                <span className="truncate">{folder.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <Text as="span" variant="muted">
                Folder
              </Text>
            </TableCell>
            <TableCell>
              <Text as="span" variant="muted">
                --
              </Text>
            </TableCell>
            <TableCell>
              <Text as="span" variant="muted">
                {formatDateLabel(folder.updatedAt)}
              </Text>
            </TableCell>
            <TableCell className="text-right">
              <FileEntryActions
                itemLabel={folder.name}
                canDownload={false}
                onDelete={() => onDeletePlaceholder(folder.name)}
              />
            </TableCell>
          </TableRow>
        ))}

        {files.map((file) => {
          const isBusy = activeDownloadId === file.id;

          return (
            <TableRow
              key={file.id}
              tabIndex={0}
              role="button"
              // onClick={() => onOpenFile(file)}
              // onKeyDown={(event) => {
              //   if (event.key === "Enter" || event.key === " ") {
              //     event.preventDefault();
              //     onOpenFile(file);
              //   }
              // }}
              className="cursor-pointer"
            >
              <TableCell>
                <div className="flex items-center gap-3 font-medium text-foreground">
                  <FileEntryIcon kind="file" file={file} className="size-4 text-primary" />
                  <span className="truncate">{file.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex rounded-full  px-2.5 py-1 text-xs font-medium text-accent-foreground">
                  {file.mimeType ?? "File"}
                </span>
              </TableCell>
              <TableCell>
                <Text as="span" variant="muted">
                  {formatBytes(file.size)}
                </Text>
              </TableCell>
              <TableCell>
                <Text as="span" variant="muted">
                  {isBusy ? "Preparing..." : formatDateLabel(file.updatedAt)}
                </Text>
              </TableCell>
              <TableCell className="text-right">
                <FileEntryActions
                  itemLabel={file.name}
                  canDownload
                  onDownload={() => onOpenFile(file)}
                  onDelete={() => onDeletePlaceholder(file.name)}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
