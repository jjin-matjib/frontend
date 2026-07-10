import { NextRequest, NextResponse } from "next/server";
import { googlePlacesClient, googleRoutesClient } from "@/lib/api/google";
import {
  CANDIDATE_SEARCH_RADIUS_M,
  MAX_CANDIDATES,
  MAX_MATRIX_DESTINATIONS,
  RESTAURANT_SAMPLE_SIZE,
  RESTAURANT_SEARCH_RADIUS_M,
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
  excludeUnrated,
  sortByBayesian,
} from "@/features/region-recommend/utils/quality";
import {
  rankZones,
  type ScorableZone,
} from "@/features/region-recommend/utils/score";

/**
 * 서버 전용 키를 우선 읽고, 팀 공용 변수명으로 폴백한다.
 * 키가 없으면 Mock으로 응답하므로 `.env.local`에 키만 꽂으면 실 API로 전환된다.
 */
const API_KEY =
  process.env.GOOGLE_MAPS_API_KEY ??
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
  "";

/** 역 검색은 평점이 필요 없다 → Pro SKU(월 5,000 무료). */
const STATION_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.location",
].join(",");

/** 식당은 평점·리뷰수가 필요하다 → Enterprise SKU(월 1,000 무료). 우승 권역 1곳에만 쓴다. */
const RESTAURANT_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.location",
  "places.primaryTypeDisplayName",
  "places.rating",
  "places.userRatingCount",
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

/** Places searchNearby 호출. fieldMask가 과금 SKU를 결정하므로 호출부에서 최소한으로 넘긴다. */
async function searchNearby(
  req: NextRequest,
  center: { lat: number; lng: number },
  includedType: string,
  radius: number,
  maxResultCount: number,
  rankPreference: "DISTANCE" | "POPULARITY",
  fieldMask: string,
) {
  const res = await googlePlacesClient.post("/places:searchNearby", {
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
  }, {
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      Referer: getReferer(req),
      "X-Goog-FieldMask": fieldMask,
    },
    validateStatus: () => true,
  });
  const data = res.data;
  if (res.status < 200 || res.status >= 300) {
    throw new Error(data?.error?.message ?? `Google Places error (${res.status})`);
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
  const res = await googleRoutesClient.post("/distanceMatrix/v2:computeRouteMatrix", {
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
  }, {
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      Referer: getReferer(req),
      "X-Goog-FieldMask": "originIndex,destinationIndex,duration,condition",
    },
    validateStatus: () => true,
  });
  const data = res.data;
  if (res.status < 200 || res.status >= 300) {
    throw new Error(data?.error?.message ?? `Google Routes error (${res.status})`);
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

/** 추천 권역 주변 인기 식당 표본(최대 20곳). 실패해도 추천 자체는 살린다. */
async function fetchRestaurants(
  req: NextRequest,
  zone: Candidate,
): Promise<Restaurant[]> {
  try {
    const places = await searchNearby(
      req,
      zone,
      "restaurant",
      RESTAURANT_SEARCH_RADIUS_M,
      RESTAURANT_SAMPLE_SIZE,
      "POPULARITY",
      RESTAURANT_FIELD_MASK,
    );
    const restaurants: Restaurant[] = places.map((p) => ({
      id: p.id ?? "",
      name: p.displayName?.text ?? "",
      category: p.primaryTypeDisplayName?.text ?? "음식점",
      rating: p.rating ?? 0,
      reviewCount: p.userRatingCount ?? 0,
      distanceM: Math.round(
        haversine(zone, {
          lat: p.location?.latitude ?? 0,
          lng: p.location?.longitude ?? 0,
        }) * 1000,
      ),
    }));
    return sortByBayesian(excludeUnrated(restaurants));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.error("[region/recommend] restaurants fetch failed:", msg);
    return [];
  }
}

export async function POST(req: NextRequest) {
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

  // 키가 없으면 더미로 응답한다. 키를 꽂으면 코드 수정 없이 실 API로 전환된다.
  if (!API_KEY) {
    return NextResponse.json(
      { error: "Google Maps API key is missing" },
      { status: 500 },
    );
  }

  try {
    // 1. 후보 권역 발굴: 중심점 주변 지하철역 (Pro SKU, 1콜)
    const nearby = await searchNearby(
      req,
      center,
      "subway_station",
      CANDIDATE_SEARCH_RADIUS_M,
      MAX_CANDIDATES,
      "DISTANCE",
      STATION_FIELD_MASK,
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

    // 3. 실제 대중교통 이동시간 (단일 배치, 1콜)
    const minutes = await computeTransitMinutes(req, origins, survivors);

    // 4. 채점·랭킹 — 이동시간 + 형평성만으로 권역을 정한다
    const scorable: ScorableZone[] = survivors.map((zone, di) => ({
      id: zone.id,
      name: zone.name,
      lat: zone.lat,
      lng: zone.lng,
      perOrigin: origins.map<OriginTravel>((origin, oi) => ({
        stationId: origin.stationId,
        label: origin.label,
        weight: origin.weight,
        minutes: minutes[oi][di],
      })),
    }));

    const ranked = rankZones(scorable);
    if (ranked.length === 0) {
      return NextResponse.json(
        { error: "모든 출발지에서 갈 수 있는 권역을 찾지 못했습니다." },
        { status: 404 },
      );
    }

    // 5. 맛집은 우승 권역에만 조회한다 (Enterprise SKU, 1콜)
    const restaurants = await fetchRestaurants(req, ranked[0]);

    return NextResponse.json({
      result: { recommended: ranked[0], candidates: ranked, restaurants },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "추천에 실패했습니다.";
    console.error("[region/recommend] API error:", msg);
    if (msg.includes("Google Routes error (403)")) {
      return NextResponse.json(
        {
          error:
            "Google Routes API 사용 권한이 없습니다. Google Cloud에서 Routes API와 현재 API 키 제한을 확인해 주세요.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
