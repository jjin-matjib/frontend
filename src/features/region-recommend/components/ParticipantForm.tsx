"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { findStation } from "../constants/stations";
import {
  recommendFormSchema,
  type RecommendFormValues,
} from "../schemas/participant";
import type { RecommendInput, RecommendOrigin } from "../types";
import { ParticipantRow } from "./ParticipantRow";

const MIN_PARTICIPANTS = 2;
const MAX_PARTICIPANTS = 6;

/** 0 → "나", 1 → "친구 A", 2 → "친구 B" … */
function participantLabel(index: number): string {
  return index === 0 ? "나" : `친구 ${String.fromCharCode(64 + index)}`;
}

function emptyRow() {
  return { id: crypto.randomUUID(), label: "", stationId: null };
}

/** 참여자들을 역 단위로 합쳐 인원 가중 출발지로 만든다. */
function toOrigins(values: RecommendFormValues): RecommendInput {
  const byStation = new Map<string, RecommendOrigin>();
  for (const row of values.participants) {
    if (!row.stationId) continue;
    const station = findStation(row.stationId);
    if (!station) continue;
    const existing = byStation.get(station.value);
    if (existing) {
      existing.weight += 1;
    } else {
      byStation.set(station.value, {
        stationId: station.value,
        label: station.label,
        lat: station.lat,
        lng: station.lng,
        weight: 1,
      });
    }
  }
  return { origins: [...byStation.values()] };
}

interface Props {
  isPending: boolean;
  onSubmit: (input: RecommendInput) => void;
}

export function ParticipantForm({ isPending, onSubmit }: Props) {
  const { control, handleSubmit, formState } = useForm<RecommendFormValues>({
    resolver: zodResolver(recommendFormSchema),
    defaultValues: {
      participants: [emptyRow(), emptyRow()],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  const submit = handleSubmit((values) => onSubmit(toOrigins(values)));

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 px-4">
      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <Controller
            key={field.id}
            control={control}
            name={`participants.${index}.stationId`}
            render={({ field: { value, onChange } }) => (
              <ParticipantRow
                label={participantLabel(index)}
                value={value}
                invalid={formState.isSubmitted && !value}
                canAdd={fields.length < MAX_PARTICIPANTS}
                canRemove={fields.length > MIN_PARTICIPANTS}
                onChange={onChange}
                onAdd={() => append(emptyRow())}
                onRemove={() => remove(index)}
              />
            )}
          />
        ))}
      </div>

      {formState.errors.participants?.message && (
        <p className="text-sm text-destructive">
          {formState.errors.participants.message}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="h-12 w-full text-base"
      >
        {isPending ? "추천 중…" : "추천받기"}
      </Button>
    </form>
  );
}
