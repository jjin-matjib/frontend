'use client';

import { ArrowLeft, ChevronRight, Clock3, MapPin, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearRecentPlaces } from './storage';
import { useRecentPlaces } from './useRecentPlaces';

function viewedLabel(viewedAt: number) {
  const minutes = Math.floor((Date.now() - viewedAt) / 60_000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days}일 전` : new Intl.DateTimeFormat('ko', { month: 'long', day: 'numeric' }).format(viewedAt);
}

export function RecentPlacesPage() {
  const router = useRouter();
  const places = useRecentPlaces();

  return (
    <main className="flex h-dvh min-h-0 flex-col overflow-hidden bg-place-bg">
      <header className="z-10 flex h-14 shrink-0 items-center border-b border-place-divider bg-place-surface/95 px-4 backdrop-blur">
        <button onClick={() => router.back()} className="-ml-2 grid size-10 place-items-center rounded-full hover:bg-muted" aria-label="뒤로 가기">
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="ml-1 flex-1 text-lg font-bold text-place-header">최근 본 장소</h1>
        {places.length > 0 && (
          <button onClick={clearRecentPlaces} className="flex h-9 items-center gap-1 rounded-lg px-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
            <Trash2 className="size-3.5" /> 전체 삭제
          </button>
        )}
      </header>

      {places.length === 0 ? (
        <section className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 pb-20 text-center">
          <div className="mb-4 grid size-16 place-items-center rounded-full bg-place-map-bg">
            <Clock3 className="size-7 text-place-marker" />
          </div>
          <h2 className="font-semibold">아직 둘러본 장소가 없어요</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">관심 있는 장소의 상세 정보를 보면<br />이곳에서 다시 확인할 수 있어요.</p>
          <Link href="/" className="mt-6 rounded-full bg-place-primary px-5 py-2.5 text-sm font-semibold text-place-primary-fg">장소 둘러보기</Link>
        </section>
      ) : (
        <section className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
          <p className="px-1 text-xs text-muted-foreground">최근 본 순서로 최대 20개까지 보여드려요</p>
          <div className="mt-3 flex flex-col gap-3 pb-4">
          {places.map((place) => (
            <Link key={place.id} href={`/places/${encodeURIComponent(place.id)}`} className="group shrink-0 rounded-2xl border border-place-divider bg-place-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-place-map-bg text-place-marker"><MapPin className="size-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0"><h2 className="truncate font-semibold">{place.name}</h2><p className="mt-0.5 truncate text-xs text-muted-foreground">{place.category}</p></div>
                    <ChevronRight className="mt-1 size-4 shrink-0 text-place-icon-muted transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-2 truncate text-xs text-muted-foreground">{place.address}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 font-medium"><Star className="size-3.5 fill-amber-400 text-amber-400" />{place.rating}</span>
                    <span className="text-muted-foreground">리뷰 {place.reviewCount.toLocaleString()}</span>
                    <span className="ml-auto text-place-muted">{viewedLabel(place.viewedAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          </div>
        </section>
      )}
    </main>
  );
}
