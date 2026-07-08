/**
 * Mock 맛집 풀. 추천 권역별로 여기서 결정적으로 표본을 뽑아 리스트업한다.
 * (실제 Google Places 연동과 랭킹 근거는 기획 확정 후 반영 — 현재는 데모용 더미.)
 */
export interface DummyRestaurant {
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
}

export const RESTAURANT_POOL: DummyRestaurant[] = [
  { name: "온기정", category: "한식", rating: 4.6, reviewCount: 1820 },
  { name: "미도인", category: "덮밥", rating: 4.5, reviewCount: 2410 },
  { name: "부첼라", category: "이탈리안", rating: 4.4, reviewCount: 980 },
  { name: "하카타분코", category: "일식", rating: 4.7, reviewCount: 3120 },
  { name: "우육면관", category: "중식", rating: 4.3, reviewCount: 760 },
  { name: "런던베이글뮤지엄", category: "베이커리", rating: 4.5, reviewCount: 5400 },
  { name: "쉐이크쉑", category: "버거", rating: 4.2, reviewCount: 3300 },
  { name: "고삼이", category: "고깃집", rating: 4.6, reviewCount: 1450 },
  { name: "송옥", category: "국수", rating: 4.4, reviewCount: 890 },
  { name: "만족오향족발", category: "족발", rating: 4.3, reviewCount: 2050 },
  { name: "스시코우지", category: "스시", rating: 4.8, reviewCount: 640 },
  { name: "블루보틀", category: "카페", rating: 4.4, reviewCount: 4100 },
  { name: "정돈", category: "돈카츠", rating: 4.5, reviewCount: 1670 },
  { name: "교다이야", category: "라멘", rating: 4.4, reviewCount: 1230 },
  { name: "이태리재관", category: "파스타", rating: 4.3, reviewCount: 720 },
  { name: "본수원갈비", category: "갈비", rating: 4.5, reviewCount: 1980 },
  { name: "커피한약방", category: "카페", rating: 4.6, reviewCount: 2600 },
  { name: "농민백암순대", category: "순대국", rating: 4.4, reviewCount: 3050 },
];
