import { z } from "zod";

/** localStorage에 저장된 최근 검색 기록의 형태를 검증한다. */
export const recentSearchesSchema = z.array(z.string().trim().min(1));

export type RecentSearches = z.infer<typeof recentSearchesSchema>;
