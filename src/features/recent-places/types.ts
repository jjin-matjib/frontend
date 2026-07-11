export interface RecentPlace {
  id: string;
  name: string;
  category: string;
  address: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  photoName: string | null;
  viewedAt: number;
}
