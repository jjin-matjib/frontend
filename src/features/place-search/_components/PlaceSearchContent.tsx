'use client';

import { Suspense, useRef } from 'react';
import { FullMap } from './FullMap';
import { MapPreview } from './MapPreview';
import { PlaceList } from './PlaceList';
import { ResultHeader } from './ResultHeader';
import { SearchPending } from './SearchPending';
import { ViewToggle } from './ViewToggle';
import { usePlaces } from '../hooks/usePlaces';
import { toMarkers } from '../utils/map';

type ViewTab = 'map' | 'list';

interface Props {
  query: string;
  tab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
}

export function PlaceSearchContent({ query, tab, onTabChange }: Props) {
  if (query) {
    return (
      <Suspense fallback={<SearchPending />}>
        <SearchResults key={query} query={query} tab={tab} onTabChange={onTabChange} />
      </Suspense>
    );
  }

  // 검색 전에는 보여줄 리스트가 없어 리스트/지도 토글이 무의미하다.
  return (
    <div className="flex-1 overflow-hidden p-3">
      <FullMap markers={[]} />
    </div>
  );
}

function SearchResults({ query, tab, onTabChange }: { query: string; tab: ViewTab; onTabChange: (tab: ViewTab) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { places, allPlaces, hasMore, loadMore } = usePlaces(query);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - scrollTop - clientHeight < 200) loadMore();
  };

  return (
    <>
      <div className="shrink-0 flex items-center justify-between px-4 py-2">
        <ResultHeader count={allPlaces.length} />
        <ViewToggle tab={tab} onTabChange={onTabChange} />
      </div>
      {tab === 'list' ? (
        <>
          <div className="shrink-0">
            <MapPreview markers={toMarkers(places)} />
          </div>
          <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto scrollbar-place">
            {places.length > 0 ? (
              <PlaceList places={places} />
            ) : (
              <p className="text-center text-sm text-muted-foreground py-10">검색 결과가 없습니다.</p>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-hidden p-3">
          <FullMap markers={toMarkers(allPlaces)} places={allPlaces} />
        </div>
      )}
    </>
  );
}
