import type { Place } from '../types';
import { PlaceCard } from './PlaceCard';

interface Props {
  places: Place[];
}

export function PlaceList({ places }: Props) {
  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}
