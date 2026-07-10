'use client';

import { useCallback, useState } from 'react';
import type { Place } from '../types';
import { usePlaceSearch } from './usePlaceSearch';

const PAGE_SIZE = 10;
const MAX_API_RESULTS = 20; // Google searchText 페이지당 상한과 동일

export function usePlaces(query: string) {
  const [page, setPage] = useState(1);
  const [trackedQuery, setTrackedQuery] = useState(query);
  const apiPlaces = usePlaceSearch(query);

  if (query !== trackedQuery) {
    setTrackedQuery(query);
    setPage(1);
  }

  const allPlaces: Place[] = apiPlaces.slice(0, MAX_API_RESULTS);

  const places = allPlaces.slice(0, page * PAGE_SIZE);
  const hasMore = places.length < allPlaces.length;
  const loadMore = useCallback(() => setPage((p) => p + 1), []);

  return { places, allPlaces, hasMore, loadMore };
}
