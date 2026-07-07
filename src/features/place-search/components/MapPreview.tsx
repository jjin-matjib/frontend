import { GoogleMapWrapper } from '@/components/map';
import { DUMMY_CLUSTERS, DUMMY_MARKERS, MAP_CENTER, MAP_DEFAULT_ZOOM } from '../constants/dummy-markers';

export function MapPreview() {
  return (
    <div className="px-4 pt-2 pb-3">
      <GoogleMapWrapper
        center={MAP_CENTER}
        zoom={MAP_DEFAULT_ZOOM}
        markers={DUMMY_MARKERS}
        clusters={DUMMY_CLUSTERS}
        className="w-full h-48 rounded-xl overflow-hidden"
      />
    </div>
  );
}
