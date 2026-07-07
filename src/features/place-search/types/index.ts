export type ViewTab = 'list' | 'map';

export interface Place {
  id: string;
  name: string;
  category: string;
  isOpen: boolean;
  hours: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  distanceKm: number;
  lat: number;
  lng: number;
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
}

export interface MapCluster {
  id: string;
  lat: number;
  lng: number;
  count: number;
}
