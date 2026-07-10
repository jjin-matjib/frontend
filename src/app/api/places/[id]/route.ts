import { NextRequest, NextResponse } from "next/server";
import { googlePlacesClient } from "@/lib/api/google";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const FIELD_MASK = [
  "id",
  "displayName",
  "primaryTypeDisplayName",
  "formattedAddress",
  "nationalPhoneNumber",
  "location",
  "rating",
  "userRatingCount",
  "currentOpeningHours.openNow",
  "regularOpeningHours.weekdayDescriptions",
  "photos.name",
].join(",");

function getReferer(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}/`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPlaceDetail(p: any) {
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!API_KEY) return NextResponse.json({ error: "API key missing" }, { status: 500 });

  const res = await googlePlacesClient.get(
    `/places/${encodeURIComponent(id)}`,
    {
      params: { languageCode: "ko" },
      headers: {
        "X-Goog-Api-Key": API_KEY,
        "Referer": getReferer(req),
        "X-Goog-FieldMask": FIELD_MASK,
      },
      validateStatus: () => true,
    },
  );

  const data = res.data;

  if (res.status < 200 || res.status >= 300) {
    const msg = data?.error?.message ?? `Google Places error (${res.status})`;
    console.error("[places/detail] API error:", msg);
    return NextResponse.json({ error: msg }, { status: res.status === 404 ? 404 : 502 });
  }

  return NextResponse.json({ place: mapPlaceDetail(data) });
}
