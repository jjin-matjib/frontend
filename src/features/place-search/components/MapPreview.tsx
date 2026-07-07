import { GoogleMapWrapper } from '@/components/map';
import type { MapMarker } from '@/types/map';
import { DUMMY_CLUSTERS, DUMMY_MARKERS, MAP_CENTER, MAP_DEFAULT_ZOOM } from '../constants/dummy-markers';

interface Props {
  markers?: MapMarker[];
}

function calcCenter(markers: MapMarker[]) {
  if (!markers.length) return MAP_CENTER;
  const lat = markers.reduce((s, m) => s + m.lat, 0) / markers.length;
  const lng = markers.reduce((s, m) => s + m.lng, 0) / markers.length;
  return { lat, lng };
}

export function MapPreview({ markers }: Props) {
  const pins = markers ?? DUMMY_MARKERS;
  const clusters = markers ? [] : DUMMY_CLUSTERS;
  const center = calcCenter(pins);

  return (
    <div className="px-4 pt-2 pb-3">
      <GoogleMapWrapper
        key={`${center.lat.toFixed(4)},${center.lng.toFixed(4)}`}
        center={center}
        zoom={MAP_DEFAULT_ZOOM}
        markers={pins}
        clusters={clusters}
        className="w-full h-24 rounded-xl border border-border overflow-hidden"
      />
    </div>
  );
}
