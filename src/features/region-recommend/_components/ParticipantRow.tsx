"use client";

import { Minus, TrainFront } from "lucide-react";
import { findStation } from "../constants/stations";
import { LineBadges } from "./LineBadges";
import { StationSelect } from "./StationSelect";

interface Props {
  label: string;
  value: string | null;
  invalid?: boolean;
  canRemove: boolean;
  onChange: (value: string | null) => void;
  onRemove: () => void;
}

export function ParticipantRow({
  label,
  value,
  invalid,
  canRemove,
  onChange,
  onRemove,
}: Props) {
  const selected = value ? findStation(value) : undefined;

  return (
    <div className="flex items-center gap-2">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <TrainFront className="size-4" />
      </div>
      <span className="w-12 shrink-0 text-sm font-medium">{label}</span>
      <div className="min-w-0 flex-1">
        <StationSelect value={value} onChange={onChange} invalid={invalid} />
      </div>
      {selected && <LineBadges lines={selected.lines} />}
      <button
        type="button"
        aria-label={`${label} 삭제`}
        disabled={!canRemove}
        onClick={onRemove}
        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-40"
      >
        <Minus className="size-4" />
      </button>
    </div>
  );
}
