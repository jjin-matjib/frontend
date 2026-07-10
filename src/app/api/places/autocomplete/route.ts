import { NextRequest, NextResponse } from 'next/server';
import { googlePlacesClient } from '@/lib/api/google';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const SEOUL = { latitude: 37.5665, longitude: 126.978 };

function getReferer(req: NextRequest) {
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? 'localhost:3000';
  const proto = req.headers.get('x-forwarded-proto') ?? 'http';
  return `${proto}://${host}/`;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q || q.length < 2) return NextResponse.json({ suggestions: [] });
  if (!API_KEY) return NextResponse.json({ error: 'API key missing' }, { status: 500 });

  const res = await googlePlacesClient.post('/places:autocomplete', {
    input: q,
    languageCode: 'ko',
    locationBias: {
      circle: { center: SEOUL, radius: 20000 },
    },
  }, {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'Referer': getReferer(req),
    },
    validateStatus: () => true,
  });

  const data = res.data;

  if (res.status < 200 || res.status >= 300) {
    console.error('[places/autocomplete] API error:', data?.error?.message ?? res.status);
    return NextResponse.json({ suggestions: [] });
  }

  const suggestions = (data.suggestions ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((s: any) => s.placePrediction)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((s: any) => ({
      placeId: s.placePrediction.placeId ?? '',
      text: s.placePrediction.text?.text ?? '',
      mainText: s.placePrediction.structuredFormat?.mainText?.text ?? '',
      secondaryText: s.placePrediction.structuredFormat?.secondaryText?.text ?? '',
    }));

  return NextResponse.json({ suggestions });
}
