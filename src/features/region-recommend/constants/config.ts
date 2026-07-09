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

/** 후보 역당 조회하는 식당 표본 수(Places searchNearby 상한이 20) */
export const RESTAURANT_SAMPLE_SIZE = 20;

/**
 * "좋은 식당" 판정 기준. 단순 식당 개수(=상권 크기)로는 맛집 권역을 가릴 수 없어
 * 평점·표본 크기를 함께 본다.
 */
export const GOOD_RATING_MIN = 4.3;
export const GOOD_REVIEW_MIN = 300;

/** 밀집도 보너스를 계산할 때 인정하는 좋은 식당 수의 상한 */
export const GOOD_RESTAURANT_CAP = 10;

/**
 * 베이지안 평균의 사전분포.
 * - priorMean(C): "리뷰가 없으면 평범한 식당"이라고 가정하는 기준 평점.
 *   집합 평균으로 두면 평점이 높은 권역에서 저리뷰 고평점이 수축되지 않아,
 *   안정적인 도시 평균을 상수로 쓴다.
 * - priorReviews(m): 이 리뷰 수만큼의 "가상 평균 리뷰"를 섞는다.
 */
export const BAYESIAN_PRIOR_RATING = 4.0;
export const BAYESIAN_PRIOR_REVIEWS = 100;

/**
 * 종합 점수 가중치. 모든 항을 "분" 단위 절대값으로 더한다(낮을수록 좋음).
 *
 *   score(분) = 가중평균 이동시간 + α·이동시간 편차 − β·min(좋은 식당 수, CAP)
 *
 * 후보 집합 안에서 min-max 정규화하면 안 된다 — 후보가 몇 개 없을 때
 * 평균 1분 차이가 0~1 전 범위로 늘어나, 편차 11분 차이를 눌러버린다.
 * 절대값이라 해석도 된다: α=0.5 → "편차 1분은 평균 0.5분만큼 나쁘다".
 */
export const SCORE_WEIGHTS = {
  /** 편차 1분당 페널티(분) — 형평성 */
  spreadPenaltyPerMinute: 0.5,
  /** 좋은 식당 1곳당 보너스(분) */
  densityBonusPerRestaurant: 0.3,
} as const;

/** React Query staleTime — 동일 입력 재요청 시 유료 호출을 막는다. */
export const RECOMMEND_STALE_TIME_MS = 10 * 60 * 1000;
