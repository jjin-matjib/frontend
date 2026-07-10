"use client";

import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  findStation,
  STATION_OPTIONS,
  type StationOption,
} from "../constants/stations";
import { LineBadges } from "./LineBadges";

interface Props {
  value: string | null;
  onChange: (value: string | null) => void;
  invalid?: boolean;
}

/** 서울 전 역(600여 개)을 타이핑으로 검색해 고르는 콤보박스. */
export function StationSelect({ value, onChange, invalid }: Props) {
  const selected = value ? (findStation(value) ?? null) : null;

  return (
    <Combobox.Root<StationOption>
      items={STATION_OPTIONS}
      value={selected}
      onValueChange={(next) => onChange(next ? next.value : null)}
      itemToStringLabel={(option) => option.label}
    >
      <div
        className={cn(
          "flex h-10 w-full items-center gap-2 rounded-lg border bg-background px-3 text-sm transition-colors focus-within:ring-2 focus-within:ring-ring/50",
          invalid ? "border-destructive" : "border-border",
        )}
      >
        <Combobox.Input
          placeholder="역 검색"
          aria-label="출발 역 검색"
          className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
        />
        <Combobox.Icon className="text-muted-foreground">
          <ChevronDown className="size-4" />
        </Combobox.Icon>
      </div>

      <Combobox.Portal>
        <Combobox.Positioner className="z-(--z-dropdown) w-(--anchor-width) outline-none" sideOffset={4}>
          <Combobox.Popup className="max-h-64 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-sm text-popover-foreground shadow-lg">
            <Combobox.Empty className="px-3 py-2 text-muted-foreground">
              일치하는 역이 없어요
            </Combobox.Empty>
            <Combobox.List>
              {(option: StationOption) => (
                <Combobox.Item
                  key={option.value}
                  value={option}
                  className="flex cursor-default items-center justify-between gap-2 rounded-md px-3 py-2 outline-none data-[highlighted]:bg-muted"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <LineBadges lines={option.lines} />
                    <span className="truncate">{option.label}</span>
                  </span>
                  <Combobox.ItemIndicator>
                    <Check className="size-4 text-primary" />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
