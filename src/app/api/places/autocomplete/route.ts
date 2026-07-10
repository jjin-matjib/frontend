import { NextRequest, NextResponse } from 'next/server';
import { getReferer, GOOGLE_API_KEY as API_KEY, googlePlacesClient, SEOUL_CENTER } from '@/lib/api/google';
import { toSuggestions } from '@/features/search/utils/googleSuggestions';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q || q.length < 2) return NextResponse.json({ suggestions: [] });
  if (!API_KEY) return NextResponse.json({ error: 'API key missing' }, { status: 500 });

  const res = await googlePlacesClient.post('/places:autocomplete', {
    input: q,
    languageCode: 'ko',
    locationBias: {
      circle: { center: SEOUL_CENTER, radius: 20000 },
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

  return NextResponse.json({ suggestions: toSuggestions(data.suggestions ?? []) });
}
