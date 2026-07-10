"use client";

import { useQuery } from "@tanstack/react-query";
import { getPlaceDetail } from "../api/getPlaceDetail";
import { placeDetailKeys } from "../constants/queryKeys";

const PLACE_DETAIL_STALE_TIME_MS = 5 * 60 * 1000;

export function usePlaceDetailQuery(placeId: string) {
  return useQuery({
    queryKey: placeDetailKeys.detail(placeId).queryKey,
    queryFn: () => getPlaceDetail(placeId),
    staleTime: PLACE_DETAIL_STALE_TIME_MS,
  });
}
