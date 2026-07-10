"use client";

import { Suspense, useRef, useState } from "react";
import { LoaderCircle, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/_components/ui/button";
import { useRecentSearches } from "../hooks/useRecentSearches";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { useSearchQuery } from "../hooks/useSearchQuery";
import { useSearchAutocomplete } from "../hooks/useSearchAutocomplete";

const SUGGESTION_DEBOUNCE_MS = 300;

type SearchBarProps = {
  onOpenFilter: () => void;
};

/**
 * 검색어 입력 + 필터 열기 + 초기화.
 * - 제출 시 검색어를 URL과 최근 검색 기록에 반영한다.
 * - 초기화는 검색어와 모든 필터를 함께 비운다.
 */
export function SearchBar({ onOpenFilter }: SearchBarProps) {
  const { query, setQuery, isPending } = useSearchQuery();
  const { resetFilters } = useSearchFilters();
  const { add } = useRecentSearches();
  const [value, setValue] = useState(query);
  const [prevQuery, setPrevQuery] = useState(query);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // 최근 검색 칩 클릭 등 외부에서 검색어가 바뀌면 입력창도 동기화한다.
  if (query !== prevQuery) {
    setPrevQuery(query);
    setValue(query);
    setDebouncedValue(query.trim());
  }

  const submit = (nextValue: string) => {
    const trimmed = nextValue.trim();
    clearTimeout(debounceTimerRef.current);
    setValue(trimmed);
    setDebouncedValue(trimmed);
    setQuery(trimmed);
    if (trimmed) add(trimmed);
    setSuggestionsOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setValue(next);
    setSuggestionsOpen(true);
    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(
      () => setDebouncedValue(next.trim()),
      SUGGESTION_DEBOUNCE_MS,
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submit(value);
  };

  const handleReset = () => {
    clearTimeout(debounceTimerRef.current);
    setValue("");
    setDebouncedValue("");
    setQuery("");
    resetFilters();
    setSuggestionsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative min-w-0 flex-1">
        {isPending ? (
          <LoaderCircle className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 animate-spin text-primary" />
        ) : (
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <input
          type="search"
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onBlur={() => setTimeout(() => setSuggestionsOpen(false), 150)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setSuggestionsOpen(false);
          }}
          placeholder="가게명, 지역, 지하철역 검색"
          aria-label="검색"
          className="h-10 w-full rounded-lg border border-border bg-card pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:appearance-none"
        />
        {suggestionsOpen && debouncedValue.length >= 2 && (
          <Suspense fallback={<SuggestionsPending />}>
            <Suggestions input={debouncedValue} onSelect={submit} />
          </Suspense>
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

function SuggestionsPending() {
  return (
    <div className="absolute top-full right-0 left-0 z-50 mt-1 flex justify-center rounded-lg border border-border bg-card py-3 shadow-md">
      <LoaderCircle className="size-4 animate-spin text-primary" />
    </div>
  );
}

function Suggestions({ input, onSelect }: { input: string; onSelect: (value: string) => void }) {
  const suggestions = useSearchAutocomplete(input);
  if (suggestions.length === 0) return null;

  return (
    <ul className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-border bg-card shadow-md">
      {suggestions.map((suggestion) => (
        <li key={suggestion.placeId}>
          <button
            type="button"
            className="flex w-full flex-col px-3 py-2.5 text-left hover:bg-muted"
            onMouseDown={(event) => {
              event.preventDefault();
              onSelect(suggestion.mainText || suggestion.text);
            }}
          >
            <span className="truncate text-sm font-medium">{suggestion.mainText}</span>
            {suggestion.secondaryText && (
              <span className="truncate text-xs text-muted-foreground">
                {suggestion.secondaryText}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
