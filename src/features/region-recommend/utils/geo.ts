import type { RecommendOrigin } from "../types";

interface LatLng {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** 두 좌표 사이 대권 거리(km). */
export function haversine(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

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
