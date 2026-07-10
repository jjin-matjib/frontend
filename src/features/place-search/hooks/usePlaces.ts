'use client';

import { useCallback, useState } from 'react';
import { DUMMY_PLACES } from '../constants/dummy-places';
import type { Place } from '../types';
import { usePlaceSearch } from './usePlaceSearch';

const PAGE_SIZE = 10;
const MAX_API_RESULTS = 30;

export function usePlaces(query: string | null, useMock: boolean) {
  const [page, setPage] = useState(1);
  const [trackedQuery, setTrackedQuery] = useState(query);
  const { places: apiPlaces, loading, error } = usePlaceSearch(useMock ? null : query);

  if (query !== trackedQuery) {
    setTrackedQuery(query);
    setPage(1);
  }

  const allPlaces: Place[] = useMock
    ? query
      ? DUMMY_PLACES.filter((p) =>
          [p.name, p.category, ...p.tags].some((t) =>
            t.toLowerCase().includes(query.toLowerCase()),
          ),
        )
      : DUMMY_PLACES
    : apiPlaces.slice(0, MAX_API_RESULTS);

  const places = allPlaces.slice(0, page * PAGE_SIZE);
  const hasMore = places.length < allPlaces.length;
  const loadMore = useCallback(() => setPage((p) => p + 1), []);

  return { places, allPlaces, hasMore, loadMore, loading, error };
}
