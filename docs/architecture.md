# Architecture Convention

프로젝트의 유지보수성과 확장성을 위해 Feature 기반 아키텍처를 사용합니다.

---

# Principles

- Feature 기반으로 프로젝트를 구성한다.
- 하나의 Feature는 하나의 도메인만 책임진다.
- Component는 UI만 담당한다.
- 비즈니스 로직은 Hook으로 분리한다.
- API 호출은 api Layer에서만 수행한다.
- Feature 간 직접 의존하지 않는다.
- 공통으로 사용하는 코드는 Shared로 이동한다.

---

# Project Structure

```text
src/
├── app/
├── features/
├── components/
├── hooks/
├── providers/
├── lib/
├── styles/
├── constants/
├── types/
├── utils/
├── assets/
└── middleware.ts
```

---

# Feature Structure

하나의 Feature는 아래 구조를 기본으로 한다.

```text
features/
└── payment/
    ├── api/
    ├── components/
    ├── hooks/
    ├── schemas/
    ├── constants/
    ├── types/
    ├── utils/
    ├── index.ts
    └── page.tsx (필요 시)
```

---

# Folder Responsibility

## api

API 호출 함수만 작성한다.

포함

- fetch
- axios
- Request
- Response

포함하지 않는다.

- useQuery
- useMutation
- Toast
- Router
- UI 로직
- Business Logic

예시

```ts
getPayment();

createPayment();

updatePayment();

deletePayment();
```

---

## hooks

Feature 내부 Hook을 관리한다.

포함

- useQuery
- useMutation
- UI Logic
- State Logic
- Event Logic

예시

```ts
usePaymentQuery();

useCreatePaymentMutation();

usePaymentFilter();
```

---

## components

Feature 내부에서 사용하는 Component를 관리한다.

- UI만 담당한다.
- 다른 Feature에서 직접 import하지 않는다.
- 공통으로 사용하는 경우 Shared Component로 이동한다.

---

## schemas

- zod Schema
- Validation

---

## constants

Feature 전용 상수

예시

- Status
- Option
- Default Value

---

## types

Feature 전용 Type

예시

- Request
- Response
- DTO
- Interface

---

## utils

순수 함수만 작성한다.

포함

- Format
- Convert
- Helper

포함하지 않는다.

- API 호출
- DOM 접근
- State 변경

---

# Shared Layer

공통으로 사용하는 기능은 Shared에서 관리한다.

```text
components/
hooks/
constants/
types/
utils/
lib/
```

다음 조건이면 Shared 이동을 검토한다.

- 2개 이상의 Feature에서 사용
- 재사용성이 높음
- 비즈니스 의존성이 없음

---

# Dependency Rule

허용

```text
App
↓
Feature
↓
Shared
```

지양

```text
Feature A
↓
Feature B
```

Feature끼리 직접 의존하지 않는다.

---

# Component Responsibility

컴포넌트는 하나의 책임만 가진다.

좋은 예

```text
PaymentCard

PaymentForm

PaymentButton

PaymentList
```

지양

```text
PaymentPageComponent

PaymentContainer

PaymentManager
```

---

# Component Size

권장

- 100~200줄

검토

- 300줄 이상

분리 권장

- 500줄 이상

---

# Business Logic

비즈니스 로직은 Component에 작성하지 않는다.

권장 구조

```text
Component
    ↓
Hook
    ↓
API
```

예시

```text
PaymentForm

↓

useCreatePaymentMutation()

↓

createPayment()
```

---

# Import Rule

공통 모듈은 Alias를 사용한다.

```ts
import { Button } from "@/components/ui/button";
```

상위 디렉터리를 여러 번 올라가는 import를 지양한다.

지양

```ts
../../../hooks
../../../../components
```

---

# Server Component

기본은 Server Component를 사용한다.

Client Component는 필요한 경우에만 사용한다.

---

# Client Component

다음과 같은 경우만 사용한다.

- Event Handler
- Browser API
- React Hook
- Animation
- Local State
- Zustand
- nuqs
- TanStack Query

---

# State Responsibility

| 종류            | 사용           |
| --------------- | -------------- |
| Server State    | TanStack Query |
| Global UI State | Zustand        |
| URL State       | nuqs           |
| Local UI State  | useState       |

규칙

- Server State를 Zustand에 저장하지 않는다.
- Query Cache를 별도로 저장하지 않는다.
- URL State는 nuqs를 사용한다.

---

# Constants

하드코딩 값을 지양한다.

공통 상수는 constants에서 관리한다.

예시

- Route
- Regex
- Error Message
- Status
- Role

---

# Naming Convention

## Folder

kebab-case

```text
payment-history
```

---

## Component

PascalCase

```text
PaymentCard.tsx
```

---

## Hook

camelCase

```text
usePayment.ts

usePaymentQuery.ts

useCreatePaymentMutation.ts
```

---

## API

동사로 시작한다.

```text
getPayment()

createPayment()

updatePayment()

deletePayment()
```

---

## Query Key

기능 단위로 관리한다.

```text
paymentKeys

userKeys

authKeys
```

---

# Barrel Export

Feature는 index.ts를 통해 외부에 노출한다.

```ts
export * from "./components";
export * from "./hooks";
```

필요한 모듈만 export한다.

---

# Reusability

다음 조건이면 공통화를 검토한다.

- 2개 이상의 Feature에서 사용
- 동일한 구현이 반복됨
- 재사용성이 높음

너무 이른 추상화는 지양한다.

---

# Checklist

새로운 기능 개발 전 확인한다.

- Feature 구조를 따르는가?
- Component의 책임이 하나인가?
- Hook으로 로직을 분리했는가?
- API Layer를 사용했는가?
- Feature 간 직접 의존하지 않는가?
- Shared Layer를 적절히 사용했는가?
- Import 경로가 깔끔한가?
- Server/Client Component 경계가 적절한가?
- 하드코딩을 최소화했는가?
- 공통화가 필요한 코드가 있는가?
