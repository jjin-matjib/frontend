'use client';

import { useEffect, useState } from 'react';
import { DUMMY_PLACES } from '../constants/dummy-places';
import type { Place } from '../types';
import { usePlaceSearch } from './usePlaceSearch';

const PAGE_SIZE = 10;

export function usePlaces(query: string | null, useMock: boolean) {
  const [page, setPage] = useState(1);
  const { places: apiPlaces, loading, error } = usePlaceSearch(useMock ? null : query);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const allPlaces: Place[] = useMock
    ? query
      ? DUMMY_PLACES.filter((p) =>
          [p.name, p.category, ...p.tags].some((t) =>
            t.toLowerCase().includes(query.toLowerCase()),
          ),
        )
      : DUMMY_PLACES
    : apiPlaces;

  const places = allPlaces.slice(0, page * PAGE_SIZE);
  const hasMore = places.length < allPlaces.length;
  const loadMore = () => setPage((p) => p + 1);

  return { places, allPlaces, hasMore, loadMore, loading, error };
}
