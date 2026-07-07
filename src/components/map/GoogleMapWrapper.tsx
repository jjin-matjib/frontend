'use client';

import { AdvancedMarker, APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { cn } from '@/lib/utils';
import type { MapCluster, MapMarker } from '@/types/map';
import { MockMap } from './MockMap';

interface Props {
  markers: MapMarker[];
  clusters: MapCluster[];
  center: { lat: number; lng: number };
  zoom: number;
  className?: string;
}

function PinMarker() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-7 h-7 rounded-full bg-place-primary flex items-center justify-center shadow-sm">
        <div className="w-2.5 h-2.5 rounded-full bg-place-primary-fg" />
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

function ClusterBubble({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="w-6 h-6 rounded-full bg-place-primary flex items-center justify-center text-place-primary-fg text-xs font-bold shadow-md cursor-pointer"
    >
      {count}
    </div>
  );
}

function MapContent({ markers, clusters }: { markers: MapMarker[]; clusters: MapCluster[] }) {
  const map = useMap();

  const handleClusterClick = (cluster: MapCluster) => {
    if (!map) return;
    map.panTo({ lat: cluster.lat, lng: cluster.lng });
    map.setZoom((map.getZoom() ?? 12) + 2);
  };

  return (
    <>
      {markers.map((m) => (
        <AdvancedMarker key={m.id} position={{ lat: m.lat, lng: m.lng }}>
          <PinMarker />
        </AdvancedMarker>
      ))}
      {clusters.map((c) => (
        <AdvancedMarker key={c.id} position={{ lat: c.lat, lng: c.lng }}>
          <ClusterBubble count={c.count} onClick={() => handleClusterClick(c)} />
        </AdvancedMarker>
      ))}
    </>
  );
}

export function GoogleMapWrapper({ markers, clusters, center, zoom, className }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  if (!apiKey) {
    return <MockMap markers={markers} clusters={clusters} className={className} />;
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
          gestureHandling="greedy"
          disableDefaultUI
          style={{ width: '100%', height: '100%' }}
        >
          <MapContent markers={markers} clusters={clusters} />
        </Map>
      </APIProvider>
    </div>
  );
}
