interface MapLinkPlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export function getKakaoMapUrl({ name, lat, lng }: MapLinkPlace) {
  return `https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lng}`;
}

export function getNaverMapUrl({ name }: MapLinkPlace) {
  return `https://map.naver.com/p/search/${encodeURIComponent(name)}`;
}

export function getGoogleMapUrl({ id, lat, lng }: MapLinkPlace) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${id}`;
}
