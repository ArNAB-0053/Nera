"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type { TestRecord } from "./base";

export async function getTests() {
  const { data } = await axiosInstance.get<TestRecord[]>("/api/test");
  return data;
}

export async function createTest(payload: { name: string }) {
  const { data } = await axiosInstance.post<TestRecord>("/api/test", payload);
  return data;
}

export function useGetTests() {
  return useQuery({
    queryKey: queryKeys.tests,
    queryFn: getTests,
  });
}

export function useCreateTest(onCreated?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tests });
      onCreated?.();
    },
  });
}
