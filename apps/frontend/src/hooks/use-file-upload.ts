"use client";

import { useCallback, useState } from "react";
import { getApiErrorMessage } from "@/services/base";
import { useUploadFile } from "@/services/file.service";
import { useGetCurrentUser } from "@/services/user";

const MAX_USER_STORAGE_BYTES = 2 * 1024 * 1024 * 1024;

type UseFileUploadOptions = {
  folderId: string | null;
  onSuccess?: (file: File) => void;
};

export function useFileUpload({ folderId, onSuccess }: UseFileUploadOptions) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const uploadMutation = useUploadFile(folderId);
  const currentUserQuery = useGetCurrentUser();

  const upload = async (file: File | null) => {
    if (!file) {
      setStatus("Choose a file to upload first.");
      return false;
    }

    const totalStorageUsed = currentUserQuery.data?.data.totalStorageUsed ?? 0;
    if (totalStorageUsed + file.size > MAX_USER_STORAGE_BYTES) {
      setStatus("Storage limit exceeded");
      setProgress(0);
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
