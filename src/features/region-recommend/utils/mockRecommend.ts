import { MAX_MATRIX_DESTINATIONS } from "../constants/config";
import { RESTAURANT_POOL } from "../constants/dummy-restaurants";
import { STATION_OPTIONS } from "../constants/stations";
import type {
  OriginTravel,
  RecommendInput,
  RecommendResult,
  Restaurant,
} from "../types";
import { haversine, prefilterByHaversine } from "./geo";
import { rankZones, type ScorableZone } from "./score";

function hashString(s: string): number {
  let hash = 0;
  for (const ch of s) hash = (hash * 31 + ch.charCodeAt(0)) % 100000;
  return hash;
}

/** 추천 권역별로 더미 맛집을 결정적으로 뽑아 리스트업한다(평점순 정렬). */
function buildMockRestaurants(zoneId: string): Restaurant[] {
  const start = hashString(zoneId) % RESTAURANT_POOL.length;
  const picked: Restaurant[] = [];
  for (let i = 0; i < 6; i++) {
    const idx = (start + i) % RESTAURANT_POOL.length;
    const base = RESTAURANT_POOL[idx];
    const distanceM = 120 + (hashString(zoneId + base.name) % 9) * 60; // 120~600m
    picked.push({ id: `${zoneId}-${idx}`, ...base, distanceM });
  }
  return picked.sort(
    (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
  );
}

/** 역 id에서 결정적으로 맛집 수를 만든다(무작위 X — 테스트 안정성). */
function pseudoRestaurantCount(id: string): number {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) % 1000;
  return 6 + (hash % 15); // 6~20
}

/** 직선거리(km)를 대중교통 이동시간(분)으로 근사한다. */
function pseudoMinutes(distanceKm: number): number {
  return Math.round(distanceKm * 2.6 + 4);
}

/**
 * Mock 모드 추천 — 외부 API 호출 없이 실제 유틸(geo·score)로 결과를 만든다.
 * 후보는 큐레이션 역 목록에서 뽑고, 이동시간은 Haversine으로 근사한다.
 * 덕분에 입력에 반응하는 결정적 결과가 나오고 채점 로직도 그대로 검증된다.
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

  const scorable: ScorableZone[] = candidates.map((zone) => {
    const perOrigin: OriginTravel[] = input.origins.map((origin) => ({
      stationId: origin.stationId,
      label: origin.label,
      weight: origin.weight,
      minutes: pseudoMinutes(haversine(origin, zone)),
    }));
    return {
      id: zone.id,
      name: zone.name,
      lat: zone.lat,
      lng: zone.lng,
      restaurantCount: pseudoRestaurantCount(zone.id),
      perOrigin,
    };
  });

  const ranked = rankZones(scorable);
  return {
    recommended: ranked[0],
    candidates: ranked,
    restaurants: buildMockRestaurants(ranked[0].id),
  };
}
