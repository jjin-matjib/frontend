import {
  MAX_MATRIX_DESTINATIONS,
  RESTAURANT_SAMPLE_SIZE,
} from "../constants/config";
import { RESTAURANT_POOL } from "../constants/dummy-restaurants";
import { STATION_OPTIONS } from "../constants/stations";
import type {
  RecommendInput,
  RecommendResult,
  Restaurant,
} from "../types";
import { haversine, prefilterByHaversine } from "./geo";
import { excludeUnrated, sortByBayesian } from "./quality";
import { rankZones, type ScorableZone } from "./score";

function hashString(s: string): number {
  let hash = 0;
  for (const ch of s) hash = (hash * 31 + ch.charCodeAt(0)) % 100000;
  return hash;
}

/** 직선거리(km)를 대중교통 이동시간(분)으로 근사한다. */
function pseudoMinutes(distanceKm: number): number {
  return Math.round(distanceKm * 2.6 + 4);
}

/**
 * 권역별 더미 식당 표본. 평점·리뷰수를 권역+상호로 결정적으로 생성해
 * 권역마다 품질 분포가 달라지게 한다(무작위 X — 테스트 안정성).
 */
function buildMockRestaurants(zoneId: string): Restaurant[] {
  const start = hashString(zoneId) % RESTAURANT_POOL.length;
  const size = Math.min(RESTAURANT_SAMPLE_SIZE, RESTAURANT_POOL.length);
  const list: Restaurant[] = [];
  for (let i = 0; i < size; i++) {
    const idx = (start + i) % RESTAURANT_POOL.length;
    const base = RESTAURANT_POOL[idx];
    const seed = hashString(zoneId + base.name);
    list.push({
      id: `${zoneId}-${idx}`,
      name: base.name,
      category: base.category,
      rating: Number((3.5 + ((seed % 14) + 1) / 10).toFixed(1)), // 3.6 ~ 4.9
      reviewCount: 20 + (hashString(base.name + zoneId) % 50) * 100, // 20 ~ 4920
      distanceM: 120 + (seed % 9) * 60, // 120 ~ 600m
    });
  }
  return list;
}

/**
 * API 키가 없을 때 쓰는 더미 추천. 실 라우트와 **동일한 파이프라인**을 태운다
 * (후보 발굴 → 사전필터 → 이동시간 → 랭킹 → 우승 권역 식당만 조회).
 * Mock이 실 경로의 로직 결함을 가리지 않도록 채점·정렬 유틸을 그대로 쓴다.
 */
export function buildMockResult(input: RecommendInput): RecommendResult {
  const candidates = prefilterByHaversine(
    input.origins,
    STATION_OPTIONS.map((s) => ({
      id: s.value,
      name: s.label,
      lat: s.lat,
      lng: s.lng,
    })),
    MAX_MATRIX_DESTINATIONS,
  );

  const scorable: ScorableZone[] = candidates.map((zone) => ({
    id: zone.id,
    name: zone.name,
    lat: zone.lat,
    lng: zone.lng,
    perOrigin: input.origins.map((origin) => ({
      stationId: origin.stationId,
      label: origin.label,
      weight: origin.weight,
      minutes: pseudoMinutes(haversine(origin, zone)),
    })),
  }));

  const ranked = rankZones(scorable);
  return {
    recommended: ranked[0],
    candidates: ranked,
    // 실 라우트와 동일하게 "정렬된 표본 전체"를 반환한다(노출 개수는 UI가 정한다).
    restaurants: sortByBayesian(excludeUnrated(buildMockRestaurants(ranked[0].id))),
  };
}
