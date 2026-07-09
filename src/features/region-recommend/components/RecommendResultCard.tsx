"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { ChevronDown, Clock, Utensils } from "lucide-react";
import type { RankedZone } from "../types";

interface Props {
  zone: RankedZone;
  participantCount: number;
}

export function RecommendResultCard({ zone, participantCount }: Props) {
  return (
    <section className="flex flex-col gap-4 px-4">
      <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <span className="w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          추천 장소
        </span>

        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">{zone.name} 주변</h2>
          <p className="text-sm text-muted-foreground">
            선택한 {participantCount}명의 평균 이동 시간이 가장 짧아요!
          </p>
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-4" />평균 {zone.weightedMeanMinutes}분
          </span>
          <span className="inline-flex items-center gap-1">
            <Utensils className="size-4" />맛집 {zone.goodRestaurantCount}곳
          </span>
        </div>

        <Collapsible.Root>
          <Collapsible.Trigger className="group flex items-center gap-1 text-sm font-medium text-primary outline-none">
            상세 근거 보기
            <ChevronDown className="size-4 transition-transform group-data-[panel-open]:rotate-180" />
          </Collapsible.Trigger>
          <Collapsible.Panel>
            <ul className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              {zone.perOrigin.map((origin) => (
                <li
                  key={origin.stationId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {origin.label}
                    {origin.weight > 1 ? ` · ${origin.weight}명` : ""}
                  </span>
                  <span className="font-medium">{origin.minutes}분</span>
                </li>
              ))}
              <li className="flex items-center justify-between border-t border-border pt-2 text-sm">
                <span className="text-muted-foreground">이동시간 편차</span>
                <span className="font-medium">{zone.spreadMinutes}분</span>
              </li>
            </ul>
          </Collapsible.Panel>
        </Collapsible.Root>
      </div>
    </section>
  );
}
