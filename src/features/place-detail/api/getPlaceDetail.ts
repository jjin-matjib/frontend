import type { PlaceDetail } from "../types";
import { apiClient, getApiErrorMessage } from "@/lib/api/client";

interface PlaceDetailResponse {
  place: PlaceDetail;
}

export async function getPlaceDetail(placeId: string): Promise<PlaceDetail> {
  try {
    const { data } = await apiClient.get<PlaceDetailResponse>(
      `/places/${encodeURIComponent(placeId)}`,
    );
    return data.place;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "가게 정보를 불러오지 못했습니다."),
    );
  }
}
