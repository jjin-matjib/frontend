import { findStation } from "../constants/stations";
import type { RecommendInput, RecommendOrigin } from "../types";

/** 참여자 폼 한 행의 값. 역 미선택 시 stationId는 null. */
export interface ParticipantValue {
  stationId: string | null;
}

/**
 * 참여자들을 역 단위로 합쳐 인원 가중 출발지로 만든다.
 * 같은 역을 고른 참여자는 하나로 묶이고 weight(인원수)로 가중된다.
 */
export function toOrigins(participants: ParticipantValue[]): RecommendInput {
  const byStation = new Map<string, RecommendOrigin>();

  for (const participant of participants) {
    if (!participant.stationId) continue;
    const station = findStation(participant.stationId);
    if (!station) continue;

    const existing = byStation.get(station.value);
    if (existing) {
      existing.weight += 1;
    } else {
      byStation.set(station.value, {
        stationId: station.value,
        label: station.label,
        lat: station.lat,
        lng: station.lng,
        weight: 1,
      });
    }
  }

  return { origins: [...byStation.values()] };
}
