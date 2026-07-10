"use client";

import { useTransition } from "react";
import { parseAsString, useQueryState } from "nuqs";

/**
 * 검색어를 URL Query(`q`)와 동기화한다.
 * 새로고침 · 공유 시에도 검색 상태가 유지된다.
 * nuqs에 startTransition을 넘겨 URL 반영을 transition으로 처리한다.
 * (직접 startTransition으로 감싸면 query가 이전 값으로 잠깐 바운스해 입력창이 깜빡인다)
 */
export function useSearchQuery() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true, startTransition }),
  );

  return { query, setQuery, isPending };
}
