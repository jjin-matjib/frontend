"use client";

import { parseAsString, useQueryState } from "nuqs";

/**
 * 검색어를 URL Query(`q`)와 동기화한다.
 * 새로고침 · 공유 시에도 검색 상태가 유지된다.
 */
export function useSearchQuery() {
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  );

  return { query, setQuery };
}
