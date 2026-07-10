import axios, { AxiosError } from "axios";

interface ApiErrorBody {
  error?: string;
  message?: string;
}

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 15_000,
});

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorBody | undefined;
    return data?.error ?? data?.message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}
