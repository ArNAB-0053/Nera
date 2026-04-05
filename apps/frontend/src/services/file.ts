"use client";

import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { ApiSuccess, FileRecord } from "./base";

export type UploadFilePayload = {
  folderId: string;
  file: File;
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

export async function uploadFile(payload: UploadFilePayload) {
  const formData = new FormData();
  if (payload.folderId.trim()) {
    formData.append("folderId", payload.folderId.trim());
  }
  formData.append("file", payload.file);

  const { data } = await axiosInstance.post<ApiSuccess<FileRecord>>("/api/file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
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

export function useUploadFile() {
  return useMutation({
    mutationFn: uploadFile,
  });
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: downloadFile,
  });
}
