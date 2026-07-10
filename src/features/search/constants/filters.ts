import type { LucideIcon } from "lucide-react";
import {
  ArrowUpDown,
  Coffee,
  Ellipsis,
  IceCreamCone,
  MapPin,
  Star,
  Store,
  UtensilsCrossed,
} from "lucide-react";

/**
 * 필터 옵션 정의. 확장판(디자인 화면 9) 기준.
 * 각 그룹은 단일 선택이며, 선택 값은 URL Query 및 목 데이터 조회의 키로 사용한다.
 */

export type FilterOption<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
};

export const CATEGORY_OPTIONS = [
  { value: "cafe", label: "카페", icon: Coffee },
  { value: "restaurant", label: "음식점", icon: UtensilsCrossed },
  { value: "dessert", label: "디저트", icon: IceCreamCone },
  { value: "convenience", label: "편의점", icon: Store },
  { value: "etc", label: "기타", icon: Ellipsis },
] as const satisfies readonly FilterOption<string>[];

export const DISTANCE_OPTIONS = [
  { value: "500", label: "500m", icon: MapPin },
  { value: "1000", label: "1km", icon: MapPin },
  { value: "2000", label: "2km", icon: MapPin },
  { value: "5000", label: "5km", icon: MapPin },
  { value: "all", label: "전체", icon: MapPin },
] as const satisfies readonly FilterOption<string>[];

export const OPEN_STATUS_OPTIONS = [
  { value: "open_now", label: "현재 영업중" },
  { value: "operating", label: "운영 중" },
  { value: "include_closed", label: "영업 종료 포함" },
] as const satisfies readonly FilterOption<string>[];

export const SORT_OPTIONS = [
  { value: "recommend", label: "추천순", icon: Star },
  { value: "distance", label: "거리순", icon: ArrowUpDown },
  { value: "rating", label: "평점순", icon: Star },
  { value: "reviews", label: "리뷰 많은순", icon: Star },
] as const satisfies readonly FilterOption<string>[];

export const CATEGORY_VALUES = CATEGORY_OPTIONS.map((o) => o.value);
export const DISTANCE_VALUES = DISTANCE_OPTIONS.map((o) => o.value);
export const OPEN_STATUS_VALUES = OPEN_STATUS_OPTIONS.map((o) => o.value);
export const SORT_VALUES = SORT_OPTIONS.map((o) => o.value);

/** 최근 검색 기록 저장 키 및 최대 개수 */
export const RECENT_SEARCHES_KEY = "mapbridge:recent-searches";
export const RECENT_SEARCHES_MAX = 10;
