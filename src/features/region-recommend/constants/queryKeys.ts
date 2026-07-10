import type { RecommendInput } from "../types";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const regionRecommendKeys = createQueryKeys("region-recommend", {
  result: (input: RecommendInput) => [input],
});
