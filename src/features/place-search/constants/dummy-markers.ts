import type { MapCluster, MapMarker } from '@/types/map';

export const MAP_CENTER = { lat: 37.5444, lng: 127.0557 };
export const MAP_DEFAULT_ZOOM = 14;

export const DUMMY_MARKERS: MapMarker[] = [
  { id: 'm1', lat: 37.5480, lng: 127.0490 },
  { id: 'm2', lat: 37.5462, lng: 127.0532 },
  { id: 'm3', lat: 37.5428, lng: 127.0570 },
  { id: 'm4', lat: 37.5412, lng: 127.0610 },
];

export const DUMMY_CLUSTERS: MapCluster[] = [
  { id: 'c1', lat: 37.5452, lng: 127.0510, count: 3 },
  { id: 'c2', lat: 37.5422, lng: 127.0585, count: 5 },
];
