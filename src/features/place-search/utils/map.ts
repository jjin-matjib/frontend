import type { MapMarker } from '@/_components/map';
import { MAP_CENTER } from '../constants/map';
import type { Place } from '../types';

export function calcCenter(markers: MapMarker[]) {
  if (!markers.length) return MAP_CENTER;
  const lat = markers.reduce((s, m) => s + m.lat, 0) / markers.length;
  const lng = markers.reduce((s, m) => s + m.lng, 0) / markers.length;
  return { lat, lng };
}

export function toMarkers(places: Place[]): MapMarker[] {
  return places.map(({ id, lat, lng }) => ({ id, lat, lng }));
}
