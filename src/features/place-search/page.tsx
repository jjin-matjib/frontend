'use client';

import { Clock } from 'lucide-react';
import { FooterNav } from '@/_components/FooterNav';
import { useSearchQuery } from '@/features/search';
import { PlaceSearchContent } from './_components/PlaceSearchContent';
import { useViewTab } from './hooks/useViewTab';

interface Props {
  searchHeader: React.ReactNode;
}

export function PlaceSearchPage({ searchHeader }: Props) {
  const [tab, setTab] = useViewTab();
  // 검색어 URL 파라미터(q)의 소유자는 search feature — 같은 훅으로 컨트랙트를 공유한다.
  const { query } = useSearchQuery();

  return (
    <main className="relative flex flex-col h-dvh bg-place-bg w-full">
      {/* 헤더 placeholder — 별도 담당자 구현 예정 */}
      <div className="shrink-0 h-14 px-4 flex items-center gap-3">
        <p className="text-xl font-bold text-place-header">먹지도</p>
      </div>

      {searchHeader}

      <div className="flex-1 flex flex-col overflow-hidden">
        <PlaceSearchContent
          query={query}
          tab={tab}
          onTabChange={setTab}
        />
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
