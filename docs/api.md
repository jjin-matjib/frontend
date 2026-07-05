# API Convention

프로젝트의 API 호출과 Server State 관리는 TanStack Query를 기준으로 합니다.

---

# Principles

- Server State는 TanStack Query를 사용한다.
- 컴포넌트에서 fetch 또는 axios를 직접 호출하지 않는다.
- API 호출은 api layer를 통해 수행한다.
- Query Key는 기능별로 관리한다.
- Server State와 Client State를 혼합하지 않는다.

---

# Folder Structure

```text
features/
└── payment/
    ├── api/
    ├── hooks/
    ├── types/
    ├── constants/
    └── utils/
```

---

# API Layer

api에는 HTTP 요청만 작성한다.

```ts
export async function getPayment() {}

export async function postPayment() {}
```

다음은 작성하지 않는다.

- useQuery
- useMutation
- UI 로직
- Toast
- Router 이동

---

# Query Hook

조회는 Hook으로 감싼다.

```ts
usePaymentQuery();

useUserQuery();

useNotificationQuery();
```

Component에서는 Hook만 사용한다.

---

# Mutation Hook

생성

```
useCreatePaymentMutation()
```

수정

```
useUpdatePaymentMutation()
```

삭제

```
useDeletePaymentMutation()
```

---

# Query Key

기능별로 관리한다.

```ts
paymentKeys;

userKeys;

authKeys;
```

Query Key는 문자열을 직접 작성하지 않는다.

---

# Query Options

조회 데이터의 특성에 맞게 설정한다.

- staleTime
- gcTime
- retry
- enabled
- refetchOnWindowFocus

불필요한 기본값 변경은 지양한다.

---

# Cache

조회 성공 후 캐시를 적극 활용한다.

데이터 변경 시

- invalidateQueries
- setQueryData

를 적절하게 사용한다.

불필요한 refetch를 지양한다.

---

# Error Handling

- 공통 Error Handler를 사용한다.
- ErrorBoundary와 연계한다.
- API마다 중복된 에러 처리를 작성하지 않는다.

---

# Loading

Query 상태를 적극 활용한다.

- isPending
- isLoading
- isFetching
- isRefetching
- isError

---

# Pagination

다음과 같은 상태는 Query Parameter로 관리한다.

- page
- size
- sort
- filter

nuqs를 사용하여 URL과 동기화한다.

---

# Infinite Query

무한 스크롤은 useInfiniteQuery를 사용한다.

Cursor 기반 Pagination을 우선 고려한다.

---

# Optimistic Update

필요한 경우에만 사용한다.

실패 시 Rollback을 반드시 구현한다.

---

# Prefetch

가능한 경우 Prefetch를 적극 활용한다.

예시

- 상세 페이지
- Hover
- 다음 페이지

---

# Retry

조회

- 기본 Retry 사용

Mutation

- 상황에 따라 Retry 여부를 결정한다.

---

# Checklist

- Component에서 API를 직접 호출하지 않았는가?
- Query Hook을 사용했는가?
- Query Key를 재사용했는가?
- 불필요한 refetch가 없는가?
- Cache를 적절히 활용했는가?
- Error를 공통 처리했는가?
- URL State와 연동이 필요한가?
