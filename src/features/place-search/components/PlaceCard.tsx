import { ChevronRight, Star } from 'lucide-react';
import type { Place } from '../types';

interface Props {
  place: Place;
}

export function PlaceCard({ place }: Props) {
  return (
    <div className="flex gap-3 bg-white rounded-xl p-3 shadow-sm">
      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-lg bg-muted shrink-0 overflow-hidden">
        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
          {place.category}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="font-semibold text-sm text-foreground truncate">{place.name}</span>
          <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
            {place.category}
          </span>
        </div>

        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-place-primary/10 text-place-primary font-medium">
            현재 영업중
          </span>
          <span className="text-xs text-muted-foreground">· {place.hours}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
          <span className="text-foreground font-medium">{place.rating}</span>
          <span>({place.reviewCount})</span>
          <span className="truncate">· {place.tags.join(' · ')}</span>
        </div>
      </div>

      {/* Distance */}
      <div className="flex flex-col items-end justify-between shrink-0">
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{place.distanceKm}km</span>
      </div>
    </div>
  );
}
