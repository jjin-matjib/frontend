import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const SEOUL = { latitude: 37.5665, longitude: 126.978 };

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

function calcDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPlace(p: any, index: number) {
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
    distanceKm: calcDistanceKm(SEOUL.latitude, SEOUL.longitude, lat, lng),
    lat,
    lng,
  };
}

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

function getReferer(req: NextRequest) {
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? 'localhost:3000';
  const proto = req.headers.get('x-forwarded-proto') ?? 'http';
  return `${proto}://${host}/`;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q) return NextResponse.json({ places: [] });
  if (!API_KEY) return NextResponse.json({ error: 'API key missing' }, { status: 500 });

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'Referer': getReferer(req),
      'X-Goog-FieldMask': [
        'places.id',
        'places.displayName',
        'places.primaryTypeDisplayName',
        'places.currentOpeningHours.openNow',
        'places.currentOpeningHours.periods',
        'places.rating',
        'places.userRatingCount',
        'places.types',
        'places.location',
      ].join(','),
    },
    body: JSON.stringify({
      textQuery: q,
      languageCode: 'ko',
      locationBias: {
        circle: { center: SEOUL, radius: 20000 },
      },
      pageSize: 20,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = data?.error?.message ?? res.statusText;
    console.error('[places/search] API error:', msg);
    return NextResponse.json({ error: msg, places: [] }, { status: 502 });
  }

  const places = (data.places ?? [])
    .map(mapPlace)
    .sort((a: { rating: number }, b: { rating: number }) => b.rating - a.rating);

  return NextResponse.json({ places });
}
