import { LoaderCircle } from 'lucide-react';

/** 검색 결과 Suspense fallback — 가운데 스피너. */
export function SearchPending() {
  return (
    <div className="flex flex-1 items-center justify-center" aria-label="검색 중">
      <LoaderCircle className="size-6 animate-spin text-primary" />
    </div>
  );
}
