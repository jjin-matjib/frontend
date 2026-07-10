/**
 * Mock 맛집 이름·카테고리 풀.
 *
 * 실 API는 `includedTypes: ["restaurant"]` 로 조회하는데 여기엔 카페·베이커리가
 * 포함되지 않으므로, 이 풀도 음식점만 담는다(Mock이 실 응답과 다르지 않도록).
 *
 * 평점/리뷰수는 여기 박아두지 않고 권역별로 결정적으로 생성한다.
 * (실 연동 시에는 Google Places의 rating / userRatingCount로 대체된다.)
 */
export interface DummyRestaurant {
  name: string;
  category: string;
}

export const RESTAURANT_POOL: DummyRestaurant[] = [
  { name: "온기정", category: "한식" },
  { name: "미도인", category: "덮밥" },
  { name: "부첼라", category: "이탈리안" },
  { name: "하카타분코", category: "일식" },
  { name: "우육면관", category: "중식" },
  { name: "쉐이크쉑", category: "버거" },
  { name: "고삼이", category: "고깃집" },
  { name: "송옥", category: "국수" },
  { name: "만족오향족발", category: "족발" },
  { name: "스시코우지", category: "스시" },
  { name: "정돈", category: "돈카츠" },
  { name: "교다이야", category: "라멘" },
  { name: "이태리재관", category: "파스타" },
  { name: "본수원갈비", category: "갈비" },
  { name: "농민백암순대", category: "순대국" },
  { name: "청담동집", category: "한식" },
  { name: "타코앤타코", category: "멕시칸" },
  { name: "진진", category: "중식" },
  { name: "을지면옥", category: "냉면" },
  { name: "몽탄", category: "고깃집" },
];
