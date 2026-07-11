import type { PlaceDetail } from '@/features/place-detail/types';
import type { RecentPlace } from './types';

export const RECENT_PLACES_KEY = 'muk-jido:recent-places';
export const RECENT_PLACES_CHANGED = 'muk-jido:recent-places-changed';
const MAX_RECENT_PLACES = 20;

export function readRecentPlaces(): RecentPlace[] {
  if (typeof window === 'undefined') return [];

  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(RECENT_PLACES_KEY) ?? '[]');
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is RecentPlace =>
      typeof item === 'object' && item !== null &&
      typeof (item as RecentPlace).id === 'string' &&
      typeof (item as RecentPlace).name === 'string' &&
      typeof (item as RecentPlace).viewedAt === 'number'
    );
  } catch {
    return [];
  }
}

export function saveRecentPlace(place: PlaceDetail) {
  const next: RecentPlace = {
    id: place.id,
    name: place.name,
    category: place.category,
    address: place.address,
    rating: place.rating,
    reviewCount: place.reviewCount,
    isOpen: place.isOpen,
    photoName: place.photoName,
    viewedAt: Date.now(),
  };
  const places = [next, ...readRecentPlaces().filter(({ id }) => id !== place.id)]
    .slice(0, MAX_RECENT_PLACES);
  window.localStorage.setItem(RECENT_PLACES_KEY, JSON.stringify(places));
  window.dispatchEvent(new Event(RECENT_PLACES_CHANGED));
}

export function clearRecentPlaces() {
  window.localStorage.removeItem(RECENT_PLACES_KEY);
  window.dispatchEvent(new Event(RECENT_PLACES_CHANGED));
}
