"use client";

import { useRef, useState } from "react";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecentSearches } from "../hooks/useRecentSearches";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { useSearchQuery } from "../hooks/useSearchQuery";
import {
  type SearchSuggestion,
  useSearchAutocomplete,
} from "../hooks/useSearchAutocomplete";

type SearchBarProps = {
  onOpenFilter: () => void;
  mockSuggestions?: SearchSuggestion[];
};

/**
 * 검색어 입력 + 필터 열기 + 초기화.
 * - 제출 시 검색어를 URL과 최근 검색 기록에 반영한다.
 * - 초기화는 검색어와 모든 필터를 함께 비운다.
 */
export function SearchBar({ onOpenFilter, mockSuggestions }: SearchBarProps) {
  const { query, setQuery } = useSearchQuery();
  const { resetFilters } = useSearchFilters();
  const { add } = useRecentSearches();
  const [value, setValue] = useState(query);
  const [prevQuery, setPrevQuery] = useState(query);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const apiSuggestions = useSearchAutocomplete(value, !!mockSuggestions);
  const suggestions = mockSuggestions
    ? mockSuggestions.filter((suggestion) =>
        suggestion.mainText.toLowerCase().includes(value.toLowerCase()),
      )
    : apiSuggestions;

  // 최근 검색 칩 클릭 등 외부에서 검색어가 바뀌면 입력창도 동기화한다.
  if (query !== prevQuery) {
    setPrevQuery(query);
    setValue(query);
  }

  const submit = (nextValue: string) => {
    const trimmed = nextValue.trim();
    setValue(trimmed);
    setQuery(trimmed);
    if (trimmed) add(trimmed);
    setSuggestionsOpen(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submit(value);
  };

  const handleReset = () => {
    setValue("");
    setQuery("");
    resetFilters();
    setSuggestionsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          ref={inputRef}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setSuggestionsOpen(true);
          }}
          onBlur={() => setTimeout(() => setSuggestionsOpen(false), 150)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setSuggestionsOpen(false);
          }}
          placeholder="가게명, 지역, 지하철역 검색"
          aria-label="검색"
          className="h-10 w-full rounded-lg border border-border bg-card pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:appearance-none"
        />
        {suggestionsOpen && suggestions.length > 0 && (
          <ul className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-border bg-card shadow-md">
            {suggestions.map((suggestion) => (
              <li key={suggestion.placeId}>
                <button
                  type="button"
                  className="flex w-full flex-col px-3 py-2.5 text-left hover:bg-muted"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    submit(suggestion.mainText || suggestion.text);
                  }}
                >
                  <span className="truncate text-sm font-medium">
                    {suggestion.mainText}
                  </span>
                  {suggestion.secondaryText && (
                    <span className="truncate text-xs text-muted-foreground">
                      {suggestion.secondaryText}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
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
