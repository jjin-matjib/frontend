import type { RecommendInput, RecommendResponse } from "../types";
import { apiClient, getApiErrorMessage } from "@/lib/api/client";

export async function postRegionRecommend(
  input: RecommendInput,
): Promise<RecommendResponse> {
  try {
    const { data } = await apiClient.post<RecommendResponse>(
      "/region/recommend",
      input,
    );
    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "권역을 추천하지 못했습니다."),
    );
  }
}
