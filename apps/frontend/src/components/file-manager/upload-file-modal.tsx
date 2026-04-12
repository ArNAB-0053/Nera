"use client";

import type { ChangeEvent, DragEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { FileUp, UploadCloud } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Text,
} from "@nera/ui";
import { useFileUpload } from "@/hooks/use-file-upload";

type UploadFileModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string | null;
  currentFolderName: string;
};

export function UploadFileModal({
  open,
  onOpenChange,
  folderId,
  currentFolderName,
}: UploadFileModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isUploading, progress, reset, status, upload } = useFileUpload({
    folderId,
    onSuccess: () => {
      closeTimeoutRef.current = window.setTimeout(() => {
        handleOpenChange(false);
      }, 500);
    },
  });

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open && closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, [open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      setIsDragging(false);
      setSelectedFile(null);
      reset();
    }

    onOpenChange(nextOpen);
  };

  const handleFileSelection = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileSelection(event.dataTransfer.files?.[0] ?? null);
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(event.target.files?.[0] ?? null);
    event.target.value = "";
  };

  const handleUpload = async () => {
    const didUpload = await upload(selectedFile);

    if (!didUpload) {
      return;
    }

    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <div className="rounded-[var(--radius-panel)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--surface-elevated)_96%,transparent),color-mix(in_oklab,var(--background)_92%,transparent))] p-6 sm:p-7">
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle>Upload file</DialogTitle>
              <DialogDescription>
                Add a file to {currentFolderName} by dropping it here or choosing it from your device.
              </DialogDescription>
            </DialogHeader>

            <div
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  return;
                }
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              className={`file-upload-zone min-h-64 items-center justify-center p-6 text-center sm:p-8 ${
                isDragging ? "file-upload-zone-active" : ""
              }`}
            >
              <div className="space-y-4">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-border/70 bg-background/80 text-primary shadow-[var(--shadow-soft)]">
                  <UploadCloud className="ui-icon-md" />
                </div>

                <div className="space-y-2">
                  <Text as="p" variant="body" tone="foreground" className="font-semibold">
                    {isDragging ? "Release to add this file" : "Drag and drop a file here"}
                  </Text>
                  <Text as="p" variant="muted">
                    Single-file upload with the same explorer styling as the rest of the workspace.
                  </Text>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                  disabled={isUploading}
                >
                  Select from device
                </Button>
              </div>
            </div>

            <div className="rounded-[var(--radius-xl)] border border-border/70 bg-background/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <FileUp className="ui-icon-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <Text as="p" variant="body" tone="foreground" className="truncate font-medium">
                    {selectedFile?.name ?? "Choose a file to begin"}
                  </Text>
                  <Text as="p" variant="muted">
                    {selectedFile
                      ? `${Math.max(selectedFile.size / 1024, 1).toFixed(1)} KB`
                      : "Drag a file into the drop area or browse from your device."}
                  </Text>
                </div>
              </div>

              {(isUploading || progress > 0 || status) ? (
                <div className="mt-4 space-y-2">
                  <progress className="file-progress-meter" max={100} value={progress} />
                  <Text as="p" variant="muted">
                    {status || `Upload progress: ${progress}%`}
                  </Text>
                </div>
              ) : null}
            </div>

            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isUploading}>
                Cancel
              </Button>
              <Button type="button" onClick={() => void handleUpload()} disabled={isUploading || !selectedFile}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
