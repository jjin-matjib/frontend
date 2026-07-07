import { GoogleMapWrapper } from '@/components/map';
import { DUMMY_CLUSTERS, DUMMY_MARKERS, MAP_CENTER, MAP_DEFAULT_ZOOM } from '../constants/dummy-markers';

export function FullMap() {
  return (
    <GoogleMapWrapper
      center={MAP_CENTER}
      zoom={MAP_DEFAULT_ZOOM}
      markers={DUMMY_MARKERS}
      clusters={DUMMY_CLUSTERS}
      className="w-full h-full rounded-xl border border-border"
    />
  );
}
