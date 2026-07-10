interface MapLinkPlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export function getKakaoMapUrl({ lat, lng }: MapLinkPlace) {
  return `kakaomap://look?p=${lat},${lng}`;
}

export function getNaverMapUrl({ name }: MapLinkPlace) {
  return `https://map.naver.com/p/search/${encodeURIComponent(name)}`;
}

export function getGoogleMapUrl({ id, lat, lng }: MapLinkPlace) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${id}`;
}
