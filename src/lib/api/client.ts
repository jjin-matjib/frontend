import axios, { AxiosError } from "axios";

interface ApiErrorBody {
  error?: string;
  message?: string;
}

// useSuspenseQuery는 SSR 중에도 queryFn을 실행하므로,
// 서버에서는 상대 경로("/api")가 아닌 절대 URL이 필요하다.
const baseURL =
  typeof window === "undefined"
    ? `http://localhost:${process.env.PORT ?? 3000}/api`
    : "/api";

export const apiClient = axios.create({
  baseURL,
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
