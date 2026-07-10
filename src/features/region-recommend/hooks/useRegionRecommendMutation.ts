"use client";

import { useMutation } from "@tanstack/react-query";
import { postRegionRecommend } from "../api/postRegionRecommend";
import { regionRecommendKeys } from "../constants/queryKeys";

/**
 * 사용자 제출로 실행되는 권역 추천 mutation.
 * 실패는 QueryClient의 MutationCache와 섹션 ErrorBoundary가 함께 처리한다.
 */
export function useRegionRecommendMutation() {
  return useMutation({
    mutationKey: regionRecommendKeys._def,
    mutationFn: postRegionRecommend,
  });
}
