"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ParticipantForm } from "./components/ParticipantForm";
import { RecommendResultCard } from "./components/RecommendResultCard";
import { RecommendSkeleton } from "./components/RecommendSkeleton";
import { RegionHeader } from "./components/RegionHeader";
import { RegionMap } from "./components/RegionMap";
import { useRegionRecommendQuery } from "./hooks/useRegionRecommendQuery";
import type { RecommendInput } from "./types";

// 개발/데모에서는 외부 API를 호출하지 않는다(비용 0). 실 API는 production 빌드에서 동작.
const USE_MOCK = process.env.NODE_ENV !== "production";

export function RegionRecommendPage() {
  const router = useRouter();
  const [input, setInput] = useState<RecommendInput | null>(null);
  const { data, isPending, isError, isFetching, refetch } =
    useRegionRecommendQuery(input, USE_MOCK);

  const submitted = input !== null;
  const participantCount =
    input?.origins.reduce((sum, origin) => sum + origin.weight, 0) ?? 0;

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

      {data && input && (
        <div className="flex flex-col gap-4">
          <RecommendResultCard
            zone={data.recommended}
            participantCount={participantCount}
          />
          <RegionMap origins={input.origins} recommended={data.recommended} />
        </div>
      )}
    </main>
  );
}
