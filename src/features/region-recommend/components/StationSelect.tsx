"use client";

import { Select } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { findStation, STATION_OPTIONS } from "../constants/stations";

interface Props {
  value: string | null;
  onChange: (value: string | null) => void;
  invalid?: boolean;
}

export function StationSelect({ value, onChange, invalid }: Props) {
  return (
    <Select.Root value={value} onValueChange={(next) => onChange(next)}>
      <Select.Trigger
        aria-label="출발 역 선택"
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-lg border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 data-[popup-open]:border-primary",
          invalid ? "border-destructive" : "border-border",
        )}
      >
        <Select.Value placeholder="역 선택">
          {(current: string | null) =>
            current ? (findStation(current)?.label ?? "역 선택") : "역 선택"
          }
        </Select.Value>
        <Select.Icon className="text-muted-foreground">
          <ChevronDown className="size-4" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className="z-(--z-dropdown) outline-none" sideOffset={4}>
          <Select.Popup className="max-h-64 min-w-40 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-sm text-popover-foreground shadow-lg">
            {STATION_OPTIONS.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                className="flex cursor-default items-center justify-between gap-2 rounded-md px-3 py-2 outline-none data-[highlighted]:bg-muted"
              >
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check className="size-4 text-primary" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
