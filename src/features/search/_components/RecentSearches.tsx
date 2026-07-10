"use client";

import { MapPin } from "lucide-react";
import { Button } from "@/_components/ui/button";
import { useRecentSearches } from "../hooks/useRecentSearches";
import { useSearchQuery } from "../hooks/useSearchQuery";
import { RemovableChip } from "./RemovableChip";

/**
 * 최근 검색 기록 칩 목록.
 * - 칩 본문 클릭: 해당 검색어로 다시 검색한다.
 * - 칩 × : 해당 기록만 삭제한다.
 * 기록이 없으면 렌더링하지 않는다.
 */
export function RecentSearches() {
  const { items, add, remove, clear } = useRecentSearches();
  const { setQuery } = useSearchQuery();

  if (items.length === 0) return null;

  const handleSelect = (term: string) => {
    setQuery(term);
    add(term); // 최근 검색으로 다시 끌어올린다.
  };

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">
          최근 검색 기록
        </h2>
        <Button variant="ghost" size="xs" onClick={clear}>
          전체 삭제
        </Button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {items.map((term) => (
          <li key={term}>
            <RemovableChip
              label={term}
              icon={MapPin}
              onSelect={() => handleSelect(term)}
              onRemove={() => remove(term)}
              removeLabel={`${term} 검색 기록 삭제`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
