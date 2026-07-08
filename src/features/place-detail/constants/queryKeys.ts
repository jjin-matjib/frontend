export const placeDetailKeys = {
  all: ["place-detail"] as const,
  detail: (placeId: string) => [...placeDetailKeys.all, placeId] as const,
};
