"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  error: unknown;
  resetErrorBoundary: () => void;
  isRetrying?: boolean;
  onRetry?: () => void;
}

export function SectionErrorFallback({
  error,
  resetErrorBoundary,
  isRetrying = false,
  onRetry = resetErrorBoundary,
}: Props) {
  const message =
    error instanceof Error ? error.message : "예상하지 못한 오류가 발생했습니다.";

  return (
    <section
      role="alert"
      className="mx-4 flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-8 text-center"
    >
      <AlertCircle className="size-6 text-destructive" />
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold">이 영역을 불러오지 못했습니다</h2>
        <p className="text-sm leading-5 text-muted-foreground">
          {message}
        </p>
      </div>
      <Button variant="outline" disabled={isRetrying} onClick={onRetry}>
        <RotateCcw />
        {isRetrying ? "다시 시도 중" : "다시 시도"}
      </Button>
    </section>
  );
}
