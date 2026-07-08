import { ExternalLink } from "lucide-react";
import type { PlaceDetail } from "../types";
import { getGoogleMapUrl, getKakaoMapUrl, getNaverMapUrl } from "../utils/mapLinks";

const MAP_LINKS = [
  { label: "카카오맵", getUrl: getKakaoMapUrl },
  { label: "네이버 지도", getUrl: getNaverMapUrl },
  { label: "구글맵", getUrl: getGoogleMapUrl },
];

interface Props {
  place: PlaceDetail;
}

export function MapLinkButtons({ place }: Props) {
  return (
    <section className="flex flex-col gap-2 px-4">
      <h2 className="text-sm leading-5 font-semibold text-muted-foreground">지도에서 열기</h2>
      <div className="grid grid-cols-3 gap-2">
        {MAP_LINKS.map(({ label, getUrl }) => (
          <a
            key={label}
            href={getUrl(place)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 items-center justify-center gap-1 rounded-lg border text-sm leading-5 font-medium transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {label}
            <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
          </a>
        ))}
      </div>
    </section>
  );
}
