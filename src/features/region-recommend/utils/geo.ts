import { haversine, type LatLng } from "@/lib/geo";
import type { RecommendOrigin } from "../types";

/** 인원(weight) 가중 중심 좌표. 출발지가 없으면 null. */
export function weightedCentroid(origins: RecommendOrigin[]): LatLng | null {
  const totalWeight = origins.reduce((sum, o) => sum + o.weight, 0);
  if (totalWeight === 0) return null;
  const lat =
    origins.reduce((sum, o) => sum + o.lat * o.weight, 0) / totalWeight;
  const lng =
    origins.reduce((sum, o) => sum + o.lng * o.weight, 0) / totalWeight;
  return { lat, lng };
}

/** 출발지들로부터의 인원 가중 직선거리 합(km). */
export function weightedDistanceSum(
  origins: RecommendOrigin[],
  point: LatLng,
): number {
  return origins.reduce((sum, o) => sum + o.weight * haversine(o, point), 0);
}

/**
 * 유료 Distance Matrix 호출 전, 무료 Haversine 가중합으로 후보를 좁힌다.
 * 가까운 순 상위 limit개만 남긴다.
 */
export function prefilterByHaversine<T extends LatLng>(
  origins: RecommendOrigin[],
  candidates: T[],
  limit: number,
): T[] {
  return [...candidates]
    .sort(
      (a, b) =>
        weightedDistanceSum(origins, a) - weightedDistanceSum(origins, b),
    )
    .slice(0, limit);
}
