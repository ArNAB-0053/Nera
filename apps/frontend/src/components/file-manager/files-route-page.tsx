"use client";

import { useRef, useState } from "react";
import { Button, Surface, Text } from "@nera/ui";
import { FolderPlus, LayoutGrid, List, Upload } from "lucide-react";
import { getApiErrorMessage, type FileRecord, type FileSortBy, type SortOrder } from "@/services/base";
import { useDownloadFile, useFiles, useUploadFile } from "@/services/file.service";
import { useFolderView } from "@/services/folder.service";
import { FileGridView } from "./file-grid-view";
import { FileTableView } from "./file-table-view";
import { CreateFolderModal } from "./create-folder-modal";

type FilesRouteKind = "my-files" | "recent" | "pinned" | "trash";
type ViewMode = "table" | "grid";

const pageCopy: Record<
  FilesRouteKind,
  {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
  }
> = {
  "my-files": {
    title: "My Files",
    description: "Browse folders, upload files, and manage the main workspace without leaving the shared explorer shell.",
    emptyTitle: "Nothing here yet",
    emptyDescription: "Upload a file or create a folder to start organizing your workspace.",
  },
  recent: {
    title: "Recent",
    description: "A quick, non-reloading view of your most recently updated files.",
    emptyTitle: "No recent files",
    emptyDescription: "Files you open or update most recently will appear here.",
  },
  pinned: {
    title: "Pinned",
    description: "A focused space for items you want to keep within reach.",
    emptyTitle: "No pinned items yet",
    emptyDescription: "Pinned items are not available from the current API yet, so this view stays ready for them.",
  },
  trash: {
    title: "Trash",
    description: "Review deleted items from the same explorer layout before destructive actions are wired up.",
    emptyTitle: "Trash is empty",
    emptyDescription: "Deleted items will appear here when the API starts returning them.",
  },
};

type FilesRoutePageProps = {
  kind: FilesRouteKind;
};

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

export function FilesRoutePage({ kind }: FilesRoutePageProps) {
  const isMyFiles = kind === "my-files";
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<FileSortBy>(kind === "recent" ? "updatedAt" : "name");
  const [order, setOrder] = useState<SortOrder>("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [activeDownloadId, setActiveDownloadId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const effectiveFolderId = isMyFiles ? currentFolderId : null;
  const folderViewQuery = useFolderView(effectiveFolderId);
  const filesQuery = useFiles(effectiveFolderId, sortBy, order);
  const downloadMutation = useDownloadFile();
  const uploadMutation = useUploadFile(effectiveFolderId);

  const copy = pageCopy[kind];
  const queryError = folderViewQuery.error
    ? getApiErrorMessage(folderViewQuery.error)
    : filesQuery.error
      ? getApiErrorMessage(filesQuery.error)
      : "";

  const allFolders = isMyFiles ? folderViewQuery.data?.folders ?? [] : [];
  const allFiles = filesQuery.data ?? [];
  const folders = kind === "trash" ? allFolders.filter((folder) => folder.isDeleted) : allFolders;
  const files =
    kind === "pinned"
      ? []
      : kind === "trash"
        ? allFiles.filter((file) => file.isDeleted)
        : kind === "recent"
          ? [...allFiles].sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
          : allFiles;

  const isLoading = folderViewQuery.isLoading || filesQuery.isLoading;
  const isEmpty = !isLoading && folders.length === 0 && files.length === 0;
  const canGoBack = isMyFiles && Boolean(folderViewQuery.data?.currentFolder?.parentId);
  const breadcrumbs = isMyFiles
    ? folderViewQuery.data?.breadcrumbs ?? [{ id: null, name: "My Files" }]
    : [{ id: null, name: copy.title }];

  const handleUpload = async (file: File | null) => {
    if (!file) {
      return;
    }

    setStatusMessage("");

    try {
      await uploadMutation.mutateAsync({ file });
      setStatusMessage(`${file.name} uploaded successfully.`);
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error));
    }
  };

  const handleDownload = async (file: FileRecord) => {
    setActiveDownloadId(file.id);
    setStatusMessage("");

    try {
      const { blob, filename } = await downloadMutation.mutateAsync(file.id);
      downloadBlob(blob, filename || file.name);
      setStatusMessage(`${file.name} is ready to download.`);
    } catch (error) {
      setStatusMessage(getApiErrorMessage(error));
    } finally {
      setActiveDownloadId(null);
    }
  };

  const handleDeletePlaceholder = (itemName: string) => {
    setStatusMessage(`Delete is still UI-only for ${itemName}.`);
  };

  return (
    <>
      <section className="mx-auto flex w-full max-w-none flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[var(--radius-panel)] border border-border/70 bg-card/72 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Text as="p" variant="label">
                Files Workspace
              </Text>
              <div className="space-y-2">
                <Text as="h1" variant="h2" tone="foreground">
                  {copy.title}
                </Text>
                <Text as="p" variant="body" className="max-w-3xl text-muted-foreground">
                  {copy.description}
                </Text>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-2xl border border-border/70 bg-background/70 p-1">
                <Button
                  type="button"
                  variant={viewMode === "table" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  <List className="size-4" />
                  Table
                </Button>
                <Button
                  type="button"
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="size-4" />
                  Grid
                </Button>
              </div>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as FileSortBy)}
                className="h-10 rounded-2xl border border-border/70 bg-background/70 px-3 text-sm outline-none transition-colors focus:border-primary/50"
              >
                <option value="name">Sort by name</option>
                <option value="updatedAt">Sort by modified</option>
                <option value="size">Sort by size</option>
              </select>

              <select
                value={order}
                onChange={(event) => setOrder(event.target.value as SortOrder)}
                className="h-10 rounded-2xl border border-border/70 bg-background/70 px-3 text-sm outline-none transition-colors focus:border-primary/50"
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>

              {isMyFiles ? (
                <>
                  <Button type="button" variant="outline" onClick={() => setIsCreateFolderOpen(true)}>
                    <FolderPlus className="size-4" />
                    New Folder
                  </Button>
                  <Button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploadMutation.isPending}
                  >
                    <Upload className="size-4" />
                    {uploadMutation.isPending ? "Uploading..." : "Upload"}
                  </Button>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((breadcrumb, index) => {
              const isActive = index === breadcrumbs.length - 1;

              return (
                <button
                  key={`${breadcrumb.id ?? "root"}-${breadcrumb.name}`}
                  type="button"
                  disabled={!isMyFiles || isActive}
                  onClick={() => {
                    if (isMyFiles) {
                      setCurrentFolderId(breadcrumb.id);
                    }
                  }}
                  className="rounded-full border border-border/60 bg-background/65 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-default disabled:opacity-100"
                >
                  <span className={isActive ? "font-medium text-foreground" : ""}>{breadcrumb.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {queryError ? (
          <Surface variant="soft" padding="md" className="rounded-[var(--radius-panel)] border border-destructive/30">
            <Text as="p" variant="label">
              Unable to load explorer
            </Text>
            <Text as="p" variant="body" className="mt-2">
              {queryError}
            </Text>
          </Surface>
        ) : null}

        {statusMessage ? (
          <Surface variant="soft" padding="md" className="rounded-[var(--radius-panel)] border border-border/70">
            <div className="flex items-center justify-between gap-3">
              <Text as="p" variant="body">
                {statusMessage}
              </Text>
              <span className="inline-flex rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">
                Status
              </span>
            </div>
          </Surface>
        ) : null}

        <Surface
          variant="elevated"
          padding="none"
          className="w-full max-w-none overflow-hidden rounded-[var(--radius-panel)] border border-border/70 bg-card/72 shadow-[var(--shadow-soft)]"
        >
          {isLoading ? (
            <div className="px-6 py-10">
              <Text as="p" variant="body">
                Loading files and folders...
              </Text>
            </div>
          ) : isEmpty ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-[var(--radius-panel)] border border-dashed border-border/75 bg-background/45 px-6 py-10">
                <Text as="h2" variant="h3" tone="foreground">
                  {copy.emptyTitle}
                </Text>
                <Text as="p" variant="body" className="text-muted-foreground">
                  {copy.emptyDescription}
                </Text>
              </div>
            </div>
          ) : viewMode === "table" ? (
            <FileTableView
              folders={folders}
              files={files}
              canGoBack={canGoBack}
              onGoBack={() => setCurrentFolderId(folderViewQuery.data?.currentFolder?.parentId ?? null)}
              onOpenFolder={setCurrentFolderId}
              onOpenFile={(file) => void handleDownload(file)}
              onDeletePlaceholder={handleDeletePlaceholder}
              activeDownloadId={activeDownloadId}
            />
          ) : (
            <div className="p-4 sm:p-5">
              <FileGridView
                folders={folders}
                files={files}
                canGoBack={canGoBack}
                onGoBack={() => setCurrentFolderId(folderViewQuery.data?.currentFolder?.parentId ?? null)}
                onOpenFolder={setCurrentFolderId}
                onOpenFile={(file) => void handleDownload(file)}
                onDeletePlaceholder={handleDeletePlaceholder}
                activeDownloadId={activeDownloadId}
              />
            </div>
          )}
        </Surface>
      </section>

      {isMyFiles ? (
        <>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(event) => {
              void handleUpload(event.target.files?.[0] ?? null);
              event.target.value = "";
            }}
          />

          <CreateFolderModal
            open={isCreateFolderOpen}
            onOpenChange={setIsCreateFolderOpen}
            parentId={currentFolderId}
            currentFolderName={folderViewQuery.data?.currentFolder?.name ?? "My Files"}
          />
        </>
      ) : null}
    </>
  );
}
