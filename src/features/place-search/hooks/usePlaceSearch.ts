'use client';

import { useQuery } from '@tanstack/react-query';
import { getPlaces } from '../api/getPlaces';
import { placeSearchKeys } from '../constants/queryKeys';

export function usePlaceSearch(query: string | null) {
  const result = useQuery({
    queryKey: placeSearchKeys.list(query ?? '').queryKey,
    queryFn: () => getPlaces(query!),
    enabled: Boolean(query),
  });

  return {
    places: result.data ?? [],
    loading: result.isPending && result.fetchStatus !== 'idle',
    error: result.error?.message ?? null,
  };
}
