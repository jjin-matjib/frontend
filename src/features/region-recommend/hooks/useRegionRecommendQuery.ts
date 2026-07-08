"use client";

import { useQuery } from "@tanstack/react-query";
import { postRegionRecommend } from "../api/postRegionRecommend";
import { RECOMMEND_STALE_TIME_MS } from "../constants/config";
import { regionRecommendKeys } from "../constants/queryKeys";
import type { RecommendInput } from "../types";
import { buildMockResult } from "../utils/mockRecommend";

const EMPTY_INPUT: RecommendInput = { origins: [] };

/**
 * 추천 결과 조회. input은 "추천받기" 제출 시에만 채워지고(그 전엔 null),
 * queryKey가 input(반올림 좌표+인원)이라 동일 입력 재요청은 캐시로 처리된다.
 * useMock이면 외부 호출 없이 로컬에서 계산한다(개발/데모 비용 0).
 */
export function useRegionRecommendQuery(
  input: RecommendInput | null,
  useMock: boolean,
) {
  return useQuery({
    queryKey: regionRecommendKeys.result(input ?? EMPTY_INPUT),
    queryFn: async () =>
      useMock ? buildMockResult(input!) : postRegionRecommend(input!),
    enabled: input !== null,
    staleTime: RECOMMEND_STALE_TIME_MS,
  });
}
