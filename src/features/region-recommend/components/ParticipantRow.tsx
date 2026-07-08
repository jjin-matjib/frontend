"use client";

import { Minus, Plus, TrainFront } from "lucide-react";
import { cn } from "@/lib/utils";
import { StationSelect } from "./StationSelect";

interface Props {
  label: string;
  value: string | null;
  invalid?: boolean;
  canAdd: boolean;
  canRemove: boolean;
  onChange: (value: string | null) => void;
  onAdd: () => void;
  onRemove: () => void;
}

export function ParticipantRow({
  label,
  value,
  invalid,
  canAdd,
  canRemove,
  onChange,
  onAdd,
  onRemove,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <TrainFront className="size-4" />
      </div>
      <span className="w-12 shrink-0 text-sm font-medium">{label}</span>
      <div className="flex-1">
        <StationSelect value={value} onChange={onChange} invalid={invalid} />
      </div>
      <RoundButton label={`${label} 추가`} disabled={!canAdd} onClick={onAdd} variant="add">
        <Plus className="size-4" />
      </RoundButton>
      <RoundButton
        label={`${label} 삭제`}
        disabled={!canRemove}
        onClick={onRemove}
        variant="remove"
      >
        <Minus className="size-4" />
      </RoundButton>
    </div>
  );
}

interface RoundButtonProps {
  label: string;
  disabled: boolean;
  variant: "add" | "remove";
  onClick: () => void;
  children: React.ReactNode;
}

function RoundButton({
  label,
  disabled,
  variant,
  onClick,
  children,
}: RoundButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-40",
        variant === "add"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border border-border text-muted-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
