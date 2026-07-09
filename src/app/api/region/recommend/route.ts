import { NextRequest, NextResponse } from "next/server";
import {
  CANDIDATE_SEARCH_RADIUS_M,
  MAX_CANDIDATES,
  MAX_MATRIX_DESTINATIONS,
  RESTAURANT_DENSITY_RADIUS_M,
  RESTAURANT_SAMPLE_SIZE,
} from "@/features/region-recommend/constants/config";
import type {
  OriginTravel,
  RecommendInput,
  RecommendOrigin,
  Restaurant,
} from "@/features/region-recommend/types";
import {
  haversine,
  prefilterByHaversine,
  weightedCentroid,
} from "@/features/region-recommend/utils/geo";
import {
  countGoodRestaurants,
  sortByBayesian,
} from "@/features/region-recommend/utils/quality";
import {
  rankZones,
  type ScorableZone,
} from "@/features/region-recommend/utils/score";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const PLACES_NEARBY_URL = "https://places.googleapis.com/v1/places:searchNearby";
const ROUTE_MATRIX_URL =
  "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix";

// 평점·리뷰수까지 함께 받아 "좋은 식당 밀도"와 맛집 리스트를 추가 호출 없이 계산한다.
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.primaryTypeDisplayName",
].join(",");

interface Candidate {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

function getReferer(req: NextRequest) {
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}/`;
}

/** Places searchNearby 호출. */
async function searchNearby(
  req: NextRequest,
  center: { lat: number; lng: number },
  includedType: string,
  radius: number,
  maxResultCount: number,
  rankPreference: "DISTANCE" | "POPULARITY",
) {
  const res = await fetch(PLACES_NEARBY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      Referer: getReferer(req),
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({
      includedTypes: [includedType],
      maxResultCount,
      rankPreference,
      languageCode: "ko",
      locationRestriction: {
        circle: {
          center: { latitude: center.lat, longitude: center.lng },
          radius,
        },
      },
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? res.statusText);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.places ?? []) as any[];
}

/** Routes API computeRouteMatrix(대중교통). origin×destination 이동시간(분) 행렬. */
async function computeTransitMinutes(
  req: NextRequest,
  origins: RecommendOrigin[],
  destinations: Candidate[],
): Promise<number[][]> {
  const res = await fetch(ROUTE_MATRIX_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      Referer: getReferer(req),
      "X-Goog-FieldMask": "originIndex,destinationIndex,duration,condition",
    },
    body: JSON.stringify({
      origins: origins.map((o) => ({
        waypoint: {
          location: { latLng: { latitude: o.lat, longitude: o.lng } },
        },
      })),
      destinations: destinations.map((d) => ({
        waypoint: {
          location: { latLng: { latitude: d.lat, longitude: d.lng } },
        },
      })),
      travelMode: "TRANSIT",
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? res.statusText);
  }

  const matrix: number[][] = origins.map(() =>
    destinations.map(() => Number.POSITIVE_INFINITY),
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const el of data as any[]) {
    if (el.condition !== "ROUTE_EXISTS" || typeof el.duration !== "string") {
      continue;
    }
    const seconds = Number(el.duration.replace("s", ""));
    matrix[el.originIndex][el.destinationIndex] = Math.round(seconds / 60);
  }
  return matrix;
}

/** 후보 역 주변 인기 식당 표본을 Restaurant[]로 변환한다. */
async function fetchRestaurants(
  req: NextRequest,
  zone: Candidate,
): Promise<Restaurant[]> {
  const places = await searchNearby(
    req,
    zone,
    "restaurant",
    RESTAURANT_DENSITY_RADIUS_M,
    RESTAURANT_SAMPLE_SIZE,
    "POPULARITY",
  );
  return places.map((p) => {
    const lat = p.location?.latitude ?? 0;
    const lng = p.location?.longitude ?? 0;
    return {
      id: p.id ?? "",
      name: p.displayName?.text ?? "",
      category: p.primaryTypeDisplayName?.text ?? "음식점",
      rating: p.rating ?? 0,
      reviewCount: p.userRatingCount ?? 0,
      distanceM: Math.round(haversine(zone, { lat, lng }) * 1000),
    };
  });
}

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }

  let input: RecommendInput;
  try {
    input = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const origins = input.origins ?? [];
  const center = weightedCentroid(origins);
  if (!center || origins.length === 0) {
    return NextResponse.json(
      { error: "출발지가 필요합니다." },
      { status: 400 },
    );
  }

  try {
    // 1. 후보 권역 발굴: 중심점 주변 지하철역
    const nearby = await searchNearby(
      req,
      center,
      "subway_station",
      CANDIDATE_SEARCH_RADIUS_M,
      MAX_CANDIDATES,
      "DISTANCE",
    );
    const candidates: Candidate[] = nearby.map((p) => ({
      id: p.id,
      name: p.displayName?.text ?? "역",
      lat: p.location?.latitude ?? 0,
      lng: p.location?.longitude ?? 0,
    }));
    if (candidates.length === 0) {
      return NextResponse.json(
        { error: "주변에서 후보 권역을 찾지 못했습니다." },
        { status: 404 },
      );
    }

    // 2. Haversine 사전필터로 유료 호출 대상 축소
    const survivors = prefilterByHaversine(
      origins,
      candidates,
      MAX_MATRIX_DESTINATIONS,
    );

    // 3. 실제 이동시간(단일 배치) + 후보별 식당 표본(평점·리뷰수 포함)
    const minutes = await computeTransitMinutes(req, origins, survivors);
    const restaurantsByZone = await Promise.all(
      survivors.map((zone) => fetchRestaurants(req, zone)),
    );

    // 4. 채점·랭킹 — 밀집도는 "식당 개수"가 아니라 "좋은 식당 수"
    const scorable: ScorableZone[] = survivors.map((zone, di) => {
      const perOrigin: OriginTravel[] = origins.map((origin, oi) => ({
        stationId: origin.stationId,
        label: origin.label,
        weight: origin.weight,
        minutes: minutes[oi][di],
      }));
      return {
        id: zone.id,
        name: zone.name,
        lat: zone.lat,
        lng: zone.lng,
        goodRestaurantCount: countGoodRestaurants(restaurantsByZone[di]),
        perOrigin,
      };
    });

    const ranked = rankZones(scorable);
    if (ranked.length === 0) {
      return NextResponse.json(
        { error: "모든 출발지에서 갈 수 있는 권역을 찾지 못했습니다." },
        { status: 404 },
      );
    }
    const recommendedIndex = survivors.findIndex((z) => z.id === ranked[0].id);

    return NextResponse.json({
      result: {
        recommended: ranked[0],
        candidates: ranked,
        restaurants: sortByBayesian(restaurantsByZone[recommendedIndex] ?? []),
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "추천에 실패했습니다.";
    console.error("[region/recommend] API error:", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
