"use client";

import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
  environmentManager,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getApiErrorMessage } from "@/lib/api/client";
import { useErrorModalStore } from "@/stores/errorModalStore";

function makeQueryClient() {
  return new QueryClient({
    mutationCache: new MutationCache({
      onError: (error) => {
        useErrorModalStore
          .getState()
          .show(getApiErrorMessage(error, "요청 처리 중 오류가 발생했습니다."));
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (environmentManager.isServer()) {
    // 서버에서는 요청 간 캐시가 공유되지 않도록 매번 새로 생성한다.
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
