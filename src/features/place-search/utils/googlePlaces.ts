import { SEOUL_CENTER } from "@/lib/api/google";
import { haversine } from "@/lib/geo";
import type { Place } from "../types";

const SEOUL = { lat: SEOUL_CENTER.latitude, lng: SEOUL_CENTER.longitude };

const TYPE_KO: Record<string, string> = {
  cafe: '카페',
  coffee_shop: '커피숍',
  restaurant: '레스토랑',
  bar: '바',
  bakery: '베이커리',
  meal_takeaway: '포장',
  fast_food_restaurant: '패스트푸드',
  ice_cream_shop: '아이스크림',
  dessert_restaurant: '디저트',
  korean_restaurant: '한식',
  chinese_restaurant: '중식',
  japanese_restaurant: '일식',
  pizza_restaurant: '피자',
  hamburger_restaurant: '햄버거',
  sushi_restaurant: '스시',
  ramen_restaurant: '라멘',
  brunch_restaurant: '브런치',
  seafood_restaurant: '해산물',
  pub: '펍',
  wine_bar: '와인바',
  night_club: '나이트클럽',
};

const SKIP_TYPES = new Set(['establishment', 'point_of_interest', 'food', 'store']);

interface Period {
  open: { day: number; hour: number; minute: number };
  close: { day: number; hour: number; minute: number };
}

function todayHours(periods?: Period[]): string {
  if (!periods?.length) return '';
  const today = new Date().getDay(); // 0=Sun, 1=Mon, ...
  const period = periods.find((p) => p.open?.day === today);
  if (!period) return '';
  const fmt = (h: number, m: number) =>
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  return `${fmt(period.open.hour, period.open.minute)} ~ ${fmt(period.close.hour, period.close.minute)}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPlace(p: any, index: number): Place {
  const lat: number = p.location?.latitude ?? 0;
  const lng: number = p.location?.longitude ?? 0;
  const types: string[] = p.types ?? [];
  const tags = types
    .filter((t) => !SKIP_TYPES.has(t))
    .map((t) => TYPE_KO[t])
    .filter(Boolean)
    .slice(0, 3) as string[];

  return {
    id: p.id ?? String(index),
    name: p.displayName?.text ?? '',
    category: p.primaryTypeDisplayName?.text ?? '기타',
    isOpen: p.currentOpeningHours?.openNow ?? false,
    hours: todayHours(p.currentOpeningHours?.periods),
    rating: p.rating ?? 0,
    reviewCount: p.userRatingCount ?? 0,
    tags,
    distanceKm: Math.round(haversine(SEOUL, { lat, lng }) * 10) / 10,
    lat,
    lng,
  };
}

/** Google searchText 응답을 도메인 Place 목록으로 변환한다 (평점 내림차순). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toPlaces(rawPlaces: any[]): Place[] {
  return rawPlaces.map(mapPlace).sort((a, b) => b.rating - a.rating);
}
