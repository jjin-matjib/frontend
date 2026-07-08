'use client';

import { useEffect, useReducer } from 'react';
import type { Place } from '../types';

type State = { places: Place[]; loading: boolean; error: string | null };
type Action =
  | { type: 'loading' }
  | { type: 'success'; places: Place[] }
  | { type: 'error'; message: string };

function reducer(_: State, action: Action): State {
  switch (action.type) {
    case 'loading': return { places: [], loading: true, error: null };
    case 'success': return { places: action.places, loading: false, error: null };
    case 'error': return { places: [], loading: false, error: action.message };
  }
}

const INITIAL: State = { places: [], loading: false, error: null };

export function usePlaceSearch(query: string | null) {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();
    dispatch({ type: 'loading' });

    fetch(`/api/places/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          dispatch({ type: 'error', message: data.error });
        } else {
          dispatch({ type: 'success', places: data.places ?? [] });
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') dispatch({ type: 'error', message: '검색 중 오류가 발생했습니다.' });
      });

    return () => controller.abort();
  }, [query]);

  return {
    places: query ? state.places : [],
    loading: state.loading,
    error: query ? state.error : null,
  };
}
