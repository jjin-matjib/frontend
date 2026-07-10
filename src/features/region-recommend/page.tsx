"use client";

import { useRouter } from "next/navigation";
import { FooterNav } from "@/components/FooterNav";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import { SectionErrorFallback } from "@/components/SectionErrorFallback";
import { ParticipantForm } from "./components/ParticipantForm";
import { RecommendResultCard } from "./components/RecommendResultCard";
import { RecommendSkeleton } from "./components/RecommendSkeleton";
import { RegionHeader } from "./components/RegionHeader";
import { RegionMap } from "./components/RegionMap";
import { RestaurantList } from "./components/RestaurantList";
import { useRegionRecommendMutation } from "./hooks/useRegionRecommendMutation";

export function RegionRecommendPage() {
  const router = useRouter();
  const mutation = useRegionRecommendMutation();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-1 flex-col gap-6">
      <RegionHeader onBack={() => router.back()} />
      <p className="px-4 text-sm text-muted-foreground">
        각자 가까운 역을 선택하면, 최적의 만남 장소를 추천해드려요!
      </p>

      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <SectionErrorFallback
            error={error}
            resetErrorBoundary={resetErrorBoundary}
            isRetrying={mutation.isPending}
            onRetry={() => {
              if (!mutation.variables) {
                resetErrorBoundary();
                return;
              }
              mutation.mutate(mutation.variables, {
                onSuccess: resetErrorBoundary,
              });
            }}
          />
        )}
      >
        <RegionRecommendSection mutation={mutation} />
      </ErrorBoundary>
      <div className="mt-auto pt-4">
        <FooterNav />
      </div>
    </main>
  );
}

type RegionMutation = ReturnType<typeof useRegionRecommendMutation>;

function RegionRecommendSection({ mutation }: { mutation: RegionMutation }) {
  const { showBoundary } = useErrorBoundary();
  const { data, isPending, mutate, variables } = mutation;
  const result = data?.result;

  return (
    <section className="flex flex-col gap-6">
      <ParticipantForm
        isPending={isPending}
        onSubmit={(input) =>
          mutate(input, { onError: (error) => showBoundary(error) })
        }
      />

      {isPending && <RecommendSkeleton />}
      {result && variables && (
        <div className="flex flex-col gap-4">
          <RecommendResultCard zone={result.recommended} />
          <RegionMap
            origins={variables.origins}
            recommended={result.recommended}
          />
          {result.restaurants.length > 0 && (
            <RestaurantList
              zoneName={result.recommended.name}
              restaurants={result.restaurants}
            />
          )}
        </div>
      )}
    </section>
  );
}
