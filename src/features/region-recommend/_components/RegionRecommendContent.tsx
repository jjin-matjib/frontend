'use client';

import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';
import { SectionErrorFallback } from '@/_components/SectionErrorFallback';
import { ParticipantForm } from './ParticipantForm';
import { RecommendResultCard } from './RecommendResultCard';
import { RecommendSkeleton } from './RecommendSkeleton';
import { RegionMap } from './RegionMap';
import { RestaurantList } from './RestaurantList';
import { useRegionRecommendMutation } from '../hooks/useRegionRecommendMutation';

export function RegionRecommendContent() {
  const mutation = useRegionRecommendMutation();

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <SectionErrorFallback
          error={error}
          resetErrorBoundary={resetErrorBoundary}
          isRetrying={mutation.isPending}
          onRetry={() => {
            if (!mutation.variables) return resetErrorBoundary();
            mutation.mutate(mutation.variables, { onSuccess: resetErrorBoundary });
          }}
        />
      )}
    >
      <RegionRecommendSection mutation={mutation} />
    </ErrorBoundary>
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
        onSubmit={(input) => mutate(input, { onError: (error) => showBoundary(error) })}
      />
      {isPending && <RecommendSkeleton />}
      {result && variables && (
        <div className="flex flex-col gap-4">
          <RecommendResultCard zone={result.recommended} />
          <RegionMap origins={variables.origins} recommended={result.recommended} />
          {result.restaurants.length > 0 && (
            <RestaurantList zoneName={result.recommended.name} restaurants={result.restaurants} />
          )}
        </div>
      )}
    </section>
  );
}
