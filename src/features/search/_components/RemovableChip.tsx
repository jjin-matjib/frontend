"use client";

import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type RemovableChipProps = {
  label: string;
  onSelect?: () => void;
  onRemove: () => void;
  removeLabel: string;
  icon?: LucideIcon;
  className?: string;
};

/**
 * 라벨 + 삭제(×) 버튼으로 구성된 칩. 최근 검색 기록과 적용된 필터에서 공통으로 사용한다.
 * 본문 클릭(onSelect)과 삭제(onRemove) 영역을 분리해 각각 버튼으로 노출한다.
 */
export function RemovableChip({
  label,
  onSelect,
  onRemove,
  removeLabel,
  icon: Icon,
  className,
}: RemovableChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-card py-1 pr-1 pl-2.5 text-sm text-foreground",
        className,
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        disabled={!onSelect}
        className="inline-flex items-center gap-1 outline-none disabled:cursor-default"
      >
        {Icon ? <Icon className="size-3.5 text-primary" /> : null}
        {label}
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className="inline-flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <X className="size-3.5" />
      </button>
    </span>
  );
}
