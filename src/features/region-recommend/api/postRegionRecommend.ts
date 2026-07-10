import type { RecommendInput, RecommendResponse } from "../types";

export async function postRegionRecommend(
  input: RecommendInput,
): Promise<RecommendResponse> {
  const res = await fetch("/api/region/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "권역을 추천하지 못했습니다.");
  }
  return data;
}
