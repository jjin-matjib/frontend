/**
 * 출발 역 드롭다운 옵션. 수도권 주요 역을 큐레이션했다.
 * value는 URL/식별자, label은 표시명, lat/lng는 인원 가중 중심점 계산에 쓴다.
 * (전국 확장이나 별도 역 데이터 출처가 생기면 이 상수를 교체한다.)
 */
export interface StationOption {
  value: string;
  label: string;
  lat: number;
  lng: number;
}

export const STATION_OPTIONS = [
  { value: "gangnam", label: "강남", lat: 37.4979, lng: 127.0276 },
  { value: "hongdae", label: "홍대입구", lat: 37.5572, lng: 126.9245 },
  { value: "sillim", label: "신림", lat: 37.4842, lng: 126.9297 },
  { value: "konkuk", label: "건대입구", lat: 37.5405, lng: 127.07 },
  { value: "yeouido", label: "여의도", lat: 37.5216, lng: 126.9243 },
  { value: "jamsil", label: "잠실", lat: 37.5133, lng: 127.1001 },
  { value: "seongsu", label: "성수", lat: 37.5446, lng: 127.0559 },
  { value: "jongno3", label: "종로3가", lat: 37.5704, lng: 126.9917 },
  { value: "seoulstn", label: "서울역", lat: 37.5559, lng: 126.9723 },
  { value: "sadang", label: "사당", lat: 37.4765, lng: 126.9816 },
  { value: "wangsimni", label: "왕십리", lat: 37.5614, lng: 127.0378 },
  { value: "sinchon", label: "신촌", lat: 37.555, lng: 126.9369 },
] as const satisfies readonly StationOption[];

export const STATION_VALUES = STATION_OPTIONS.map((o) => o.value);

const STATION_BY_ID = new Map<string, StationOption>(
  STATION_OPTIONS.map((o) => [o.value, o] as [string, StationOption]),
);

/** value로 역 옵션을 찾는다. */
export function findStation(value: string): StationOption | undefined {
  return STATION_BY_ID.get(value);
}
