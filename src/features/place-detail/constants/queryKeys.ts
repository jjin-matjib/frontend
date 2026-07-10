import { createQueryKeys } from "@lukemorales/query-key-factory";

export const placeDetailKeys = createQueryKeys("place-detail", {
  detail: (placeId: string) => [placeId],
});
