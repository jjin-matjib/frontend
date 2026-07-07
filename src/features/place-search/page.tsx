'use client';

import { Clock, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { DUMMY_PLACES } from './constants/dummy-places';
import { FooterNav } from './components/FooterNav';
import { FullMap } from './components/FullMap';
import { MapPreview } from './components/MapPreview';
import { PlaceList } from './components/PlaceList';
import { RecentSearchList } from './components/RecentSearchList';
import { ResultHeader } from './components/ResultHeader';
import { ViewToggle } from './components/ViewToggle';
import { useViewTab } from './hooks/useViewTab';

export function PlaceSearchPage() {
  const [tab, setTab] = useViewTab();
  const [query] = useQueryState('q');
  const hasResults = query !== null;

  return (
    <main className="relative flex flex-col h-dvh overflow-hidden bg-place-bg w-full">
      {/* 헤더 placeholder — 별도 담당자 구현 예정 */}
      <div className="shrink-0 h-20 bg-white px-4 flex flex-col justify-center border-b border-border">
        <div className="h-6 w-28 rounded-md bg-muted" />
        <div className="h-3.5 w-20 rounded bg-muted mt-1.5" />
      </div>

      {/* 검색 입력 영역 placeholder — 별도 담당자 구현 예정 */}
      <div className="shrink-0 bg-white px-4 py-3 flex items-center gap-2 border-b border-border">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border px-3 h-11 bg-white min-w-0">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground truncate">가게명, 지역, 지하철역 검색</span>
        </div>
        <button
          type="button"
          className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl border border-border bg-white"
        >
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          type="button"
          className="shrink-0 flex items-center gap-1 px-3 h-11 rounded-xl border border-border bg-white text-sm text-muted-foreground whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          초기화
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {hasResults ? (
          <>
            <div className="shrink-0">
              <ResultHeader count={DUMMY_PLACES.length} />
              <ViewToggle tab={tab} onTabChange={setTab} />
            </div>

            {tab === 'list' ? (
              <div className="flex-1 overflow-y-auto">
                <MapPreview />
                <PlaceList places={DUMMY_PLACES} />
              </div>
            ) : (
              <div className="flex-1 overflow-hidden">
                <FullMap />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="shrink-0">
              <RecentSearchList />
              <ViewToggle tab={tab} onTabChange={setTab} />
            </div>
            <div className="flex-1 overflow-hidden">
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
        <div className="w-14 h-14 rounded-full bg-white shadow-lg flex flex-col items-center justify-center gap-0.5">
          <Clock className="w-5 h-5 text-place-primary" />
          <span className="text-[10px] leading-none text-muted-foreground">최근 본</span>
          <span className="text-[10px] leading-none text-muted-foreground">장소</span>
        </div>
      </div>
    </main>
  );
}
