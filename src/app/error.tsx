"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <AlertCircle className="size-8 text-destructive" />
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">화면을 불러오지 못했습니다</h1>
        <p className="text-sm leading-5 text-muted-foreground">
          {error.message || "예상하지 못한 오류가 발생했습니다."}
        </p>
      </div>
      <Button onClick={reset}>
        <RotateCcw />
        다시 시도
      </Button>
    </main>
  );
}
