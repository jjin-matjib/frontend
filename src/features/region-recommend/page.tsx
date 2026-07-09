"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ParticipantForm } from "./components/ParticipantForm";
import { RecommendResultCard } from "./components/RecommendResultCard";
import { RecommendSkeleton } from "./components/RecommendSkeleton";
import { RegionHeader } from "./components/RegionHeader";
import { RegionMap } from "./components/RegionMap";
import { RestaurantList } from "./components/RestaurantList";
import { useRegionRecommendQuery } from "./hooks/useRegionRecommendQuery";
import type { RecommendInput } from "./types";

export function RegionRecommendPage() {
  const router = useRouter();
  const [input, setInput] = useState<RecommendInput | null>(null);
  const { data, isPending, isError, isFetching, refetch } =
    useRegionRecommendQuery(input);

  const submitted = input !== null;
  const participantCount =
    input?.origins.reduce((sum, origin) => sum + origin.weight, 0) ?? 0;
  const result = data?.result;

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 pb-10">
      <RegionHeader onBack={() => router.back()} />
      <p className="px-4 text-sm text-muted-foreground">
        각자 가까운 역을 선택하면, 최적의 만남 장소를 추천해드려요!
      </p>

      <ParticipantForm
        isPending={submitted && isFetching}
        onSubmit={setInput}
      />

      {submitted && isPending && <RecommendSkeleton />}

      {submitted && isError && (
        <div className="flex flex-col items-center gap-3 px-4 py-10">
          <p className="text-sm leading-5 text-muted-foreground">
            권역을 추천하지 못했습니다.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            다시 시도
          </Button>
        </div>
      )}

      {result && input && (
        <div className="flex flex-col gap-4">
          {data.mock && (
            <p className="mx-4 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              API 키가 없어 <strong>더미 데이터</strong>로 계산한 결과입니다.
              `.env.local`에 키를 넣으면 실제 이동시간·맛집으로 바뀝니다.
            </p>
          )}
          <RecommendResultCard
            zone={result.recommended}
            participantCount={participantCount}
          />
          <RegionMap origins={input.origins} recommended={result.recommended} />
          {result.restaurants.length > 0 && (
            <RestaurantList
              zoneName={result.recommended.name}
              restaurants={result.restaurants}
            />
          )}
        </div>
      )}
    </main>
  );
}
