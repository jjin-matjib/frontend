import {
  BAYESIAN_PRIOR_RATING,
  BAYESIAN_PRIOR_REVIEWS,
  GOOD_RATING_MIN,
  GOOD_REVIEW_MIN,
} from "../constants/config";
import type { Restaurant } from "../types";

/**
 * 베이지안 평균 — 리뷰 수를 "품질 점수"가 아니라 "평점의 신뢰 가중치"로 쓴다.
 *
 *   score = (v/(v+m))·R + (m/(v+m))·C
 *
 * 리뷰(v)가 적으면 사전값 C(평범한 식당의 평점)로 수축되고, 많아질수록 자기 평점 R을 신뢰한다.
 * C를 "집합 평균"이 아니라 상수로 두는 게 핵심이다 — 집합 평균을 쓰면 평점이 높은 권역에서
 * 리뷰 3개짜리 5.0이 그 높은 평균으로만 수축되어 검증된 4.6을 계속 이겨버린다.
 */
export function bayesianScore(
  rating: number,
  reviewCount: number,
  priorRating: number = BAYESIAN_PRIOR_RATING,
  priorReviews: number = BAYESIAN_PRIOR_REVIEWS,
): number {
  const v = reviewCount;
  const m = priorReviews;
  return (v / (v + m)) * rating + (m / (v + m)) * priorRating;
}

/**
 * "좋은 식당" 판정 — 평점과 표본 크기를 함께 본다.
 * 단순 식당 개수(=상권 크기)가 아니라 품질로 권역을 평가하기 위한 기준.
 */
export function isGoodRestaurant(restaurant: Restaurant): boolean {
  return (
    restaurant.rating >= GOOD_RATING_MIN &&
    restaurant.reviewCount >= GOOD_REVIEW_MIN
  );
}

/** 권역의 "좋은 식당 밀도" 지표 — 맛집이 몰려 있는 정도. */
export function countGoodRestaurants(restaurants: Restaurant[]): number {
  return restaurants.filter(isGoodRestaurant).length;
}

/** 베이지안 평균 내림차순 정렬(동점이면 리뷰 많은 순). */
export function sortByBayesian(restaurants: Restaurant[]): Restaurant[] {
  return [...restaurants].sort((a, b) => {
    const diff =
      bayesianScore(b.rating, b.reviewCount) -
      bayesianScore(a.rating, a.reviewCount);
    return diff !== 0 ? diff : b.reviewCount - a.reviewCount;
  });
}
