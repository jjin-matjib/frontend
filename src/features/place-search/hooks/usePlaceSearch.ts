'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getPlaces } from '../api/getPlaces';
import { placeSearchKeys } from '../constants/queryKeys';

export function usePlaceSearch(query: string) {
  const { data } = useSuspenseQuery({
    queryKey: placeSearchKeys.list(query).queryKey,
    queryFn: () => getPlaces(query),
  });

  return data;
}
