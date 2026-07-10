import axios from "axios";
import type { NextRequest } from "next/server";

const GOOGLE_API_TIMEOUT_MS = 15_000;

/**
 * 서버 라우트용 Google API 키.
 * 서버 전용 GOOGLE_MAPS_API_KEY를 우선 사용하고, 없으면 클라이언트 지도용
 * NEXT_PUBLIC 키로 폴백한다. (NEXT_PUBLIC 키는 브라우저에 노출되므로
 * 배포 시에는 서버 전용 키를 따로 두는 것을 권장)
 */
export const GOOGLE_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY ??
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
  "";

/** Google API 키의 HTTP 리퍼러 제한을 통과시키기 위한 Referer 값. */
export function getReferer(req: NextRequest) {
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}/`;
}

/** 장소 검색·자동완성 locationBias 중심(서울시청). */
export const SEOUL_CENTER = { latitude: 37.5665, longitude: 126.978 };

export const googlePlacesClient = axios.create({
  baseURL: "https://places.googleapis.com/v1",
  timeout: GOOGLE_API_TIMEOUT_MS,
});

export const googleRoutesClient = axios.create({
  baseURL: "https://routes.googleapis.com",
  timeout: GOOGLE_API_TIMEOUT_MS,
});
