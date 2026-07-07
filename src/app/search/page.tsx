import { Suspense } from 'react';
import { PlaceSearchPage } from '@/features/place-search';

export default function SearchPage() {
  return (
    <Suspense>
      <PlaceSearchPage />
    </Suspense>
  );
}
