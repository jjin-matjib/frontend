"use client";

import { useCallback, useMemo } from "react";
import { parseAsStringLiteral, useQueryStates } from "nuqs";
import {
  CATEGORY_OPTIONS,
  CATEGORY_VALUES,
  DISTANCE_OPTIONS,
  DISTANCE_VALUES,
  OPEN_STATUS_OPTIONS,
  OPEN_STATUS_VALUES,
  SORT_OPTIONS,
  SORT_VALUES,
} from "../constants/filters";
import type { FilterGroup, SearchFilters } from "../types";

const filterParsers = {
  category: parseAsStringLiteral(CATEGORY_VALUES),
  distance: parseAsStringLiteral(DISTANCE_VALUES),
  open: parseAsStringLiteral(OPEN_STATUS_VALUES),
  sort: parseAsStringLiteral(SORT_VALUES),
};

const EMPTY_FILTERS = {
  category: null,
  distance: null,
  open: null,
  sort: null,
} satisfies SearchFilters;

const OPTIONS_BY_GROUP = {
  category: CATEGORY_OPTIONS,
  distance: DISTANCE_OPTIONS,
  open: OPEN_STATUS_OPTIONS,
  sort: SORT_OPTIONS,
} as const;

export type AppliedFilter = {
  group: FilterGroup;
  value: string;
  label: string;
};

/**
 * 카테고리 · 거리 · 영업 여부 · 정렬 필터를 URL Query와 동기화한다.
 * 각 그룹은 단일 선택이며, 미선택 시 null(파라미터 없음)이다.
 */
export function useSearchFilters() {
  const [filters, setFilters] = useQueryStates(filterParsers, {
    clearOnDefault: true,
  });

  const setFilter = useCallback(
    <G extends FilterGroup>(group: G, value: SearchFilters[G]) => {
      setFilters({ [group]: value } as Partial<SearchFilters>);
    },
    [setFilters],
  );

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, [setFilters]);

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((value) => value !== null),
    [filters],
  );

  /** 적용된 필터를 칩 렌더링용 목록으로 변환한다. */
  const appliedFilters = useMemo<AppliedFilter[]>(() => {
    const groups: FilterGroup[] = ["category", "distance", "open", "sort"];
    return groups.flatMap((group) => {
      const value = filters[group];
      if (value === null) return [];
      const option = OPTIONS_BY_GROUP[group].find((o) => o.value === value);
      return option ? [{ group, value, label: option.label }] : [];
    });
  }, [filters]);

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
    hasActiveFilters,
    appliedFilters,
  };
}
