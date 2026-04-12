"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type {
  ApiSuccess,
  FileRecord,
  FileSortBy,
  SortOrder,
} from "./base";

export type FileListParams = {
  folderId: string | null;
  sortBy: FileSortBy;
  order: SortOrder;
};

export type UploadFilePayload = {
  folderId: string | null;
  file: File;
  onProgress?: (progress: number) => void;
};

export type DownloadFileResult = {
  blob: Blob;
  filename: string;
};

function getFilenameFromDisposition(disposition?: string) {
  if (!disposition) {
    return "download";
  }

  const utfMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1]);
  }

  const plainMatch = disposition.match(/filename="([^"]+)"/i) ?? disposition.match(/filename=([^;]+)/i);
  if (plainMatch?.[1]) {
    return plainMatch[1].trim();
  }

  return "download";
}

export async function getFiles({ folderId, sortBy, order }: FileListParams) {
  const { data } = await axiosInstance.get<ApiSuccess<FileRecord[]>>("/api/file", {
    params: {
      ...(folderId ? { folderId } : {}),
      sortBy,
      order,
    },
  });

  return data.data;
}

export async function uploadFile(payload: UploadFilePayload) {
  const formData = new FormData();

  if (payload.folderId) {
    formData.append("folderId", payload.folderId);
  }

  formData.append("file", payload.file);

  const { data } = await axiosInstance.post<ApiSuccess<FileRecord>>("/api/file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event) => {
      if (!event.total || !payload.onProgress) {
        return;
      }

      payload.onProgress(Math.round((event.loaded / event.total) * 100));
    },
  });

  return data.data;
}

export async function downloadFile(fileId: string) {
  const response = await axiosInstance.get<Blob>(`/api/file/${encodeURIComponent(fileId)}`, {
    responseType: "blob",
  });

  return {
    blob: response.data,
    filename: getFilenameFromDisposition(response.headers["content-disposition"]),
  } satisfies DownloadFileResult;
}

export function useFiles(folderId: string | null, sortBy: FileSortBy, order: SortOrder) {
  return useQuery({
    queryKey: queryKeys.files(folderId, sortBy, order),
    queryFn: () => getFiles({ folderId, sortBy, order }),
  });
}

export function useUploadFile(folderId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, onProgress }: Pick<UploadFilePayload, "file" | "onProgress">) =>
      uploadFile({ folderId, file, onProgress }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["file", "list"] }),
        queryClient.invalidateQueries({ queryKey: queryKeys.folderView(folderId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.me }),
      ]);
    },
  });
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: downloadFile,
  });
}
