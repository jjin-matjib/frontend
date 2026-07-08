import { MAX_MATRIX_DESTINATIONS } from "../constants/config";
import { STATION_OPTIONS } from "../constants/stations";
import type { OriginTravel, RecommendInput, RecommendResult } from "../types";
import { haversine, prefilterByHaversine } from "./geo";
import { rankZones, type ScorableZone } from "./score";

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
  return { recommended: ranked[0], candidates: ranked };
}
