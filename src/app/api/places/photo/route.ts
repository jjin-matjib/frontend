import { NextRequest, NextResponse } from "next/server";
import { googlePlacesClient } from "@/lib/api/google";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  const maxWidthPx = req.nextUrl.searchParams.get("maxWidthPx") ?? "600";
  if (!API_KEY) return NextResponse.json({ error: "API key missing" }, { status: 500 });
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const res = await googlePlacesClient.get(`/${name}/media`, {
    params: { maxWidthPx, key: API_KEY },
    responseType: "arraybuffer",
    validateStatus: () => true,
  });

  if (res.status < 200 || res.status >= 300) {
    return NextResponse.json({ error: "사진을 불러오지 못했습니다." }, { status: 502 });
  }

  const contentType = String(res.headers["content-type"] ?? "image/jpeg");
  return new NextResponse(res.data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
