"use client";

import { useState } from "react";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecentSearches } from "../hooks/useRecentSearches";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { useSearchQuery } from "../hooks/useSearchQuery";

type SearchBarProps = {
  onOpenFilter: () => void;
};

/**
 * 검색어 입력 + 필터 열기 + 초기화.
 * - 제출 시 검색어를 URL과 최근 검색 기록에 반영한다.
 * - 초기화는 검색어와 모든 필터를 함께 비운다.
 */
export function SearchBar({ onOpenFilter }: SearchBarProps) {
  const { query, setQuery } = useSearchQuery();
  const { resetFilters } = useSearchFilters();
  const { add } = useRecentSearches();
  const [value, setValue] = useState(query);
  const [prevQuery, setPrevQuery] = useState(query);

  // 최근 검색 칩 클릭 등 외부에서 검색어가 바뀌면 입력창도 동기화한다.
  if (query !== prevQuery) {
    setPrevQuery(query);
    setValue(query);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    setQuery(trimmed);
    if (trimmed) add(trimmed);
  };

  const handleReset = () => {
    setValue("");
    setQuery("");
    resetFilters();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="가게명, 지역, 지하철역 검색"
          aria-label="검색"
          className="h-10 w-full rounded-lg border border-border bg-card pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:appearance-none"
        />
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onOpenFilter}
        aria-label="필터 열기"
      >
        <SlidersHorizontal className="text-primary" />
      </Button>

      <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
        <RotateCcw className="text-primary" />
        초기화
      </Button>
    </form>
  );
}
