"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="ko">
      <body>
        <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="text-lg font-semibold">
            서비스를 불러오지 못했습니다
          </h1>
          <p className="text-sm text-muted-foreground">
            잠시 후 다시 시도해 주세요.
          </p>
          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            onClick={reset}
          >
            다시 시도
          </button>
        </main>
      </body>
    </html>
  );
}
