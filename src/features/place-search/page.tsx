'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { DUMMY_AUTOCOMPLETE_SUGGESTIONS, DUMMY_PLACES } from './constants/dummy-places';
import { FooterNav } from './components/FooterNav';
import { FullMap } from './components/FullMap';
import { MapPreview } from './components/MapPreview';
import { PlaceList } from './components/PlaceList';
import { ResultHeader } from './components/ResultHeader';
import { SearchBar } from './components/SearchBar';
import { ViewToggle } from './components/ViewToggle';
import { usePlaceSearch } from './hooks/usePlaceSearch';
import { useViewTab } from './hooks/useViewTab';

const isDev = process.env.NODE_ENV === 'development';

export function PlaceSearchPage() {
  const [tab, setTab] = useViewTab();
  const [query] = useQueryState('q');
  const [useMock, setUseMock] = useState(true);

  const hasResults = query !== null;
  const { places: apiPlaces, loading, error } = usePlaceSearch(useMock ? null : query);
  const places = useMock
    ? query
      ? DUMMY_PLACES.filter((p) =>
          [p.name, p.category, ...p.tags].some((t) =>
            t.toLowerCase().includes(query.toLowerCase()),
          ),
        )
      : DUMMY_PLACES
    : apiPlaces;
  const markers = places.map((p) => ({ id: p.id, lat: p.lat, lng: p.lng }));

  return (
    <main className="relative flex flex-col h-dvh bg-place-bg w-full">
      {/* 헤더 placeholder — 별도 담당자 구현 예정 */}
      <div className="shrink-0 h-14 bg-place-surface px-4 flex items-center gap-3">
        <p className="text-xl font-bold text-place-header">먹지도</p>
        {isDev && (
          <button
            type="button"
            onClick={() => setUseMock((v) => !v)}
            className={`ml-auto text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
              useMock
                ? 'bg-muted text-muted-foreground border-border'
                : 'bg-place-primary/10 text-place-primary border-place-primary/30'
            }`}
          >
            {useMock ? 'MOCK' : 'API'}
          </button>
        )}
      </div>

      {/* 검색 입력 영역 */}
      <SearchBar mockSuggestions={useMock ? DUMMY_AUTOCOMPLETE_SUGGESTIONS : undefined} />

      {/* 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {hasResults ? (
          <>
            <div className="shrink-0">
              <ResultHeader count={places.length} />
              <ViewToggle tab={tab} onTabChange={setTab} />
            </div>

            {tab === 'list' ? (
              <>
                <div className="shrink-0">
                  <MapPreview markers={markers} />
                </div>
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <p className="text-center text-sm text-muted-foreground py-10">검색 중...</p>
                  ) : error ? (
                    <p className="text-center text-sm text-destructive py-10">{error}</p>
                  ) : places.length > 0 ? (
                    <PlaceList places={places} />
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-10">검색 결과가 없습니다.</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-hidden p-3">
                <FullMap markers={markers} places={places} />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="shrink-0">
              <ViewToggle tab={tab} onTabChange={setTab} />
            </div>
            <div className="flex-1 overflow-hidden p-3">
              <FullMap />
            </div>
          </>
        )}
      </div>

      {/* 하단 네비게이션 */}
      <FooterNav />

      {/* 최근 본 장소 플로팅 버튼 placeholder — 별도 담당자 구현 예정 */}
      {/* bottom: footer(56px) + gap(12px) = 68px */}
      <div className="absolute bottom-[68px] right-4 z-50">
        <div className="w-14 h-14 rounded-full bg-place-surface shadow-lg flex flex-col items-center justify-center gap-0.5">
          <Clock className="w-5 h-5 text-place-primary" />
          <span className="text-[10px] leading-none text-muted-foreground">최근 본</span>
          <span className="text-[10px] leading-none text-muted-foreground">장소</span>
        </div>
      </div>
    </main>
  );
}
