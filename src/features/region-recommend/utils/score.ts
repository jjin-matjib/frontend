import { SCORE_WEIGHTS } from "../constants/config";
import type { OriginTravel, RankedZone } from "../types";

/** 채점 전 후보. perOrigin에 이동시간이 채워져 있어야 한다. */
export interface ScorableZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
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

/** 모든 출발지에서 도달 가능한 후보만 채점할 수 있다(ROUTE_NOT_FOUND 방어). */
export function isReachable(zone: ScorableZone): boolean {
  return zone.perOrigin.every((t) => Number.isFinite(t.minutes));
}

/**
 * 후보들을 종합 점수로 채점·정렬한다(오름차순, 낮을수록 좋음).
 * 점수는 "분" 단위 절대값이라 후보 수에 흔들리지 않고 해석도 가능하다.
 * 한 명이라도 도달 불가한 후보는 제외한다.
 */
export function rankZones(zones: ScorableZone[]): RankedZone[] {
  return zones
    .filter(isReachable)
    .map((zone) => {
      const mean = weightedMeanMinutes(zone.perOrigin);
      const spread = spreadMinutes(zone.perOrigin);
      const score = mean + SCORE_WEIGHTS.spreadPenaltyPerMinute * spread;

      return {
        id: zone.id,
        name: zone.name,
        lat: zone.lat,
        lng: zone.lng,
        weightedMeanMinutes: Math.round(mean),
        spreadMinutes: Math.round(spread),
        score,
        perOrigin: zone.perOrigin,
      };
    })
    .sort((a, b) => a.score - b.score);
}
