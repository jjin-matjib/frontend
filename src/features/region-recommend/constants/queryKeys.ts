import type { RecommendInput } from "../types";

export const regionRecommendKeys = {
  all: ["region-recommend"] as const,
  result: (input: RecommendInput) =>
    [...regionRecommendKeys.all, input] as const,
};
