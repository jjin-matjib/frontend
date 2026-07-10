"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/_components/ui/button";
import { useErrorModalStore } from "@/stores/errorModalStore";

export function GlobalErrorModal() {
  const message = useErrorModalStore((state) => state.message);
  const close = useErrorModalStore((state) => state.close);

  if (!message) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-(--z-modal) flex items-center justify-center bg-black/40 px-[15px]"
      onMouseDown={close}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="global-error-title"
        aria-describedby="global-error-description"
        className="flex w-full max-w-[345px] flex-col gap-4 rounded-lg border border-border bg-background p-5 shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
          <div className="flex min-w-0 flex-col gap-1">
            <h2 id="global-error-title" className="font-semibold">
              요청을 완료하지 못했습니다
            </h2>
            <p
              id="global-error-description"
              className="break-words text-sm leading-5 text-muted-foreground"
            >
              {message}
            </p>
          </div>
        </div>
        <Button onClick={close}>확인</Button>
      </section>
    </div>
  );
}
