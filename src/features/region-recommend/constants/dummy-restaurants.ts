/**
 * Mock 맛집 이름·카테고리 풀.
 * 평점/리뷰수는 여기 박아두지 않고 권역별로 결정적으로 생성한다 —
 * 권역마다 품질 분포가 달라야 "좋은 식당 밀도"가 변별력을 갖기 때문이다.
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
  { name: "런던베이글뮤지엄", category: "베이커리" },
  { name: "쉐이크쉑", category: "버거" },
  { name: "고삼이", category: "고깃집" },
  { name: "송옥", category: "국수" },
  { name: "만족오향족발", category: "족발" },
  { name: "스시코우지", category: "스시" },
  { name: "블루보틀", category: "카페" },
  { name: "정돈", category: "돈카츠" },
  { name: "교다이야", category: "라멘" },
  { name: "이태리재관", category: "파스타" },
  { name: "본수원갈비", category: "갈비" },
  { name: "커피한약방", category: "카페" },
  { name: "농민백암순대", category: "순대국" },
  { name: "청담동집", category: "한식" },
  { name: "타코앤타코", category: "멕시칸" },
];
