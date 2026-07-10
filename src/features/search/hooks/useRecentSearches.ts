"use client";

import { useCallback, useSyncExternalStore } from "react";
import { RECENT_SEARCHES_KEY, RECENT_SEARCHES_MAX } from "../constants/filters";
import { recentSearchesSchema } from "../schemas/recentSearches";

/**
 * 최근 검색 기록을 localStorage에 저장하는 모듈 단위 외부 스토어.
 * useSyncExternalStore로 구독하므로 여러 컴포넌트/탭 간 상태가 동기화되고,
 * 서버 스냅샷은 항상 빈 배열이라 SSR 하이드레이션이 어긋나지 않는다.
 */

const SERVER_SNAPSHOT: readonly string[] = [];

let snapshot: string[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = recentSearchesSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data.slice(0, RECENT_SEARCHES_MAX) : [];
  } catch {
    return [];
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function setSnapshot(next: string[]) {
  snapshot = next;
  try {
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
  } catch {
    // 저장 실패(용량 초과 · 프라이빗 모드 등)는 무시한다.
  }
  emit();
}

function handleStorageEvent(event: StorageEvent) {
  if (event.key !== RECENT_SEARCHES_KEY) return;
  snapshot = readStorage();
  emit();
}

function subscribe(listener: () => void) {
  if (!loaded) {
    snapshot = readStorage();
    loaded = true;
  }
  if (listeners.size === 0) {
    window.addEventListener("storage", handleStorageEvent);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}

function getSnapshot(): string[] {
  return snapshot;
}

function getServerSnapshot(): readonly string[] {
  return SERVER_SNAPSHOT;
}

/**
 * 최근 검색 기록을 조회/관리한다.
 * - 최신 검색이 앞에 오며 중복은 제거된다.
 * - 최대 {@link RECENT_SEARCHES_MAX}개까지 유지한다.
 */
export function useRecentSearches() {
  const items = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  ) as string[];

  const add = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const next = [
      trimmed,
      ...snapshot.filter((item) => item !== trimmed),
    ].slice(0, RECENT_SEARCHES_MAX);
    setSnapshot(next);
  }, []);

  const remove = useCallback((term: string) => {
    setSnapshot(snapshot.filter((item) => item !== term));
  }, []);

  const clear = useCallback(() => setSnapshot([]), []);

  return { items, add, remove, clear };
}
