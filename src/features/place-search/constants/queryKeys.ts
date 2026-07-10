export const placeSearchKeys = {
  all: ["place-search"] as const,
  list: (query: string) => [...placeSearchKeys.all, "list", query] as const,
};
