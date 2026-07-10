import { NextRequest, NextResponse } from 'next/server';
import { getReferer, GOOGLE_API_KEY as API_KEY, googlePlacesClient, SEOUL_CENTER } from '@/lib/api/google';
import { toPlaces } from '@/features/place-search/utils/googlePlaces';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q) return NextResponse.json({ places: [] });
  if (!API_KEY) return NextResponse.json({ error: 'API key missing' }, { status: 500 });

  const res = await googlePlacesClient.post('/places:searchText', {
    textQuery: q,
    languageCode: 'ko',
    locationBias: {
      circle: { center: SEOUL_CENTER, radius: 20000 },
    },
    pageSize: 20, // searchText 페이지당 최대값이 20 — 그 이상은 nextPageToken 필요
  }, {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'Referer': getReferer(req),
      'X-Goog-FieldMask': [
        'places.id',
        'places.displayName',
        'places.primaryTypeDisplayName',
        'places.currentOpeningHours.openNow',
        'places.currentOpeningHours.periods',
        'places.rating',
        'places.userRatingCount',
        'places.types',
        'places.location',
      ].join(','),
    },
    validateStatus: () => true,
  });

  const data = res.data;

  if (res.status < 200 || res.status >= 300) {
    const msg = data?.error?.message ?? `Google Places error (${res.status})`;
    console.error('[places/search] API error:', msg);
    return NextResponse.json({ error: msg, places: [] }, { status: 502 });
  }

  return NextResponse.json({ places: toPlaces(data.places ?? []) });
}
