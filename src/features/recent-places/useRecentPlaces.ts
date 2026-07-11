'use client';

import { useEffect, useState } from 'react';
import { RECENT_PLACES_CHANGED, readRecentPlaces } from './storage';

export function useRecentPlaces() {
  const [places, setPlaces] = useState(() => readRecentPlaces());

  useEffect(() => {
    const refresh = () => setPlaces(readRecentPlaces());
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener(RECENT_PLACES_CHANGED, refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener(RECENT_PLACES_CHANGED, refresh);
    };
  }, []);

  return places;
}
