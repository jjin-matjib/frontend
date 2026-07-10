import type {
  CATEGORY_OPTIONS,
  DISTANCE_OPTIONS,
  OPEN_STATUS_OPTIONS,
  SORT_OPTIONS,
} from "../constants/filters";

export type Category = (typeof CATEGORY_OPTIONS)[number]["value"];
export type Distance = (typeof DISTANCE_OPTIONS)[number]["value"];
export type OpenStatus = (typeof OPEN_STATUS_OPTIONS)[number]["value"];
export type Sort = (typeof SORT_OPTIONS)[number]["value"];

/** 필터 그룹 식별자 — 적용된 필터 칩 삭제 시 어느 그룹을 비울지 구분한다. */
export type FilterGroup = "category" | "distance" | "open" | "sort";

/** 현재 적용된 필터 값. 미선택 그룹은 null. */
export type SearchFilters = {
  category: Category | null;
  distance: Distance | null;
  open: OpenStatus | null;
  sort: Sort | null;
};

export interface SearchSuggestion {
  placeId: string;
  text: string;
  mainText: string;
  secondaryText: string;
}
