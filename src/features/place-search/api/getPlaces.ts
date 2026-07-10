import { apiClient, getApiErrorMessage } from "@/lib/api/client";
import type { Place } from "../types";

interface PlaceSearchResponse {
  places: Place[];
}

export async function getPlaces(query: string): Promise<Place[]> {
  try {
    const { data } = await apiClient.get<PlaceSearchResponse>("/places/search", {
      params: { q: query },
    });
    return data.places;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "검색 중 오류가 발생했습니다."));
  }
}
