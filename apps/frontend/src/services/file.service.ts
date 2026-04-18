"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import { useVault } from "@/providers/vault-provider";
import { decryptFileWithVaultPassword, encryptFileWithVaultPassword } from "@/lib/vault-crypto";
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
  search?: string;
  type?: string;
};

export type UploadFilePayload = {
  folderId: string | null;
  file: File;
  vaultPassword: string;
  onProgress?: (progress: number) => void;
};

export type DownloadFileResult = {
  blob: Blob;
  filename: string;
};

export type EncryptedDownloadResult = {
  encryptedFile: string;
  iv: string;
  authTag: string;
  salt: string;
  mimeType?: string | null;
  name: string;
};

export type DeleteFileResult = {
  id: string;
};

export async function getFiles({ folderId, sortBy, order, search, type }: FileListParams) {
  const { data } = await axiosInstance.get<ApiSuccess<FileRecord[]>>("/api/file", {
    params: {
      ...(folderId ? { folderId } : {}),
      ...(search ? { search } : {}),
      ...(type ? { type } : {}),
      sortBy,
      order,
    },
  });

  return data.data;
}

export async function uploadFile(payload: UploadFilePayload) {
  const encrypted = await encryptFileWithVaultPassword(payload.file, payload.vaultPassword);
  const formData = new FormData();

  if (payload.folderId) {
    formData.append("folderId", payload.folderId);
  }

  formData.append("iv", encrypted.iv);
  formData.append("authTag", encrypted.authTag);
  formData.append("salt", encrypted.salt);
  formData.append("mimeType", encrypted.mimeType);
  formData.append("file", encrypted.encryptedBlob, encrypted.originalName);

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
  const { data } = await axiosInstance.get<ApiSuccess<EncryptedDownloadResult>>(`/api/file/${encodeURIComponent(fileId)}`);
  return data.data;
}

export async function deleteFile(fileId: string) {
  const { data } = await axiosInstance.delete<ApiSuccess<DeleteFileResult>>(`/api/file/${encodeURIComponent(fileId)}`);
  return data.data;
}

export function useFiles(folderId: string | null, sortBy: FileSortBy, order: SortOrder, search?: string, type?: string) {
  return useQuery({
    queryKey: queryKeys.files(folderId, sortBy, order, search, type),
    queryFn: () => getFiles({ folderId, sortBy, order, search, type }),
  });
}

export function useUploadFile(folderId: string | null) {
  const queryClient = useQueryClient();
  const { getVaultPassword } = useVault();

  return useMutation({
    mutationFn: async ({ file, onProgress }: Pick<UploadFilePayload, "file" | "onProgress">) =>
      uploadFile({
        folderId,
        file,
        onProgress,
        vaultPassword: await getVaultPassword(),
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["file", "list"] }),
        queryClient.invalidateQueries({ queryKey: queryKeys.folderView(folderId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.me }),
      ]);
    },
  });
}

export function useDeleteFile(folderId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFile,
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
  const { getVaultPassword } = useVault();

  return useMutation({
    mutationFn: async (fileId: string) => {
      const encrypted = await downloadFile(fileId);
      const blob = await decryptFileWithVaultPassword({
        password: await getVaultPassword(),
        encryptedFile: encrypted.encryptedFile,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        salt: encrypted.salt,
        mimeType: encrypted.mimeType,
      });

      return {
        blob,
        filename: encrypted.name,
      } satisfies DownloadFileResult;
    },
  });
}
