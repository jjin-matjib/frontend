import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  const maxWidthPx = req.nextUrl.searchParams.get("maxWidthPx") ?? "600";
  if (!API_KEY) return NextResponse.json({ error: "API key missing" }, { status: 500 });
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const res = await fetch(
    `https://places.googleapis.com/v1/${name}/media?maxWidthPx=${maxWidthPx}&key=${API_KEY}`,
  );

  if (!res.ok) {
    return NextResponse.json({ error: "사진을 불러오지 못했습니다." }, { status: 502 });
  }

  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const bytes = await res.arrayBuffer();
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
