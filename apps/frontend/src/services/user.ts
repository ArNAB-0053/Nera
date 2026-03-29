"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type { ApiSuccess, PublicUser } from "./base";

export async function getCurrentUser() {
  const { data } = await axiosInstance.get<ApiSuccess<PublicUser>>("/api/user/me");
  return data;
}

export async function getUserByUsername(username: string) {
  const { data } = await axiosInstance.get<ApiSuccess<PublicUser>>(`/api/user/${encodeURIComponent(username)}`);
  return data;
}

export function useGetCurrentUser() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: getCurrentUser,
    retry: false,
  });
}

export function useGetUserByUsername(username: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.userByUsername(username),
    queryFn: () => getUserByUsername(username),
    enabled,
    retry: false,
  });
}
