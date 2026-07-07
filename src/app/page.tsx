import { Suspense } from "react";
import { SearchHeader } from "@/features/search";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-4">
      <header>
        <h1 className="text-xl font-bold">MapBridge</h1>
        <p className="text-sm text-muted-foreground">Google Maps 기반</p>
      </header>

      <Suspense fallback={<div className="h-10" />}>
        <SearchHeader />
      </Suspense>

      {/* 검색 결과 · 리스트/지도 영역은 다른 파트에서 구현한다. */}
      <section className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
        검색 결과 영역
      </section>
    </main>
  );
}
