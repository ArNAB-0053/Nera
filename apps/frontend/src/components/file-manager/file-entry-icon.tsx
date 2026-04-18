"use client";

import { FileArchive, FileImage, FileText, FolderClosed, History } from "lucide-react";
import type { FileRecord } from "@/services/base";

type FileEntryIconProps = {
  kind: "file" | "folder" | "back";
  file?: FileRecord;
  className?: string;
};

export function FileEntryIcon({ kind, file, className }: FileEntryIconProps) {
  if (kind === "folder") {
    return <FolderClosed className={className} />;
  }

  if (kind === "back") {
    return <History className={className} />;
  }

  if (file?.mimeType?.includes("image")) {
    return <FileImage className={className} />;
  }

  if (file?.mimeType?.includes("pdf") || file?.mimeType?.includes("text")) {
    return <FileText className={className} />;
  }

  return <FileArchive className={className} />;
}
