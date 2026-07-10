import { createQueryKeys } from "@lukemorales/query-key-factory";

export const placeSearchKeys = createQueryKeys("place-search", {
  list: (query: string) => [query],
});
