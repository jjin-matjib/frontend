"use client";

import { Button } from "@/components/ui/button";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { RemovableChip } from "./RemovableChip";

type AppliedFiltersProps = {
  onEditFilter: () => void;
};

/**
 * 현재 적용된 필터를 칩으로 보여준다.
 * - 필터 수정: 필터 바텀시트를 연다.
 * - 칩 × : 해당 그룹 필터만 해제한다.
 * - 모든 필터 해제: 필터만 초기화한다(검색어는 유지).
 * 적용된 필터가 없으면 렌더링하지 않는다.
 */
export function AppliedFilters({ onEditFilter }: AppliedFiltersProps) {
  const { appliedFilters, setFilter, resetFilters } = useSearchFilters();

  if (appliedFilters.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">적용된 필터</h2>
        <Button variant="ghost" size="xs" onClick={onEditFilter}>
          필터 수정
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {appliedFilters.map((filter) => (
          <RemovableChip
            key={`${filter.group}-${filter.value}`}
            label={filter.label}
            onRemove={() => setFilter(filter.group, null)}
            removeLabel={`${filter.label} 필터 해제`}
          />
        ))}
        <Button variant="ghost" size="xs" onClick={resetFilters}>
          모든 필터 해제
        </Button>
      </div>
    </section>
  );
}
