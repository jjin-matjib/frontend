export interface PlaceDetail {
  id: string;
  name: string;
  category: string;
  isOpen: boolean;
  /** 요일별 영업시간 (월요일부터, 예: "월요일: 오전 10:00 ~ 오후 10:00") */
  weekdayHours: string[];
  phone: string;
  address: string;
  rating: number;
  reviewCount: number;
  lat: number;
  lng: number;
}
