'use client';

import { useEffect, useState } from 'react';
import type { Place } from '../types';

export function usePlaceSearch(query: string | null) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setPlaces([]);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/api/places/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setPlaces([]);
        } else {
          setPlaces(data.places ?? []);
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError('검색 중 오류가 발생했습니다.');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [query]);

  return { places, loading, error };
}
