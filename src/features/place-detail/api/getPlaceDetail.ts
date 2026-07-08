import type { PlaceDetail } from "../types";

export async function getPlaceDetail(placeId: string): Promise<PlaceDetail> {
  const res = await fetch(`/api/places/${encodeURIComponent(placeId)}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "가게 정보를 불러오지 못했습니다.");
  }
  return data.place;
}
