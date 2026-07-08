import type { STATION_OPTIONS } from "../constants/stations";

/** 선택 가능한 역 식별자 */
export type StationId = (typeof STATION_OPTIONS)[number]["value"];

/** 드롭다운에 노출되는 역 정보 */
export interface Station {
  id: StationId;
  name: string;
  lat: number;
  lng: number;
}

/** 참여자 폼 한 행의 상태. 역 미선택 시 stationId는 null. */
export interface Participant {
  id: string;
  label: string;
  stationId: StationId | null;
}

/**
 * 서버로 보내는 출발 지점. 같은 역을 고른 참여자는 하나로 합쳐지고
 * weight(인원수)로 가중된다 — "인원 + 위치별 권역 산입".
 */
export interface RecommendOrigin {
  stationId: string;
  label: string;
  lat: number;
  lng: number;
  weight: number;
}

/** POST /api/region/recommend 요청 본문 */
export interface RecommendInput {
  origins: RecommendOrigin[];
}

/** 후보 권역 한 출발지에서의 이동시간 */
export interface OriginTravel {
  stationId: string;
  label: string;
  weight: number;
  minutes: number;
}

/** 점수까지 매겨진 후보 권역 */
export interface RankedZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** 후보 반경 내 맛집 수 (밀집도 지표) */
  restaurantCount: number;
  /** 인원 가중 평균 이동시간(분) — 낮을수록 좋음, 1순위 */
  weightedMeanMinutes: number;
  /** 이동시간 편차(분) = 최대-최소 — 낮을수록 형평성 좋음, 2순위 */
  spreadMinutes: number;
  /** 종합 점수 — 낮을수록 좋음 */
  score: number;
  perOrigin: OriginTravel[];
}

/** POST /api/region/recommend 응답 본문의 result */
export interface RecommendResult {
  recommended: RankedZone;
  candidates: RankedZone[];
}
