'use client';

import { Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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
      <div className="flex h-16 shrink-0 items-center px-4">
        <Image
          src="/assets/mukjido-logo.png"
          alt="먹지도"
          width={148}
          height={52}
          priority
          className="h-[52px] w-[148px] object-contain object-left"
        />
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

      {/* bottom: footer(56px) + gap(12px) = 68px */}
      <div className="absolute bottom-[68px] right-4 z-50">
        <Link href="/recent" className="h-10 px-3 rounded-full border border-place-divider bg-place-surface shadow-lg flex items-center gap-1.5 transition hover:-translate-y-0.5 hover:shadow-xl" aria-label="최근 본 장소 보기">
          <Clock className="w-4 h-4 text-place-marker shrink-0" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">최근 본 장소</span>
        </Link>
      </div>
    </main>
  );
}
