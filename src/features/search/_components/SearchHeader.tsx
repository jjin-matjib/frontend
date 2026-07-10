"use client";

import { useState } from "react";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { useSearchQuery } from "../hooks/useSearchQuery";
import { AppliedFilters } from "./AppliedFilters";
import { FilterSheet } from "./FilterSheet";
import { RecentSearches } from "./RecentSearches";
import { SearchBar } from "./SearchBar";

/**
 * 검색 화면 상단 영역: 검색바 · 필터 · 초기화 · 최근 검색 기록.
 * - 필터가 적용돼 있으면 적용된 필터를 보여준다.
 * - 그렇지 않고 검색어가 비어 있으면 최근 검색 기록을 보여준다.
 */
export function SearchHeader() {
  const [filterOpen, setFilterOpen] = useState(false);
  const { query } = useSearchQuery();
  const { hasActiveFilters } = useSearchFilters();

  return (
    <div className="flex shrink-0 flex-col gap-3 px-4 py-3">
      <SearchBar onOpenFilter={() => setFilterOpen(true)} />

      <SearchHeaderContent
        hasActiveFilters={hasActiveFilters}
        query={query}
        onEditFilter={() => setFilterOpen(true)}
      />

      <FilterSheet open={filterOpen} onOpenChange={setFilterOpen} />
    </div>
  );
}

function SearchHeaderContent({ hasActiveFilters, query, onEditFilter }: {
  hasActiveFilters: boolean;
  query: string;
  onEditFilter: () => void;
}) {
  if (hasActiveFilters) return <AppliedFilters onEditFilter={onEditFilter} />;
  if (query) return null;
  return <RecentSearches />;
}
