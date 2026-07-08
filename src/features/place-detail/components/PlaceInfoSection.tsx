import { Clock, MapPin, Phone, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlaceDetail } from "../types";
import { getTodayHours } from "../utils/openingHours";

interface Props {
  place: PlaceDetail;
}

export function PlaceInfoSection({ place }: Props) {
  const todayHours = getTodayHours(place.weekdayHours);

  return (
    <section className="flex flex-col gap-4 px-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl leading-7 font-bold">{place.name}</h1>
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs leading-5 text-muted-foreground">
            {place.category}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm leading-5 text-muted-foreground">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="font-medium text-foreground">{place.rating}</span>
          <span>· 리뷰 {place.reviewCount.toLocaleString()}개</span>
        </div>
      </div>

      <dl className="flex flex-col gap-4 rounded-xl border p-4 text-sm leading-5">
        <div className="flex gap-3">
          <dt className="shrink-0">
            <Clock className="mt-0.5 size-4 text-muted-foreground" />
            <span className="sr-only">영업시간</span>
          </dt>
          <dd className="flex flex-col gap-1">
            <span className={cn("font-medium", place.isOpen ? "text-success" : "text-destructive")}>
              {place.isOpen ? "영업중" : "영업 종료"}
            </span>
            {place.weekdayHours.map((line) => (
              <span
                key={line}
                className={cn(
                  line === todayHours ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {line}
              </span>
            ))}
          </dd>
        </div>

        {place.phone && (
          <div className="flex gap-3">
            <dt className="shrink-0">
              <Phone className="mt-0.5 size-4 text-muted-foreground" />
              <span className="sr-only">전화번호</span>
            </dt>
            <dd>
              <a href={`tel:${place.phone}`} className="underline-offset-4 hover:underline">
                {place.phone}
              </a>
            </dd>
          </div>
        )}

        {place.address && (
          <div className="flex gap-3">
            <dt className="shrink-0">
              <MapPin className="mt-0.5 size-4 text-muted-foreground" />
              <span className="sr-only">주소</span>
            </dt>
            <dd>{place.address}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
