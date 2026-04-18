"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button, Text } from "@nera/ui";
import { getApiErrorMessage } from "@/services/base";
import { useUploadFile } from "@/services/file.service";

type UploadButtonProps = {
  folderId: string | null;
};

export function UploadButton({ folderId }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const uploadMutation = useUploadFile(folderId);

  const startUpload = async (file: File | null) => {
    if (!file) {
      return;
    }

    setStatus("");
    setProgress(0);

    try {
      await uploadMutation.mutateAsync({
        file,
        onProgress: setProgress,
      });
      setProgress(100);
      setStatus(`${file.name} uploaded successfully.`);
    } catch (error) {
      setStatus(getApiErrorMessage(error));
      setProgress(0);
    }
  };

  return (
    <div className={`file-upload-zone ${isDragging ? "file-upload-zone-active" : ""}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="file-row-name">
            <UploadCloud className="ui-icon-sm text-primary" />
            <Text as="p" variant="body" tone="foreground">
              Upload to current folder
            </Text>
          </div>
          <Text as="p" variant="muted">
            Drag a file here or choose one from your device.
          </Text>
        </div>

        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadMutation.isPending}
        >
          {uploadMutation.isPending ? "Uploading..." : "Upload file"}
        </Button>
      </div>

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
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          startUpload(event.dataTransfer.files?.[0] ?? null);
        }}
        className="rounded-[var(--radius-xl)] border border-border/60 bg-background/42 px-4 py-4"
      >
        <Text as="p" variant="muted">
          {isDragging ? "Release to upload into this folder." : "Drop a file here to start uploading."}
        </Text>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(event) => {
          void startUpload(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />

      {(uploadMutation.isPending || progress > 0 || status) ? (
        <div className="space-y-2">
          <progress className="file-progress-meter" max={100} value={progress} />
          {status ? (
            <Text as="p" variant="muted">
              {status}
            </Text>
          ) : (
            <Text as="p" variant="muted">
              Upload progress: {progress}%
            </Text>
          )}
        </div>
      ) : null}
    </div>
  );
}
