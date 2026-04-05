"use client";

import { useRef, useState } from "react";
import { Surface, Text } from "@nera/ui";
import { getApiErrorMessage, type FileRecord, type FileSortBy, type SortOrder } from "@/services/base";
import { useDownloadFile, useFiles, useUploadFile } from "@/services/file.service";
import { useFolderView } from "@/services/folder.service";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { Toolbar } from "./toolbar";
import { FileTable } from "./file-list";
import { CreateFolderModal } from "./create-folder-modal";

export function FilePage() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<FileSortBy>("updatedAt");
  const [order, setOrder] = useState<SortOrder>("desc");
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [activeDownloadId, setActiveDownloadId] = useState<string | null>(null);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const folderViewQuery = useFolderView(currentFolderId);
  const filesQuery = useFiles(currentFolderId, sortBy, order);
  const downloadMutation = useDownloadFile();
  const uploadMutation = useUploadFile(currentFolderId);

  const queryError = folderViewQuery.error
    ? getApiErrorMessage(folderViewQuery.error)
    : filesQuery.error
      ? getApiErrorMessage(filesQuery.error)
      : "";

  const handleUpload = async (file: File | null) => {
    if (!file) {
      return;
    }

    setUploadStatus("");

    try {
      await uploadMutation.mutateAsync({ file });
      setUploadStatus(`${file.name} uploaded.`);
    } catch (error) {
      setUploadStatus(getApiErrorMessage(error));
    }
  };

  const handleDownload = async (file: FileRecord) => {
    setActiveDownloadId(file.id);
    setDownloadStatus("");

    try {
      const { blob, filename } = await downloadMutation.mutateAsync(file.id);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = filename || file.name;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
      setDownloadStatus(`${file.name} is ready.`);
    } catch (error) {
      setDownloadStatus(getApiErrorMessage(error));
    } finally {
      setActiveDownloadId(null);
    }
  };

  return (
    <main className="file-manager-shell">
      <div className="file-manager-grid">
        <Sidebar onOpenRoot={() => setCurrentFolderId(null)} />

        <section className="file-main">
          <Header
            breadcrumbs={folderViewQuery.data?.breadcrumbs ?? [{ id: null, name: "My Files" }]}
            onNavigate={setCurrentFolderId}
          />

          <Toolbar
            isUploading={uploadMutation.isPending}
            onUploadClick={() => inputRef.current?.click()}
            onCreateFolder={() => setIsCreateFolderOpen(true)}
            sortBy={sortBy}
            order={order}
            onSortByChange={setSortBy}
            onOrderChange={setOrder}
          />

          {queryError ? (
            <Surface variant="soft" padding="md" className="panel-outline">
              <Text as="p" variant="label">
                Unable to load explorer
              </Text>
              <Text as="p" variant="body" className="mt-3">
                {queryError}
              </Text>
            </Surface>
          ) : null}

          {downloadStatus ? (
            <Surface variant="soft" padding="md" className="panel-outline">
              <div className="flex items-center justify-between gap-3">
                <Text as="p" variant="body">
                  {downloadStatus}
                </Text>
                <span className="file-success-pill">File action</span>
              </div>
            </Surface>
          ) : null}

          {uploadStatus ? (
            <Surface variant="soft" padding="md" className="panel-outline">
              <div className="flex items-center justify-between gap-3">
                <Text as="p" variant="body">
                  {uploadStatus}
                </Text>
                <span className="file-success-pill">Upload</span>
              </div>
            </Surface>
          ) : null}

          <FileTable
            canGoBack={Boolean(folderViewQuery.data?.currentFolder?.parentId)}
            onGoBack={() => setCurrentFolderId(folderViewQuery.data?.currentFolder?.parentId ?? null)}
            folders={folderViewQuery.data?.folders ?? []}
            files={filesQuery.data ?? []}
            onOpenFolder={setCurrentFolderId}
            onOpenFile={(file) => void handleDownload(file)}
            activeDownloadId={activeDownloadId}
            isLoading={folderViewQuery.isLoading || filesQuery.isLoading}
          />
        </section>
      </div>

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
    </main>
  );
}
