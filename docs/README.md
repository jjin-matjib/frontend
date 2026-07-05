# 📚 Frontend Team Convention

프로젝트의 일관성 있는 개발과 유지보수를 위해 아래 컨벤션을 준수합니다.

## 📖 Documents

| 문서              | 설명                                 |
| ----------------- | ------------------------------------ |
| `frontend.md`     | React / Next.js 개발 규칙            |
| `styling.md`      | UI, Design System, 반응형, CSS 규칙  |
| `architecture.md` | 프로젝트 구조 및 컴포넌트 설계       |
| `api.md`          | API Layer, TanStack Query, Query Key |
| `git.md`          | Git Flow, Branch, Commit, PR 규칙    |
| `code-review.md`  | 코드 리뷰 체크리스트                 |

---

## 🛠 Tech Stack

- Next.js (App Router)
- React
- TypeScript (Strict Mode)
- TanStack Query
- Zustand
- react-hook-form
- zod
- nuqs
- shadcn/ui

---

## 🎯 Goal

프로젝트의 목표는 다음과 같습니다.

- 일관된 코드 스타일 유지
- 높은 유지보수성
- 재사용 가능한 컴포넌트 작성
- 예측 가능한 상태 관리
- 반응형 UI 제공
- 안정적인 협업 환경 구축

---

## 📁 Project Structure

```text
docs/
├── README.md
├── frontend.md
├── styling.md
├── architecture.md
├── api.md
├── git.md
└── code-review.md
```

---

## 🚀 Development Principles

개발 시 아래 원칙을 항상 고려합니다.

- Design System을 우선한다.
- Feature 단위로 개발한다.
- Server State와 Client State를 명확히 구분한다.
- 공통 컴포넌트를 적극적으로 재사용한다.
- Type Safety를 유지한다.
- 반응형 UI를 기본으로 고려한다.
- 코드보다 일관성을 우선한다.

---

## 📌 Convention Priority

규칙이 충돌하는 경우 아래 우선순위를 따릅니다.

1. Design System
2. Frontend Convention
3. Architecture Convention
4. Styling Convention
5. API Convention
6. Git Convention

---

## 🤝 Collaboration Rules

- 새로운 규칙은 팀원과 논의 후 문서에 추가합니다.
- 컨벤션 변경은 Pull Request를 통해 관리합니다.
- 문서와 구현이 다를 경우 문서를 먼저 수정한 후 개발을 진행합니다.
