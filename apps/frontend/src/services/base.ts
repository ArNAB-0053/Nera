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
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TestRecord = {
  id: string;
  name: string;
  createdAt: string;
};

export function getApiErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<ApiFailure>;
  return axiosError.response?.data?.message ?? axiosError.message ?? "Something went wrong";
}
