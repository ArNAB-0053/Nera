"use client";

import { useState } from "react";
import { Button, cn, Dropdown, DropdownContent, DropdownItem, DropdownTrigger, Surface, Text } from "@nera/ui";
import { ChevronRight, FolderPlus, LayoutGrid, List, Upload } from "lucide-react";
import { getApiErrorMessage, type FileSortBy, type SortOrder } from "@/services/base";
import { useFiles } from "@/services/file.service";
import { useFolderView } from "@/services/folder.service";
import { FileGridView } from "./file-grid-view";
import { FileTableView } from "./file-table-view";
import { CreateFolderModal } from "./create-folder-modal";
import { useFileDownload } from "@/hooks/files";
import { FILE_PAGE_CONTENT as pageCopy } from "@/constants/filePageContent";
import { FilesRouteKind } from "@/constants/types";
import { Breadcrumb } from "../ui/breadcrumb";
import { UploadFileModal } from "./upload-file-modal";

type ViewMode = "table" | "grid";

type FilesRoutePageProps = {
  kind: FilesRouteKind;
};

export function FilesRoutePage({ kind }: FilesRoutePageProps) {
  const isMyFiles = kind === "my-files";
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<FileSortBy>(kind === "recent" ? "updatedAt" : "name");
  const [order, setOrder] = useState<SortOrder>("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const activeDownloadId = null;

  const effectiveFolderId = isMyFiles ? currentFolderId : null;
  const folderViewQuery = useFolderView(effectiveFolderId);
  const filesQuery = useFiles(effectiveFolderId, sortBy, order);

  const { download: handleDownload } = useFileDownload();

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

  const handleDeletePlaceholder = (itemName: string) => {
    console.info(`Delete is still UI-only for ${itemName}.`);
  };

  return (
    <>
      <section className="mx-auto flex w-full max-w-none flex-col gap-4">
        <div className={cn(
          "flex flex-col gap-4 mb-2 px-2", 
          "rounded-[var(--radius-panel)] border border-border/70 bg-card/72 p-5 shadow-[var(--shadow-soft)] sm:p-6 "
        )}
        >
          <div className=" flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              {/* <Text as="p" variant="label">
                Files Workspace
              </Text> */}
              <div className="space-y-2">
                <Text as="h1" variant="h2" tone="foreground">
                  {copy.title}
                </Text>
                {/* <Text as="p" variant="body" className="max-w-3xl text-muted-foreground">
                  {copy.description}
                </Text> */}
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
                  {/* Table */}
                </Button>
                <Button
                  type="button"
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="size-4" />
                  {/* Grid */}
                </Button>
              </div>

              <Dropdown>
                <DropdownTrigger label="Filter" />

                <DropdownContent className="w-48">
                  <div className="relative group">
                    {/* Parent item */}
                    <DropdownItem needCheck={false} className="justify-between w-full">
                      <span>Sort</span>
                      <ChevronRight className="ui-icon-sm" />
                    </DropdownItem>

                    {/* Submenu */}
                    <div className="absolute left-full top-0 hidden min-w-[160px] rounded-xl border border-border/70 bg-background shadow-md group-hover:block">
                      <DropdownItem
                        active={order === "desc"}
                        onClick={() => {
                          setSortBy("updatedAt");
                          setOrder("desc");
                        }}
                      >
                        Newest
                      </DropdownItem>

                      <DropdownItem
                        active={order === "asc"}
                        onClick={() => {
                          setSortBy("updatedAt");
                          setOrder("asc");
                        }}
                      >
                        Oldest
                      </DropdownItem>
                    </div>
                  </div>
                </DropdownContent>
              </Dropdown>

              {isMyFiles ? (
                <>
                  <Button type="button" variant="outline" onClick={() => setIsCreateFolderOpen(true)}>
                    <FolderPlus className="size-4" />
                    New Folder
                  </Button>
                  <Button type="button" onClick={() => setIsUploadModalOpen(true)}>
                    <Upload className="size-4" />
                    Upload
                  </Button>
                </>
              ) : null}
            </div>
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

        {/* {statusMessage ? (
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
        ) : null} */}

        <div className="flex flex-wrap items-center gap-2 ">
          <Breadcrumb
            breadcrumbs={breadcrumbs}
            onNavigate={(folderId) => {
              if (isMyFiles) {
                setCurrentFolderId(folderId);
              }
            }}
          />
        </div>
        <Surface
          variant="table"
          padding="none"
          className="w-full max-w-none relative overflow-hidden rounded-[var(--radius-panel)] border border-border/70 bg-card/72 shadow-[var(--shadow-soft)]"
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
          <CreateFolderModal
            open={isCreateFolderOpen}
            onOpenChange={setIsCreateFolderOpen}
            parentId={currentFolderId}
            currentFolderName={folderViewQuery.data?.currentFolder?.name ?? "My Files"}
          />

          <UploadFileModal
            open={isUploadModalOpen}
            onOpenChange={setIsUploadModalOpen}
            folderId={currentFolderId}
            currentFolderName={folderViewQuery.data?.currentFolder?.name ?? "My Files"}
          />
        </>
      ) : null}
    </>
  );
}
