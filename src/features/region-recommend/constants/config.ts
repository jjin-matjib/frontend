/**
 * 권역 추천 알고리즘·비용 통제 상수.
 * Distance Matrix(실제 이동시간)는 유료이므로 후보 수를 상한한다.
 */

/** Places로 발굴하는 후보 권역(역) 최대 수 */
export const MAX_CANDIDATES = 8;

/** Haversine 사전필터 후 Distance Matrix에 넘기는 후보 최대 수(유료 호출 상한) */
export const MAX_MATRIX_DESTINATIONS = 4;

/** 후보 역 탐색 반경(m) — 가중 중심점 주변 */
export const CANDIDATE_SEARCH_RADIUS_M = 4000;

/** 맛집 밀집도 집계 반경(m) — 후보 역 주변 */
export const RESTAURANT_DENSITY_RADIUS_M = 500;

/** 밀집도 정규화 상한(이 수를 넘으면 1.0로 본다) */
export const RESTAURANT_DENSITY_CAP = 20;

/**
 * 종합 점수 가중치. score = wMean·mean + wSpread·spread − wDensity·density (정규화 후).
 * "평균 이동시간 최소"가 1순위이므로 wMean을 크게 둔다.
 */
export const SCORE_WEIGHTS = {
  mean: 1,
  spread: 0.35,
  density: 0.25,
} as const;

/** React Query staleTime — 동일 입력 재요청 시 유료 호출을 막는다. */
export const RECOMMEND_STALE_TIME_MS = 10 * 60 * 1000;
