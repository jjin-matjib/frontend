import type { MapMarker } from '@/types/map';
import { MAP_CENTER } from '../constants/dummy-markers';

export function calcCenter(markers: MapMarker[]) {
  if (!markers.length) return MAP_CENTER;
  const lat = markers.reduce((s, m) => s + m.lat, 0) / markers.length;
  const lng = markers.reduce((s, m) => s + m.lng, 0) / markers.length;
  return { lat, lng };
}
