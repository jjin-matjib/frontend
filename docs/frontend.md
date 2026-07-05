# Frontend Convention

프로젝트의 일관성과 유지보수성을 위해 아래 규칙을 준수합니다.

---

# Tech Stack

- Next.js (App Router)
- React
- TypeScript
- TanStack Query
- Zustand
- react-hook-form
- zod
- nuqs
- shadcn/ui

---

# Component

## Server Component

- Server Component를 기본으로 사용한다.
- Client Component가 필요한 경우에만 `"use client"`를 선언한다.
- 불필요한 Client Component 사용을 지양한다.

## Client Component

다음과 같은 경우에만 사용한다.

- Browser API 사용
- Event Handler 사용
- React Hook 사용
- Client State 사용

---

# State Management

상태의 역할을 명확하게 구분한다.

| 종류            | 사용           |
| --------------- | -------------- |
| Server State    | TanStack Query |
| URL State       | nuqs           |
| Global UI State | Zustand        |
| Local UI State  | useState       |

## Rules

- Server State를 Zustand에 저장하지 않는다.
- Query Cache를 별도 상태로 복사하지 않는다.
- UI State와 Server State를 혼합하지 않는다.
- 전역 상태는 꼭 필요한 경우에만 사용한다.

---

# URL State

다음 상태는 Query Parameter로 관리한다.

- 검색
- 필터
- 정렬
- 페이지
- 탭

Query Parameter는 nuqs를 사용한다.

다음 상태는 URL에 저장하지 않는다.

- Modal
- BottomSheet
- Drawer
- Toast
- Tooltip
- Hover
- Loading

---

# Data Fetching

- 서버 데이터는 TanStack Query를 사용한다.
- 컴포넌트 내부에서 fetch, axios를 직접 호출하지 않는다.
- API Layer를 통해 데이터를 조회한다.

---

# Form

- react-hook-form을 사용한다.
- Validation은 zod를 사용한다.
- useState로 Form을 직접 관리하지 않는다.

---

# Suspense

- Suspense를 적극 활용한다.
- fallback은 Spinner를 기본으로 사용한다.
- 페이지 전체보다 영역 단위 Suspense를 권장한다.
- Streaming Rendering을 적극 활용한다.

---

# Loading UI

비동기 화면은 아래 상태를 반드시 고려한다.

- Loading
- Success
- Empty
- Error

Skeleton은 아래와 같은 경우 사용한다.

- List
- Card
- Table
- Detail Page
- Layout이 미리 보여야 하는 경우

---

# Error Handling

- ErrorBoundary를 적극 활용한다.
- API Error는 공통 로직으로 처리한다.
- alert() 사용을 지양한다.
- 사용자에게 명확한 Error Message를 제공한다.

---

# Performance

- 불필요한 리렌더링을 최소화한다.
- Dynamic Import를 적극 활용한다.
- Lazy Loading이 가능한 경우 적극 활용한다.
- React.memo는 필요한 경우에만 사용한다.
- useMemo와 useCallback은 성능 측정 후 적용한다.

---

# TypeScript

- TypeScript Strict Mode를 사용한다.
- any 사용을 지양한다.
- 타입은 최대한 재사용한다.
- API Response Type을 정의한다.

---

# React Rules

- React Hook Rule을 준수한다.
- 불필요한 useEffect 사용을 지양한다.
- Derived State를 만들지 않는다.
- Key는 안정적인 값을 사용한다.
- 컴포넌트는 하나의 책임만 갖도록 작성한다.

---

# Common

- Console.log는 Merge 전에 제거한다.
- TODO는 이슈 번호와 함께 작성한다.
- Magic Number 사용을 지양한다.
- 공통 상수는 constants에서 관리한다.
- 공통 로직은 hook 또는 util로 분리한다.
- 중복 구현보다 재사용을 우선한다.
- 기존 컨벤션을 우회하는 구현은 지양한다.
