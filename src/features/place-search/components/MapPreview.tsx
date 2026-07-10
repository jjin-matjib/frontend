import { GoogleMapWrapper } from '@/components/map';
import type { MapMarker } from '@/types/map';
import { DUMMY_CLUSTERS, DUMMY_MARKERS, MAP_DEFAULT_ZOOM } from '../constants/dummy-markers';
import { calcCenter } from '../utils/map';

interface Props {
  markers?: MapMarker[];
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
        fitMarkers
        className="w-full h-34 rounded-xl border border-border overflow-hidden"
      />
    </div>
  );
}
