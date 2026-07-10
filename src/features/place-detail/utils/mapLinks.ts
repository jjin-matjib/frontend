interface MapLinkPlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export function getKakaoMapUrl({ name, lat, lng }: MapLinkPlace) {
  // 웹에서도 열리는 공식 바로가기 URL — 모바일이면 앱 연결까지 처리해준다.
  // (kakaomap:// 스킴은 앱이 없는 환경에서 아무 동작도 하지 않는다)
  return `https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lng}`;
}

export function getNaverMapUrl({ name }: MapLinkPlace) {
  return `https://map.naver.com/p/search/${encodeURIComponent(name)}`;
}

export function getGoogleMapUrl({ id, lat, lng }: MapLinkPlace) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${id}`;
}
