'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { GoogleMapWrapper } from '@/components/map';
import type { MapMarker } from '@/types/map';
import { DUMMY_CLUSTERS, DUMMY_MARKERS, MAP_CENTER, MAP_DEFAULT_ZOOM } from '../constants/dummy-markers';
import type { Place } from '../types';

interface Props {
  markers?: MapMarker[];
  places?: Place[];
}

function calcCenter(markers: MapMarker[]) {
  if (!markers.length) return MAP_CENTER;
  const lat = markers.reduce((s, m) => s + m.lat, 0) / markers.length;
  const lng = markers.reduce((s, m) => s + m.lng, 0) / markers.length;
  return { lat, lng };
}

function MarkerInfoCard({ place, onClose }: { place: Place; onClose: () => void }) {
  return (
    <div className="absolute bottom-3 left-3 right-3 z-10 bg-place-surface rounded-xl shadow-lg border border-border p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs text-muted-foreground">{place.category}</span>
            {place.isOpen !== undefined && (
              <span className={`text-xs font-medium ${place.isOpen ? 'text-emerald-600' : 'text-destructive'}`}>
                {place.isOpen ? '영업 중' : '영업 종료'}
              </span>
            )}
          </div>
          <p className="font-semibold text-foreground text-sm truncate">{place.name}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>★ {place.rating.toFixed(1)}</span>
            <span>({place.reviewCount.toLocaleString()})</span>
            {place.hours && <span>{place.hours}</span>}
          </div>
          {place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {place.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 p-1 rounded-full hover:bg-muted text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function FullMap({ markers, places }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const pins = markers ?? DUMMY_MARKERS;
  const clusters = markers ? [] : DUMMY_CLUSTERS;
  const center = calcCenter(pins);

  const selectedPlace = selectedId && places ? (places.find((p) => p.id === selectedId) ?? null) : null;

  const handleMarkerClick = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative w-full h-full">
      <GoogleMapWrapper
        key={`${center.lat.toFixed(4)},${center.lng.toFixed(4)}`}
        center={center}
        zoom={MAP_DEFAULT_ZOOM}
        markers={pins}
        clusters={clusters}
        onMarkerClick={places ? handleMarkerClick : undefined}
        selectedMarkerId={selectedId ?? undefined}
        className="w-full h-full rounded-xl border border-border"
      />
      {selectedPlace && (
        <MarkerInfoCard place={selectedPlace} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
