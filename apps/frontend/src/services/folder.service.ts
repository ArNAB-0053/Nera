"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type { ApiSuccess, FolderRecord, FolderViewRecord } from "./base";

export type CreateFolderPayload = {
  name: string;
  parentId: string | null;
};

function sortFoldersByName(folders: FolderRecord[]) {
  return [...folders].sort((left, right) => left.name.localeCompare(right.name));
}

export async function getFolderView(folderId: string | null) {
  const { data } = await axiosInstance.get<ApiSuccess<FolderViewRecord>>("/api/folder", {
    params: folderId ? { folderId } : undefined,
  });

  return data.data;
}

export async function createFolder(payload: CreateFolderPayload) {
  const { data } = await axiosInstance.post<ApiSuccess<FolderRecord>>("/api/folder", {
    name: payload.name,
    ...(payload.parentId ? { parentId: payload.parentId } : {}),
  });

  return data.data;
}

export function useFolderView(folderId: string | null) {
  return useQuery({
    queryKey: queryKeys.folderView(folderId),
    queryFn: () => getFolderView(folderId),
  });
}

export function useCreateFolder(parentId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Pick<CreateFolderPayload, "name">) =>
      createFolder({ name: payload.name, parentId }),
    onMutate: async ({ name }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.folderView(parentId) });

      const previousFolderView = queryClient.getQueryData<FolderViewRecord>(queryKeys.folderView(parentId));

      if (previousFolderView) {
        const now = new Date().toISOString();

        queryClient.setQueryData<FolderViewRecord>(queryKeys.folderView(parentId), {
          ...previousFolderView,
          folders: sortFoldersByName([
            ...previousFolderView.folders,
            {
              id: `temp-${Date.now()}`,
              userId: "pending",
              name,
              parentId,
              isRoot: false,
              size: 0,
              isDeleted: false,
              deletedAt: null,
              createdAt: now,
              updatedAt: now,
            },
          ]),
        });
      }

      return { previousFolderView };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousFolderView) {
        queryClient.setQueryData(queryKeys.folderView(parentId), context.previousFolderView);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.folderView(parentId) });
    },
  });
}
