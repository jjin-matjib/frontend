'use client';

import { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { DUMMY_AUTOCOMPLETE_SUGGESTIONS } from './constants/dummy-places';
import { FooterNav } from '@/components/FooterNav';
import { FullMap } from './components/FullMap';
import { MapPreview } from './components/MapPreview';
import { PlaceList } from './components/PlaceList';
import { ResultHeader } from './components/ResultHeader';
import { SearchBar } from './components/SearchBar';
import { ViewToggle } from './components/ViewToggle';
import { usePlaces } from './hooks/usePlaces';
import { useViewTab } from './hooks/useViewTab';
import { toMarkers } from './utils/map';

const isDev = process.env.NODE_ENV === 'development';

export function PlaceSearchPage() {
  const [tab, setTab] = useViewTab();
  const [query] = useQueryState('q');
  const [useMock, setUseMock] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { places, allPlaces, hasMore, loadMore, loading, error } = usePlaces(query, useMock);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [query]);

  const hasResults = query !== null;
  const markers = toMarkers(allPlaces);

  return (
    <main className="relative flex flex-col h-dvh bg-place-bg w-full">
      {/* 헤더 placeholder — 별도 담당자 구현 예정 */}
      <div className="shrink-0 h-14 px-4 flex items-center gap-3">
        <p className="text-xl font-bold text-place-header">먹지도</p>
        {isDev && (
          <button
            type="button"
            onClick={() => setUseMock((v) => !v)}
            className={`ml-auto text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
              useMock
                ? 'bg-muted text-muted-foreground border-border hover:bg-muted/70'
                : 'bg-place-primary/10 text-place-primary border-place-primary/30 hover:bg-place-primary/20'
            }`}
          >
            {useMock ? 'MOCK' : 'API'}
          </button>
        )}
      </div>

      <SearchBar mockSuggestions={useMock ? DUMMY_AUTOCOMPLETE_SUGGESTIONS : undefined} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {hasResults ? (
          <>
            <div className="shrink-0 flex items-center justify-between px-4 py-2">
              <ResultHeader count={places.length} />
              <ViewToggle tab={tab} onTabChange={setTab} />
            </div>

            {tab === 'list' ? (
              <>
                <div className="shrink-0">
                  <MapPreview markers={toMarkers(places)} />
                </div>
                <div ref={scrollRef} className="flex-1 overflow-y-auto">
                  {loading ? (
                    <p className="text-center text-sm text-muted-foreground py-10">검색 중...</p>
                  ) : error ? (
                    <p className="text-center text-sm text-destructive py-10">{error}</p>
                  ) : places.length > 0 ? (
                    <PlaceList places={places} hasMore={hasMore} onLoadMore={loadMore} loading={loading} />
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-10">검색 결과가 없습니다.</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-hidden p-3">
                <FullMap markers={markers} places={allPlaces} />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="shrink-0 flex justify-end px-4 py-2">
              <ViewToggle tab={tab} onTabChange={setTab} />
            </div>
            <div className="flex-1 overflow-hidden p-3">
              <FullMap markers={[]} />
            </div>
          </>
        )}
      </div>

      <FooterNav />

      {/* 최근 본 장소 플로팅 버튼 placeholder — 별도 담당자 구현 예정 */}
      {/* bottom: footer(56px) + gap(12px) = 68px */}
      <div className="absolute bottom-[68px] right-4 z-50">
        <div className="h-10 px-3 rounded-full bg-place-surface shadow-lg flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-place-marker shrink-0" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">최근 본 장소</span>
        </div>
      </div>
    </main>
  );
}
