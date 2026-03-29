import type { AxiosError } from "axios";
import { axiosInstance } from "./axios";

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
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TestRecord = {
  id: string;
  name: string;
  createdAt: string;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  username?: string;
  password: string;
};

export type RefreshPayload = {
  message: string;
};

export const queryKeys = {
  me: ["user", "me"] as const,
  tests: ["tests"] as const,
  userByUsername: (username: string) => ["user", "username", username] as const,
};

export function getApiErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<ApiFailure>;
  return axiosError.response?.data?.message ?? axiosError.message ?? "Something went wrong";
}

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

export async function getCurrentUser() {
  const { data } = await axiosInstance.get<ApiSuccess<PublicUser>>("/api/user/me");
  return data;
}

export async function getUserByUsername(username: string) {
  const { data } = await axiosInstance.get<ApiSuccess<PublicUser>>(`/api/user/${encodeURIComponent(username)}`);
  return data;
}

export async function getTests() {
  const { data } = await axiosInstance.get<TestRecord[]>("/api/test");
  return data;
}

export async function createTest(payload: { name: string }) {
  const { data } = await axiosInstance.post<TestRecord>("/api/test", payload);
  return data;
}
