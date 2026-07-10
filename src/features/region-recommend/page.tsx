"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FooterNav } from "@/components/FooterNav";
import { ErrorBoundary } from "react-error-boundary";
import { SectionErrorFallback } from "@/components/SectionErrorFallback";
import { ParticipantForm } from "./components/ParticipantForm";
import { RecommendResultCard } from "./components/RecommendResultCard";
import { RecommendSkeleton } from "./components/RecommendSkeleton";
import { RegionHeader } from "./components/RegionHeader";
import { RegionMap } from "./components/RegionMap";
import { RestaurantList } from "./components/RestaurantList";
import { useRegionRecommendMutation } from "./hooks/useRegionRecommendMutation";
import type { RecommendInput } from "./types";

export function RegionRecommendPage() {
  const router = useRouter();
  const [input, setInput] = useState<RecommendInput | null>(null);
  const { data, error, isPending, mutate, reset } =
    useRegionRecommendMutation();

  const result = data?.result;

  const handleSubmit = (nextInput: RecommendInput) => {
    setInput(nextInput);
    mutate(nextInput);
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-1 flex-col gap-6">
      <RegionHeader onBack={() => router.back()} />
      <p className="px-4 text-sm text-muted-foreground">
        각자 가까운 역을 선택하면, 최적의 만남 장소를 추천해드려요!
      </p>

      <ParticipantForm
        isPending={isPending}
        onSubmit={handleSubmit}
      />

      <ErrorBoundary FallbackComponent={SectionErrorFallback} onReset={reset}>
        {error && <MutationError error={error} />}
        {isPending && <RecommendSkeleton />}
        {result && input && (
          <div className="flex flex-col gap-4">
            <RecommendResultCard zone={result.recommended} />
            <RegionMap origins={input.origins} recommended={result.recommended} />
            {result.restaurants.length > 0 && (
              <RestaurantList
                zoneName={result.recommended.name}
                restaurants={result.restaurants}
              />
            )}
          </div>
        )}
      </ErrorBoundary>
      <div className="mt-auto pt-4">
        <FooterNav />
      </div>
    </main>
  );
}

function MutationError({ error }: { error: Error }): React.ReactNode {
  throw error;
}
