"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { queryKeys } from "@/lib/query-keys";
import type { ApiSuccess, PublicUser } from "./base";
import { getApiErrorMessage } from "./base";

export type LoginPayload = {
  identifier: string;
  password: string;
  otp?: string;
};

export type RegisterPayload = {
  email: string;
  username?: string;
  password: string;
  recoveryKey: string;
};

export type RefreshPayload = {
  message: string;
};

export type LogoutPayload = {
  message: string;
};

export type TwoFactorSetupPayload = {
  password: string;
};

export type TwoFactorSetupResult = {
  secret: string;
  otpauthUrl: string;
};

export type TwoFactorEnablePayload = {
  secret: string;
  token: string;
};

export type TwoFactorDisablePayload = {
  password: string;
  token: string;
};

export async function registerUser(payload: RegisterPayload) {
  const { data } = await axiosInstance.post<ApiSuccess<PublicUser>>("/api/auth/register", payload);
  return data;
}

export async function loginUser(payload: LoginPayload) {
  const { data } = await axiosInstance.post<ApiSuccess<PublicUser>>("/api/auth/login", payload);
  return data;
}

export async function refreshSession() {
  const { data } = await axiosInstance.post<ApiSuccess<RefreshPayload>>("/api/auth/refresh");
  return data;
}

export async function logoutUser() {
  const { data } = await axiosInstance.post<ApiSuccess<LogoutPayload>>("/api/auth/logout");
  return data;
}

export async function setupTwoFactor(payload: TwoFactorSetupPayload) {
  const { data } = await axiosInstance.post<ApiSuccess<TwoFactorSetupResult>>("/api/auth/2fa/setup", payload);
  return data;
}

export async function enableTwoFactor(payload: TwoFactorEnablePayload) {
  const { data } = await axiosInstance.post<ApiSuccess<{ enabled: boolean }>>("/api/auth/2fa/enable", payload);
  return data;
}

export async function disableTwoFactor(payload: TwoFactorDisablePayload) {
  const { data } = await axiosInstance.post<ApiSuccess<{ enabled: boolean }>>("/api/auth/2fa/disable", payload);
  return data;
}

export function useCreateSession(setMessage: (message: string) => void) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async (response) => {
      setMessage(response.message);
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
      router.push("/my-files");
    },
    onError: (error) => {
      setMessage(getApiErrorMessage(error));
    },
  });
}

export function useCreateAccount(setMessage: (message: string) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: async (response) => {
      setMessage(response.message);
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
    onError: (error) => {
      setMessage(getApiErrorMessage(error));
    },
  });
}

export function useCreateSessionRefresh() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshSession,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}

export function useLogoutSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}

export function useSetupTwoFactor(setMessage: (message: string) => void) {
  return useMutation({
    mutationFn: setupTwoFactor,
    onSuccess: (response) => {
      setMessage(response.message);
    },
    onError: (error) => {
      setMessage(getApiErrorMessage(error));
    },
  });
}

export function useEnableTwoFactor(setMessage: (message: string) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enableTwoFactor,
    onSuccess: async (response) => {
      setMessage(response.message);
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
    onError: (error) => {
      setMessage(getApiErrorMessage(error));
    },
  });
}

export function useDisableTwoFactor(setMessage: (message: string) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disableTwoFactor,
    onSuccess: async (response) => {
      setMessage(response.message);
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
    onError: (error) => {
      setMessage(getApiErrorMessage(error));
    },
  });
}
