'use client';

import { AdvancedMarker, APIProvider, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { MapCluster, MapMarker } from './types';
import { MockMap } from './MockMap';

interface Props {
  markers: MapMarker[];
  clusters: MapCluster[];
  center: { lat: number; lng: number };
  zoom: number;
  fitMarkers?: boolean;
  onMarkerClick?: (id: string) => void;
  selectedMarkerId?: string;
  className?: string;
}

function PinMarker({ selected }: { selected?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-transform bg-place-primary ${
          selected ? 'scale-125' : ''
        }`}
      >
        <div className={`rounded-full bg-place-primary-fg ${selected ? 'w-3 h-3' : 'w-2.5 h-2.5'}`} />
      </div>
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '8px solid var(--place-primary)',
          marginTop: '-1px',
        }}
      />
    </div>
  );
}

function ClusterBubble({ count }: { count: number }) {
  return (
    <div className="w-6 h-6 rounded-full bg-place-primary flex items-center justify-center text-place-primary-fg text-xs font-bold shadow-md cursor-pointer">
      {count}
    </div>
  );
}

interface MapContentProps {
  markers: MapMarker[];
  clusters: MapCluster[];
  onClusterClick: (cluster: MapCluster) => void;
  onMarkerClick?: (id: string) => void;
  selectedMarkerId?: string;
  fitMarkers?: boolean;
}

function MapContent({ markers, clusters, onClusterClick, onMarkerClick, selectedMarkerId, fitMarkers }: MapContentProps) {
  const map = useMap();
  const coreLib = useMapsLibrary('core');

  useEffect(() => {
    if (!map || !coreLib || !fitMarkers || markers.length === 0) return;
    if (markers.length === 1) {
      map.panTo({ lat: markers[0].lat, lng: markers[0].lng });
      map.setZoom(15);
      return;
    }
    const bounds = new coreLib.LatLngBounds();
    markers.forEach((m) => bounds.extend({ lat: m.lat, lng: m.lng }));
    map.fitBounds(bounds, 24);
  }, [map, coreLib, markers, fitMarkers]);

  return (
    <>
      {markers.map((m) => (
        <AdvancedMarker
          key={m.id}
          position={{ lat: m.lat, lng: m.lng }}
          onClick={() => onMarkerClick?.(m.id)}
        >
          <PinMarker selected={selectedMarkerId === m.id} />
        </AdvancedMarker>
      ))}
      {clusters.map((c) => (
        <AdvancedMarker
          key={c.id}
          position={{ lat: c.lat, lng: c.lng }}
          onClick={() => onClusterClick(c)}
        >
          <ClusterBubble count={c.count} />
        </AdvancedMarker>
      ))}
    </>
  );
}

export function GoogleMapWrapper({
  markers,
  clusters,
  center,
  zoom,
  fitMarkers,
  onMarkerClick,
  selectedMarkerId,
  className,
}: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
  const [mapCenter, setMapCenter] = useState(center);
  const [mapZoom, setMapZoom] = useState(zoom);

  const handleClusterClick = (cluster: MapCluster) => {
    setMapCenter({ lat: cluster.lat, lng: cluster.lng });
    setMapZoom((z) => z + 2);
  };

  if (!apiKey) {
    return <MockMap markers={markers} clusters={clusters} className={className} />;
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <APIProvider apiKey={apiKey}>
        <Map
          center={mapCenter}
          zoom={mapZoom}
          onCameraChanged={(e) => {
            setMapCenter(e.detail.center);
            setMapZoom(e.detail.zoom);
          }}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
          gestureHandling="greedy"
          disableDefaultUI
          style={{ width: '100%', height: '100%' }}
        >
          <MapContent
            markers={markers}
            clusters={clusters}
            onClusterClick={handleClusterClick}
            onMarkerClick={onMarkerClick}
            selectedMarkerId={selectedMarkerId}
            fitMarkers={fitMarkers}
          />
        </Map>
      </APIProvider>
    </div>
  );
}
