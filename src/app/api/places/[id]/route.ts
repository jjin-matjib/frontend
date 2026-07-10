import { NextRequest, NextResponse } from "next/server";
import { getReferer, GOOGLE_API_KEY as API_KEY, googlePlacesClient } from "@/lib/api/google";
import { toPlaceDetail } from "@/features/place-detail/utils/googlePlaceDetail";

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

  return NextResponse.json({ place: toPlaceDetail(data) });
}
