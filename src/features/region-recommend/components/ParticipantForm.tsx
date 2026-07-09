"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MAX_PARTICIPANTS, MIN_PARTICIPANTS } from "../constants/config";
import {
  recommendFormSchema,
  type RecommendFormValues,
} from "../schemas/participant";
import type { RecommendInput } from "../types";
import { toOrigins } from "../utils/origins";
import { ParticipantRow } from "./ParticipantRow";

/** 0 → "나", 1 → "친구 A", 2 → "친구 B" … */
function participantLabel(index: number): string {
  return index === 0 ? "나" : `친구 ${String.fromCharCode(64 + index)}`;
}

function emptyRow() {
  return { id: crypto.randomUUID(), label: "", stationId: null };
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

  const submit = handleSubmit((values) =>
    onSubmit(toOrigins(values.participants)),
  );

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
                canRemove={fields.length > MIN_PARTICIPANTS}
                onChange={onChange}
                onRemove={() => remove(index)}
              />
            )}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        disabled={fields.length >= MAX_PARTICIPANTS}
        onClick={() => append(emptyRow())}
        className="w-full"
      >
        <Plus />
        참여자 추가
      </Button>

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
