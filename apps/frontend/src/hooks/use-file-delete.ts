"use client";

import { useState } from "react";
import { getApiErrorMessage } from "@/services/base";
import { useDeleteFile } from "@/services/file.service";

type UseFileDeleteOptions = {
  folderId: string | null;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
};

export function useFileDelete({ folderId, onSuccess, onError }: UseFileDeleteOptions) {
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);
  const deleteMutation = useDeleteFile(folderId);

  const remove = async (fileId: string, fileName: string) => {
    const shouldDelete = window.confirm(`Delete ${fileName}?`);

    if (!shouldDelete) {
      return false;
    }

    setActiveDeleteId(fileId);

    try {
      await deleteMutation.mutateAsync(fileId);
      onSuccess?.(`${fileName} deleted successfully.`);
      return true;
    } catch (error) {
      onError?.(getApiErrorMessage(error));
      return false;
    } finally {
      setActiveDeleteId(null);
    }
  };

  return {
    remove,
    activeDeleteId,
  };
}
