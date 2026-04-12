"use client";

import { useCallback, useState } from "react";
import { getApiErrorMessage } from "@/services/base";
import { useUploadFile } from "@/services/file.service";

type UseFileUploadOptions = {
  folderId: string | null;
  onSuccess?: (file: File) => void;
};

export function useFileUpload({ folderId, onSuccess }: UseFileUploadOptions) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const uploadMutation = useUploadFile(folderId);

  const upload = async (file: File | null) => {
    if (!file) {
      setStatus("Choose a file to upload first.");
      return false;
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
      onSuccess?.(file);
      return true;
    } catch (error) {
      setStatus(getApiErrorMessage(error));
      setProgress(0);
      return false;
    }
  };

  const reset = useCallback(() => {
    setProgress(0);
    setStatus("");
  }, []);

  return {
    upload,
    reset,
    progress,
    status,
    isUploading: uploadMutation.isPending,
  };
}
