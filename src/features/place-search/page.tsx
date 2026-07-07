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
    <main className="flex flex-1 flex-col overflow-hidden bg-place-bg">
      {/* 헤더 placeholder — 별도 담당자 구현 예정 */}
      <div className="flex-shrink-0 h-20 bg-white px-4 flex flex-col justify-center">
        <div className="h-7 w-32 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted mt-1" />
      </div>

      {/* 검색 입력 영역 placeholder — 별도 담당자 구현 예정 */}
      <div className="flex-shrink-0 bg-white px-4 py-3 flex items-center gap-2 border-b border-border">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border px-4 h-10 bg-white">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground">가게명, 지역, 지하철역 검색</span>
        </div>
        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-white"
        >
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          type="button"
          className="flex items-center gap-1 px-3 h-10 rounded-lg border border-border bg-white text-sm text-muted-foreground"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          초기화
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {hasResults ? (
          <>
            <div className="flex-shrink-0">
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
            <div className="flex-shrink-0">
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
      <div className="fixed bottom-20 right-4 z-50 flex flex-col items-center gap-1">
        <div className="w-14 h-14 rounded-full bg-white shadow-lg flex flex-col items-center justify-center">
          <Clock className="w-5 h-5 text-place-primary" />
          <span className="text-[10px] text-muted-foreground leading-tight">최근 본</span>
          <span className="text-[10px] text-muted-foreground leading-tight">장소</span>
        </div>
      </div>
    </main>
  );
}
