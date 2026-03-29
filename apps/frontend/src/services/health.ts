"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { axiosInstance } from "@/lib/axios";

export type HealthResponse = {
  status: string;
};

export async function getHealth() {
  const { data } = await axiosInstance.get<HealthResponse>("/health");
  return data;
}

export function useGetHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: getHealth,
  });
}
