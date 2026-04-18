import type { AxiosError } from "axios";

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiFailure = {
  success: false;
  message: string;
  errors?: unknown;
};

export type PublicUser = {
  id: string;
  email: string;
  username?: string | null;
  totalStorageUsed: number;
  isVerified?: boolean;
  twoFactorEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TestRecord = {
  id: string;
  name: string;
  createdAt: string;
};

export type FileRecord = {
  id: string;
  userId: string;
  folderId?: string | null;
  name: string;
  description?: string | null;
  size: number;
  storagePath: string;
  mimeType?: string | null;
  isEncrypted: boolean;
  iv?: string | null;
  authTag?: string | null;
  salt?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FolderRecord = {
  id: string;
  userId: string;
  name: string;
  parentId?: string | null;
  isRoot: boolean;
  size: number;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FolderBreadcrumb = {
  id: string | null;
  name: string;
};

export type FolderViewRecord = {
  currentFolder: FolderRecord | null;
  breadcrumbs: FolderBreadcrumb[];
  folders: FolderRecord[];
};

export type FileSortBy = "updatedAt" | "name" | "size";
export type SortOrder = "asc" | "desc";

export function getApiErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<ApiFailure>;
  return axiosError.response?.data?.message ?? axiosError.message ?? "Something went wrong";
}
