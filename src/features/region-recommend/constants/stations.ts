import seoulStations from "./seoul-stations.json";

/**
 * 출발 역 옵션. 서울 소재 지하철역 전체(중복 제거)를 데이터로 쓴다.
 * value/label 모두 역명(예: "강남역"), lat/lng는 인원 가중 중심점 계산에 쓴다.
 * lines는 노선 배지 표시용(환승역은 여러 개).
 * 데이터 출처: github.com/jhj0517 한국 지하철역 목록(서울만 필터, 노선명 정규화).
 */
export interface StationOption {
  value: string;
  label: string;
  lines: string[];
  lat: number;
  lng: number;
}

export const STATION_OPTIONS: StationOption[] = seoulStations.map((s) => ({
  value: s.name,
  label: s.name,
  lines: s.lines,
  lat: s.lat,
  lng: s.lng,
}));

export const STATION_VALUES = STATION_OPTIONS.map((o) => o.value);

const STATION_BY_ID = new Map<string, StationOption>(
  STATION_OPTIONS.map((o) => [o.value, o]),
);

/** value(역명)로 역 옵션을 찾는다. */
export function findStation(value: string): StationOption | undefined {
  return STATION_BY_ID.get(value);
}
