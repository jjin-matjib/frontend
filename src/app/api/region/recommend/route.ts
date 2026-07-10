import { NextRequest, NextResponse } from "next/server";
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
import { buildMockResult } from "@/features/region-recommend/utils/mockRecommend";
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

const PLACES_NEARBY_URL = "https://places.googleapis.com/v1/places:searchNearby";
const ROUTE_MATRIX_URL =
  "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix";

/**
 * 후보 권역으로 쓸 역 타입.
 * Places API(New)의 `includedTypes`는 Table A 타입만 허용한다.
 * `subway_station`은 Table B(응답 전용)라 필터로 넣으면 400이 난다.
 * 한국 지하철역은 Google에서 train_station / transit_station 으로도 분류되므로 이 둘을 쓴다.
 */
const STATION_INCLUDED_TYPES = ["train_station", "transit_station"];

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

/**
 * Places searchNearby 호출. fieldMask가 과금 SKU를 결정하므로 호출부에서 최소한으로 넘긴다.
 * includedTypes에는 **Table A 타입만** 넣을 수 있다(Table B를 넣으면 400).
 */
async function searchNearby(
  req: NextRequest,
  center: { lat: number; lng: number },
  includedTypes: string[],
  radius: number,
  maxResultCount: number,
  rankPreference: "DISTANCE" | "POPULARITY",
  fieldMask: string,
) {
  const res = await fetch(PLACES_NEARBY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      Referer: getReferer(req),
      "X-Goog-FieldMask": fieldMask,
    },
    body: JSON.stringify({
      includedTypes,
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

/** 추천 권역 주변 인기 식당 표본(최대 20곳). 실패해도 추천 자체는 살린다. */
async function fetchRestaurants(
  req: NextRequest,
  zone: Candidate,
): Promise<Restaurant[]> {
  try {
    const places = await searchNearby(
      req,
      zone,
      ["restaurant"],
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
    return NextResponse.json({ result: buildMockResult(input), mock: true });
  }

  try {
    // 1. 후보 권역 발굴: 중심점 주변 역 (Pro SKU, 1콜)
    //    `subway_station`은 Table B라 includedTypes에 넣을 수 없다(400).
    //    Table A인 train_station·transit_station으로 지하철역을 포함해 조회한다.
    const nearby = await searchNearby(
      req,
      center,
      STATION_INCLUDED_TYPES,
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
      mock: false,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "추천에 실패했습니다.";
    console.error("[region/recommend] API error:", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
