import type { RankedZone } from "../types";

/**
 * 추천 권역 → place-search 핸드오프 URL.
 * place-search의 최종 라우트/파라미터 계약이 확정되면 이 한 곳만 수정한다.
 * (현재는 `/search?lat&lng&region`으로 가정 — place-search 머지 후 연동 필요.)
 */
export function buildPlaceSearchUrl(zone: RankedZone): string {
  const params = new URLSearchParams({
    lat: zone.lat.toFixed(6),
    lng: zone.lng.toFixed(6),
    region: zone.name,
  });
  return `/search?${params.toString()}`;
}
