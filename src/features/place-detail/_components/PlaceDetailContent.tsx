'use client';

import { useEffect } from 'react';
import { saveRecentPlace } from '@/features/recent-places/storage';
import { MapLinkButtons } from './MapLinkButtons';
import { PlaceInfoSection } from './PlaceInfoSection';
import { ShareActionBar } from './ShareActionBar';
import { usePlaceDetailQuery } from '../hooks/usePlaceDetailQuery';
import { usePlaceShare } from '../hooks/usePlaceShare';

export function PlaceDetailContent({ placeId }: { placeId: string }) {
  const { data: place } = usePlaceDetailQuery(placeId);
  const { shareImage, shareUrl, result } = usePlaceShare(place);

  useEffect(() => {
    saveRecentPlace(place);
  }, [place]);

  return (
    <>
      <PlaceInfoSection place={place} />
      <MapLinkButtons place={place} />
      <ShareActionBar result={result} onShareImage={shareImage} onShareUrl={shareUrl} />
    </>
  );
}
