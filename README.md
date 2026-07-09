# jjin-matjib

찐맛집 — 맛집 추천 서비스 프론트엔드.

```bash
pnpm install
pnpm dev
```

## 환경 변수

프로젝트 루트에 `.env.local`을 만든다. (`.gitignore`에 `.env*`가 있어 커밋되지 않는다.)

```bash
# 서버 라우트 전용 (권장 — 브라우저 번들에 노출되지 않는다)
GOOGLE_MAPS_API_KEY=AIza...

# 클라이언트에서 Maps JS SDK를 쓰는 경우에만 필요 (번들에 노출됨)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

키가 없어도 앱은 동작한다. 권역 추천(`/region`)은 **키가 없으면 더미 데이터로 응답**하고, 키를 넣고 재시작하면 코드 수정 없이 실제 API를 사용한다.

### 활성화가 필요한 Google API

| API | 사용처 |
| --- | --- |
| **Places API (New)** | 장소 검색·상세, 권역 추천의 역/식당 조회 |
| **Routes API** | 권역 추천의 대중교통 이동시간 (`computeRouteMatrix`) |

### 키 제한 주의

- 애플리케이션 제한을 **`HTTP 리퍼러`로 걸면 서버사이드 호출이 거부된다.** 서버 라우트(`/api/**`)에서 Google을 호출하므로 `없음` 또는 `IP 주소`로 설정한다.
- API 제한은 위 두 API로 좁힌다.

### 비용 주의

Places의 `rating` · `userRatingCount` · `priceLevel` · `openingHours` 필드는 **Enterprise SKU**(월 1,000회 무료)를 트리거한다. FieldMask에는 실제로 쓰는 필드만 넣는다.

## 컨벤션 문서

- [architecture.md](docs/architecture.md) — Feature 기반 아키텍처
- [frontend.md](docs/frontend.md) — 프론트엔드 컨벤션
- [api.md](docs/api.md) — TanStack Query 컨벤션
- [styling.md](docs/styling.md) — 스타일링 컨벤션
