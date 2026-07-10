"use client";

import { Drawer } from "@base-ui/react/drawer";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/_components/ui/button";
import { cn } from "@/lib/utils";
import {
  CATEGORY_OPTIONS,
  DISTANCE_OPTIONS,
  OPEN_STATUS_OPTIONS,
  SORT_OPTIONS,
  type FilterOption,
} from "../constants/filters";
import { useSearchFilters } from "../hooks/useSearchFilters";
import type { FilterGroup, SearchFilters } from "../types";

const EMPTY_DRAFT: SearchFilters = {
  category: null,
  distance: null,
  open: null,
  sort: null,
};

type FilterSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FILTER_GROUPS = [
  { group: "category", title: "카테고리", options: CATEGORY_OPTIONS },
  { group: "distance", title: "거리", options: DISTANCE_OPTIONS },
  { group: "open", title: "영업 여부", options: OPEN_STATUS_OPTIONS },
  { group: "sort", title: "정렬", options: SORT_OPTIONS },
] satisfies readonly {
  group: FilterGroup;
  title: string;
  options: readonly FilterOption<string>[];
}[];

/**
 * 카테고리 · 거리 · 영업 여부 · 정렬을 선택하는 필터 바텀시트.
 * 선택은 draft(로컬)에 담아 두고 "적용하기"를 눌러야 URL 필터에 반영된다.
 */
export function FilterSheet({ open, onOpenChange }: FilterSheetProps) {
  const { filters, setFilters } = useSearchFilters();
  const [draft, setDraft] = useState<SearchFilters>(filters);
  const [prevOpen, setPrevOpen] = useState(open);

  // 시트가 닫힘→열림으로 바뀌는 순간, 현재 적용된 필터로 draft를 초기화한다.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setDraft(filters);
  }

  const toggle = (group: FilterGroup, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [group]: prev[group] === value ? null : value,
    }) as SearchFilters);
  };

  const handleApply = () => {
    setFilters(draft);
    onOpenChange(false);
  };

  return (
    <Drawer.Root open={open} onOpenChange={(next) => onOpenChange(next)}>
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-(--z-overlay) bg-black/40 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Drawer.Viewport className="pointer-events-none fixed inset-0 z-(--z-modal) flex items-end justify-center">
          <Drawer.Popup className="pointer-events-auto flex max-h-[85dvh] w-full sm:max-w-[375px] flex-col rounded-t-3xl border-t border-border bg-background pb-[env(safe-area-inset-bottom)] transition-transform data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full">
            <div
              aria-hidden
              className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-border"
            />
            <div className="flex items-center justify-between px-5 pt-3 pb-2">
              <Drawer.Title className="text-lg font-semibold">필터</Drawer.Title>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto px-5 pb-4">
              {FILTER_GROUPS.map(({ group, title, options }) => (
                <OptionGroup
                  key={group}
                  title={title}
                  options={options}
                  selected={draft[group]}
                  onToggle={(value) => toggle(group, value)}
                />
              ))}
            </div>

            <div className="flex gap-2 border-t border-border px-5 py-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setDraft(EMPTY_DRAFT)}
              >
                초기화
              </Button>
              <Button size="lg" className="flex-[2]" onClick={handleApply}>
                적용하기
              </Button>
            </div>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

type OptionGroupProps = {
  title: string;
  options: readonly FilterOption<string>[];
  selected: string | null;
  onToggle: (value: string) => void;
};

function OptionGroup({
  title,
  options,
  selected,
  onToggle,
}: OptionGroupProps) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-2.5 text-sm font-medium text-muted-foreground">
        {title}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <OptionChip
            key={option.value}
            label={option.label}
            icon={option.icon}
            selected={selected === option.value}
            onClick={() => onToggle(option.value)}
          />
        ))}
      </div>
    </fieldset>
  );
}

type OptionChipProps = {
  label: string;
  icon?: LucideIcon;
  selected: boolean;
  onClick: () => void;
};

function OptionChip({ label, icon: Icon, selected, onClick }: OptionChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        selected
          ? "border-primary bg-primary/10 font-medium text-primary"
          : "border-border bg-background text-foreground hover:bg-muted",
      )}
    >
      {Icon ? <Icon className="size-4" /> : null}
      {label}
    </button>
  );
}
