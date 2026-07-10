import type { PlaceDetail } from "../types";

/** Google Place Details 응답을 도메인 PlaceDetail로 변환한다. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toPlaceDetail(p: any): PlaceDetail {
  return {
    id: p.id ?? "",
    name: p.displayName?.text ?? "",
    category: p.primaryTypeDisplayName?.text ?? "기타",
    isOpen: p.currentOpeningHours?.openNow ?? false,
    weekdayHours: (p.regularOpeningHours?.weekdayDescriptions ?? []).map((line: string) =>
      line.replace("요일", ""),
    ),
    phone: p.nationalPhoneNumber ?? "",
    address: p.formattedAddress ?? "",
    rating: p.rating ?? 0,
    reviewCount: p.userRatingCount ?? 0,
    lat: p.location?.latitude ?? 0,
    lng: p.location?.longitude ?? 0,
    photoName: p.photos?.[0]?.name ?? null,
  };
}
