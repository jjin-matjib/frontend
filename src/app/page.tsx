import { Suspense } from 'react';
import { PlaceSearchPage } from '@/features/place-search';
import { SearchHeader } from '@/features/search';

export default function Home() {
  return (
    <Suspense>
      <PlaceSearchPage searchHeader={<SearchHeader />} />
    </Suspense>
  );
}
