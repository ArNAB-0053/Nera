"use client"

import { FileRecord } from "@/services/base";
import { useDownloadFile } from "@/services/file.service";

export function useFileDownload() {
  const mutation = useDownloadFile();

  const download = async (file: FileRecord) => {
    try {
      const { blob, filename } = await mutation.mutateAsync(file.id);

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = filename || file.name;
      anchor.style.display = "none";

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      URL.revokeObjectURL(url);
    } catch (err) {
      throw err; // let UI handle message
    }
  };

  return {
    download,
    isDownloading: mutation.isPending,
    error: mutation.error,
  };
}