---
description: goal을 입력하면 이슈 등록 → 브랜치 생성 → 구현 → PR 생성까지 로컬에서 한 번에 수행한다
---

사용자가 입력한 goal: $ARGUMENTS

goal이 비어 있으면 무엇을 하고 싶은지 물어본 뒤 진행한다.
저장소는 `jjin-matjib/frontend`, 기본 작업 브랜치는 `develop`이다.

아래 플로우를 순서대로 전부 수행한다.

## 1. 이슈 등록

1. goal을 분석해 유형 라벨을 고른다: 기능/개선 → `enhancement`, 버그 → `bug`, 문서 → `documentation`
2. 제목: `[FEAT]` / `[FIX]` / `[DOCS]` 접두사 + 한 줄 요약 (한국어)
3. 본문은 팀 이슈 템플릿 형식을 따른다:

   ```markdown
   ## 🎯 개요
   > (goal의 목적과 이유를 1~3문장으로)

   ## 💬 작업 내용
   - [ ] (구현할 작업을 구체적인 체크리스트로)

   ## ⚠️ 특이사항( 참고 )
   > (제약 조건, 참고할 코드/문서)
   ```

4. 이슈 초안(제목/라벨/본문)을 사용자에게 보여주고 확인받은 뒤 `gh issue create --label claude --label <유형라벨>`로 등록하고 이슈 번호를 확보한다.

## 2. 브랜치 생성

develop이나 main 위에서 직접 작업하지 않는다. 반드시 작업 브랜치를 만든다.

- 브랜치 이름: `feat/<kebab-case-설명>` (예: `feat/restaurant-list`), 버그면 `fix/<설명>`, 문서면 `docs/<설명>`
- base는 항상 최신 `origin/develop`

```bash
git fetch origin
git switch -c feat/<설명> origin/develop
```

작업 트리에 커밋되지 않은 변경이 있으면 사용자에게 어떻게 할지 먼저 확인한다.

## 3. 구현

- 이슈의 작업 내용 체크리스트를 구현한다.
- `CLAUDE.md`와 `docs/`의 컨벤션(architecture, frontend, styling, api)을 반드시 준수한다.
- Feature 구조: `src/features/<도메인>/` 아래 api / hooks / components / schemas / types
- Component → Hook → API Layer 계층을 지킨다.

## 4. 검증

- `pnpm build`와 `pnpm lint`가 통과할 때까지 수정한다.

## 5. PR 생성

1. 변경사항을 커밋한다. 커밋 메시지는 `feat: ...` / `fix: ...` 형식.
2. 브랜치를 push하고 `gh pr create --base develop`으로 PR을 연다.
3. PR 본문은 `.github/PULL_REQUEST_TEMPLATE.md` 형식을 채우고, 관련 이슈 섹션에 `closes #<N>`을 넣어 이슈가 자동으로 닫히게 한다.
4. 이슈 URL과 PR URL을 사용자에게 보고한다.

## 주의

- goal이 PR 하나 크기보다 크면, 이슈를 쪼개서 등록하자고 먼저 제안한다.
- 에러 수정 goal이면 구현 전에 에러를 재현/원인 파악한 내용을 이슈 특이사항에 남긴다.
