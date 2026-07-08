import { RESTAURANT_DENSITY_CAP, SCORE_WEIGHTS } from "../constants/config";
import type { OriginTravel, RankedZone } from "../types";

/** 채점 전 후보. perOrigin에 이동시간이 채워져 있어야 한다. */
export interface ScorableZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  restaurantCount: number;
  perOrigin: OriginTravel[];
}

/** 인원 가중 평균 이동시간(분). */
export function weightedMeanMinutes(travels: OriginTravel[]): number {
  const totalWeight = travels.reduce((sum, t) => sum + t.weight, 0) || 1;
  return travels.reduce((sum, t) => sum + t.weight * t.minutes, 0) / totalWeight;
}

/** 이동시간 편차(분) = 최대 - 최소. 형평성 지표. */
export function spreadMinutes(travels: OriginTravel[]): number {
  if (travels.length === 0) return 0;
  const mins = travels.map((t) => t.minutes);
  return Math.max(...mins) - Math.min(...mins);
}

/** 값 배열을 0~1로 min-max 정규화한다(모두 같으면 0). */
function normalize(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  if (range === 0) return values.map(() => 0);
  return values.map((v) => (v - min) / range);
}

/**
 * 후보들을 종합 점수로 채점·정렬한다(오름차순, 낮을수록 좋음).
 * 1순위 평균 이동시간, 2순위 형평성(편차)·맛집 밀집도.
 */
export function rankZones(zones: ScorableZone[]): RankedZone[] {
  if (zones.length === 0) return [];

  const means = zones.map((z) => weightedMeanMinutes(z.perOrigin));
  const spreads = zones.map((z) => spreadMinutes(z.perOrigin));
  const normMeans = normalize(means);
  const normSpreads = normalize(spreads);

  const ranked = zones.map((zone, i) => {
    const density = Math.min(zone.restaurantCount / RESTAURANT_DENSITY_CAP, 1);
    const score =
      SCORE_WEIGHTS.mean * normMeans[i] +
      SCORE_WEIGHTS.spread * normSpreads[i] -
      SCORE_WEIGHTS.density * density;
    return {
      id: zone.id,
      name: zone.name,
      lat: zone.lat,
      lng: zone.lng,
      restaurantCount: zone.restaurantCount,
      weightedMeanMinutes: Math.round(means[i]),
      spreadMinutes: Math.round(spreads[i]),
      score,
      perOrigin: zone.perOrigin,
    };
  });

  return ranked.sort((a, b) => a.score - b.score);
}
