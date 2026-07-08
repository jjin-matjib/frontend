import {
  ChevronRight,
  Coffee,
  Croissant,
  Star,
  Store,
  Utensils,
  Wine,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Place } from '../types';

interface CategoryConfig {
  icon: LucideIcon;
  bg: string;
  color: string;
}

function getCategoryConfig(category: string): CategoryConfig {
  const bg = 'bg-place-primary/10';
  if (category.includes('카페') || category.includes('커피') || category.includes('찻집') || category.includes('차'))
    return { icon: Coffee, bg, color: 'text-amber-600' };
  if (category.includes('베이커리') || category.includes('패스트리') || category.includes('디저트'))
    return { icon: Croissant, bg, color: 'text-orange-500' };
  if (category.includes('브런치') || category.includes('레스토랑'))
    return { icon: Utensils, bg, color: 'text-teal-600' };
  if (category.includes('바') || category.includes('와인'))
    return { icon: Wine, bg, color: 'text-violet-500' };
  return { icon: Store, bg, color: 'text-muted-foreground' };
}

interface Props {
  place: Place;
}

export function PlaceCard({ place }: Props) {
  const { icon: Icon, bg, color } = getCategoryConfig(place.category);

  return (
    <div className="flex gap-3 bg-place-surface rounded-xl p-3 shadow-sm">
      {/* Category icon */}
      <div className={`w-20 h-20 rounded-lg shrink-0 flex items-center justify-center ${bg}`}>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Category chip */}
        <span className="inline-block text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground mb-1">
          {place.category}
        </span>

        {/* Name */}
        <p className="font-semibold text-sm text-foreground truncate mb-1">{place.name}</p>

        <div className="flex items-center gap-1.5 mb-1">
          {place.isOpen && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-place-primary/10 text-place-primary font-medium">
              현재 영업중
            </span>
          )}
          {place.hours && (
            <span className="text-xs text-muted-foreground">{place.hours}</span>
          )}
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
