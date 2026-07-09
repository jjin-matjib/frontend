/**
 * 권역 추천 알고리즘·비용 통제 상수.
 * Places(Enterprise SKU)와 Routes API는 유료이므로 호출 수를 상한한다.
 */

/** 참여자 수 범위 — 폼 UI와 zod 스키마가 함께 참조한다. */
export const MIN_PARTICIPANTS = 2;
export const MAX_PARTICIPANTS = 6;

/** Places로 발굴하는 후보 권역(역) 최대 수 */
export const MAX_CANDIDATES = 8;

/** Haversine 사전필터 후 Route Matrix에 넘기는 후보 최대 수(유료 호출 상한) */
export const MAX_MATRIX_DESTINATIONS = 4;

/** 후보 역 탐색 반경(m) — 가중 중심점 주변 */
export const CANDIDATE_SEARCH_RADIUS_M = 4000;

/** 추천 권역 주변 식당 탐색 반경(m) */
export const RESTAURANT_SEARCH_RADIUS_M = 500;

/** 식당 표본 수(Places searchNearby 상한이 20) */
export const RESTAURANT_SAMPLE_SIZE = 20;

/** 화면에 노출하는 맛집 수 */
export const RESTAURANT_DISPLAY_COUNT = 6;

/**
 * 베이지안 평균의 사전분포.
 * - priorRating(C): "리뷰가 없으면 평범한 식당"이라고 가정하는 기준 평점.
 *   집합 평균으로 두면 평점이 높은 권역에서 저리뷰 고평점이 수축되지 않아 상수로 쓴다.
 * - priorReviews(m): 이 리뷰 수만큼의 "가상 평균 리뷰"를 섞는다.
 *
 * C=4.0은 아직 실측 근거가 없는 잠정값이다. 실 API 키를 확보하면
 * 표본의 평균 평점을 측정해 보정해야 한다(PR 리뷰 노트 참고).
 */
export const BAYESIAN_PRIOR_RATING = 4.0;
export const BAYESIAN_PRIOR_REVIEWS = 100;

/**
 * 권역 점수 가중치. "분" 단위 절대값으로 더한다(낮을수록 좋음).
 *
 *   score(분) = 가중평균 이동시간 + α·이동시간 편차
 *
 * 후보 집합 안에서 min-max 정규화하면 안 된다 — 후보가 몇 개 없을 때
 * 평균 1분 차이가 0~1 전 범위로 늘어나, 편차 11분 차이를 눌러버린다.
 * 절대값이라 해석도 된다: α=0.5 → "편차 1분은 평균 0.5분만큼 나쁘다".
 *
 * 맛집은 권역 선택에 넣지 않는다. 후보마다 Enterprise SKU 호출이 필요한데,
 * 그 신호(인기순 상위 20곳 중 임계 통과 개수)는 표본 상한·절벽 임계 탓에
 * 비용 대비 근거가 약하다. 맛집은 추천된 권역의 리스트로만 다룬다.
 */
export const SCORE_WEIGHTS = {
  /** 편차 1분당 페널티(분) — 형평성 */
  spreadPenaltyPerMinute: 0.5,
} as const;

/** React Query staleTime — 동일 입력 재요청 시 유료 호출을 막는다. */
export const RECOMMEND_STALE_TIME_MS = 10 * 60 * 1000;
