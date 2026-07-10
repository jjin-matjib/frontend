import { Suspense } from 'react';
import { PlaceSearchPage } from '@/features/place-search';

export default function Home() {
  return (
    <Suspense>
      <PlaceSearchPage />
    </Suspense>
  );
}
