"use client";

import { useQuery } from "@tanstack/react-query";
import { postRegionRecommend } from "../api/postRegionRecommend";
import { RECOMMEND_STALE_TIME_MS } from "../constants/config";
import { regionRecommendKeys } from "../constants/queryKeys";
import type { RecommendInput } from "../types";

const EMPTY_INPUT: RecommendInput = { origins: [] };

/**
 * 추천 결과 조회. input은 "추천받기" 제출 시에만 채워지고(그 전엔 null),
 * queryKey가 input이라 동일 입력 재요청은 캐시로 처리된다(유료 호출 방지).
 * Mock/실 API 분기는 서버 라우트가 API 키 유무로 결정한다.
 */
export function useRegionRecommendQuery(input: RecommendInput | null) {
  return useQuery({
    queryKey: regionRecommendKeys.result(input ?? EMPTY_INPUT),
    queryFn: () => postRegionRecommend(input!),
    enabled: input !== null,
    staleTime: RECOMMEND_STALE_TIME_MS,
    // 유료 API라 자동 재시도하지 않는다. 기본값(3회)은 설정 오류에도 같은 호출을
    // 4번 반복해 비용을 4배로 만들고, 백오프 때문에 실패 표시도 9초쯤 늦어진다.
    // 실패 시에는 화면의 "다시 시도" 버튼으로 사용자가 직접 재요청한다.
    retry: false,
  });
}
