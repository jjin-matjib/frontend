import type { Place } from '../types';
import { PlaceCard } from './PlaceCard';

interface Props {
  places: Place[];
  loading?: boolean;
}

export function PlaceList({ places, loading }: Props) {
  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
      {loading && (
        <p className="text-center text-sm text-muted-foreground py-2">불러오는 중...</p>
      )}
    </div>
  );
}
