/**
 * 권역 추천 알고리즘·비용 통제 상수.
 * Places(Enterprise SKU)와 Routes API는 유료이므로 호출 수를 상한한다.
 */

/** 참여자 수 범위 — 폼 UI와 zod 스키마가 함께 참조한다. */
export const MIN_PARTICIPANTS = 2;
export const MAX_PARTICIPANTS = 6;

/**
 * Haversine 사전필터 후 Route Matrix에 넘기는 후보 최대 수(유료 호출 상한).
 * 후보는 Places가 아니라 우리 역 데이터(seoul-stations.json)에서 뽑는다.
 */
export const MAX_MATRIX_DESTINATIONS = 4;

/** 추천 권역 주변 식당 탐색 반경(m) */
export const RESTAURANT_SEARCH_RADIUS_M = 500;

/** 식당 표본 수(Places searchNearby 상한이 20) */
export const RESTAURANT_SAMPLE_SIZE = 20;

/** 화면에 노출하는 맛집 수 */
export const RESTAURANT_DISPLAY_COUNT = 6;

/**
 * 베이지안 평균의 사전분포.
 * - priorRating(C): 리뷰가 없을 때 가정하는 기준 평점.
 * - priorReviews(m): 이 리뷰 수만큼의 "가상 평균 리뷰"를 섞는다.
 *
 * C는 **의도적으로 모집단 평균보다 낮게** 잡은 비관적 사전값이다.
 *
 * 실측(실 Places API, 3개 권역 × 상위 20곳 = 60곳): 평균 평점 4.38
 * 그런데 C를 실측 평균(4.4)으로 올리면 리뷰 1개짜리 ★5.0(4.406)이
 * 검증된 ★4.3/리뷰638(4.314)을 이겨버린다. 사후평균으로는 옳지만
 * ("모르는 가게의 기대 평점 = 모집단 평균") 추천으로는 틀렸다.
 * 추천은 "얼마나 좋은가"가 아니라 "자신 있게 권할 수 있는가"를 물어야 한다.
 *
 * C=4.0(모집단 평균 −0.38)이면 정보 없는 가게가 검증된 가게 아래로 내려간다.
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
