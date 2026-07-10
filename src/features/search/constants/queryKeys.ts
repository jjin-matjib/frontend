import { createQueryKeys } from "@lukemorales/query-key-factory";

export const searchKeys = createQueryKeys("search", {
  autocomplete: (query: string) => [query],
});
