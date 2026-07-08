import { useEffect, useRef } from 'react';
import type { Place } from '../types';
import { PlaceCard } from './PlaceCard';

interface Props {
  places: Place[];
  hasMore: boolean;
  onLoadMore: () => void;
  loading?: boolean;
}

export function PlaceList({ places, hasMore, onLoadMore, loading }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onLoadMore(); },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore]);

  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
      <div ref={sentinelRef} className="h-1" />
      {loading && (
        <p className="text-center text-sm text-muted-foreground py-2">불러오는 중...</p>
      )}
    </div>
  );
}
