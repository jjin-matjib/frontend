import { NextRequest, NextResponse } from "next/server";
import {
  CANDIDATE_SEARCH_RADIUS_M,
  MAX_CANDIDATES,
  MAX_MATRIX_DESTINATIONS,
  RESTAURANT_DENSITY_RADIUS_M,
} from "@/features/region-recommend/constants/config";
import type {
  OriginTravel,
  RecommendInput,
  RecommendOrigin,
} from "@/features/region-recommend/types";
import {
  prefilterByHaversine,
  weightedCentroid,
} from "@/features/region-recommend/utils/geo";
import {
  rankZones,
  type ScorableZone,
} from "@/features/region-recommend/utils/score";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const PLACES_NEARBY_URL = "https://places.googleapis.com/v1/places:searchNearby";
const ROUTE_MATRIX_URL =
  "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix";

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

/** Places searchNearby 호출. type별 장소 목록을 좌표와 함께 돌려준다. */
async function searchNearby(
  req: NextRequest,
  center: { lat: number; lng: number },
  includedType: string,
  radius: number,
  maxResultCount: number,
) {
  const res = await fetch(PLACES_NEARBY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      Referer: getReferer(req),
      "X-Goog-FieldMask": "places.id,places.displayName,places.location",
    },
    body: JSON.stringify({
      includedTypes: [includedType],
      maxResultCount,
      rankPreference: "DISTANCE",
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

    // 3. 실제 이동시간(단일 배치) + 후보별 맛집 밀집도
    const minutes = await computeTransitMinutes(req, origins, survivors);
    const restaurantCounts = await Promise.all(
      survivors.map((s) =>
        searchNearby(req, s, "restaurant", RESTAURANT_DENSITY_RADIUS_M, 20).then(
          (list) => list.length,
        ),
      ),
    );

    // 4. 채점·랭킹
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
        restaurantCount: restaurantCounts[di],
        perOrigin,
      };
    });

    const ranked = rankZones(scorable);
    return NextResponse.json({
      result: { recommended: ranked[0], candidates: ranked },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "추천에 실패했습니다.";
    console.error("[region/recommend] API error:", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
