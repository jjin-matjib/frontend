import { MapPin, Star } from "lucide-react";
import { RESTAURANT_DISPLAY_COUNT } from "../constants/config";
import type { Restaurant } from "../types";

interface Props {
  zoneName: string;
  restaurants: Restaurant[];
}

export function RestaurantList({ zoneName, restaurants }: Props) {
  const visible = restaurants.slice(0, RESTAURANT_DISPLAY_COUNT);

  return (
    <section className="flex flex-col gap-3 px-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-base font-semibold">{zoneName} 맛집</h3>
        <span className="text-xs text-muted-foreground">인기 상위 20곳 중 추천순</span>
      </div>
      <ul className="flex flex-col gap-2">
        {visible.map((restaurant) => (
          <li
            key={restaurant.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{restaurant.name}</span>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {restaurant.category}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  {restaurant.rating.toFixed(1)} (
                  {restaurant.reviewCount.toLocaleString()})
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {restaurant.distanceM}m
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
