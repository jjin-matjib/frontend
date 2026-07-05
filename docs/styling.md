# Styling Convention

프로젝트의 UI 일관성과 반응형 대응을 위해 아래 규칙을 준수합니다.

---

# Design System

## Rules

- Design System을 먼저 구축한 후 개발한다.
- 공통 UI는 Design System 또는 shadcn/ui를 사용한다.
- 동일한 UI를 중복 구현하지 않는다.
- 새로운 공통 컴포넌트가 필요한 경우 먼저 공통 컴포넌트로 추가한다.

---

# Design Token

다음 값은 Design Token을 사용한다.

- Color
- Typography
- Font Weight
- Radius
- Shadow
- Border
- Spacing
- Z-Index

하드코딩된 값을 지양한다.

---

# Layout

## Rules

- Flex를 우선 사용한다.
- Grid를 적극 활용한다.
- 부모 영역을 기준으로 자연스럽게 확장되도록 구현한다.
- width: 100%와 max-width를 우선 사용한다.
- 고정 Width, Height 사용을 최소화한다.
- px 기반 레이아웃보다 유동적인 레이아웃을 우선한다.

### 좋은 예

```css
.container {
  width: 100%;
  max-width: 540px;
}
```

### 지양

```css
.container {
  width: 540px;
}
```

---

# Responsive

## Rules

- Mobile First를 기본으로 개발한다.
- 다양한 화면 크기를 고려한다.
- 콘텐츠에 따라 자연스럽게 확장 및 축소되어야 한다.
- Media Query보다 Flex/Grid 기반 레이아웃을 우선 고려한다.
- 불필요한 Breakpoint 추가를 지양한다.

---

# Spacing

## Rules

- Margin보다 Padding을 우선 고려한다.
- 요소 간 간격은 margin보다 gap을 사용한다.
- 위치를 맞추기 위한 margin-top, margin-left 사용을 지양한다.
- Design Token 또는 4px Grid System을 따른다.

권장 Spacing

```
4
8
12
16
20
24
32
40
48
64
80
96
```

### 좋은 예

```css
.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

### 지양

```css
.item {
  margin-bottom: 16px;
}
```

---

# Sizing

권장

- %
- flex
- grid
- minmax()
- clamp()
- fit-content
- max-content

최소 사용

- px
- vw
- vh

---

# Alignment

정렬은 아래 속성을 우선 사용한다.

- justify-content
- align-items
- align-self
- gap

Margin으로 위치를 맞추는 것을 지양한다.

---

# Overflow

- 화면 밖으로 UI가 잘리지 않도록 구현한다.
- 긴 텍스트는 적절히 줄바꿈 또는 말줄임 처리한다.
- 이미지가 깨지지 않도록 구현한다.
- 작은 화면에서도 정상적으로 사용할 수 있도록 구현한다.

---

# Typography

- Font Size는 Design Token을 사용한다.
- Font Weight는 Token을 사용한다.
- line-height를 명시한다.
- Letter Spacing은 필요한 경우에만 사용한다.

---

# Image

- 부모 크기에 맞게 자연스럽게 동작하도록 구현한다.
- 고정 Width, Height 사용을 최소화한다.
- object-fit을 적절히 사용한다.
- Lazy Loading을 적극 활용한다.

---

# Button

- 버튼 높이는 공통 규격을 사용한다.
- Disabled 상태를 반드시 제공한다.
- Loading 상태를 반드시 제공한다.
- Hover / Active / Focus 상태를 제공한다.

---

# Input

- Label을 제공한다.
- Error Message를 제공한다.
- Disabled 상태를 제공한다.
- Placeholder만으로 의미를 전달하지 않는다.

---

# Loading UI

## Spinner

사용

- 버튼
- 짧은 API 요청
- 작은 영역 Loading

## Skeleton

사용

- Card
- List
- Table
- Detail
- Layout이 유지되어야 하는 화면

---

# Animation

- Transition은 필요한 경우에만 사용한다.
- 과도한 Animation을 지양한다.
- Duration은 Design System 기준을 따른다.

---

# Accessibility

- Color Contrast를 고려한다.
- Hover만으로 정보를 전달하지 않는다.
- Focus Style을 제거하지 않는다.
- Semantic HTML을 우선 사용한다.

---

# CSS Rules

권장

- Flex
- Grid
- gap
- CSS Variable
- Design Token

지양

- Inline Style
- !important
- Absolute Position 남발
- Margin으로 위치 조정
- 하드코딩된 Width/Height
- 중복 스타일

---

# Checklist

개발 완료 전 확인한다.

- 반응형이 정상 동작하는가?
- Flex/Grid를 적절히 사용했는가?
- gap을 사용했는가?
- margin으로 위치를 맞추지 않았는가?
- Design Token을 사용했는가?
- 고정 Width를 최소화했는가?
- Skeleton 또는 Spinner가 필요한가?
- Hover, Focus, Disabled 상태를 제공하는가?
- 접근성을 고려했는가?
