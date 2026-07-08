import { cn } from "@/lib/utils";
import type { RankedZone, RecommendOrigin } from "../types";

interface Props {
  origins: RecommendOrigin[];
  recommended: RankedZone;
  className?: string;
}

const WIDTH = 400;
const HEIGHT = 240;
const PAD = 36;

/**
 * 의존성 없는 자기완결 미리보기 지도(SVG). 출발 역들과 추천 권역의
 * 상대 위치를 보여준다. place-search 머지 후 공유 GoogleMapWrapper로 교체 가능.
 */
export function RegionMap({ origins, recommended, className }: Props) {
  const points = [
    ...origins.map((o) => ({ lat: o.lat, lng: o.lng })),
    { lat: recommended.lat, lng: recommended.lng },
  ];
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat || 0.0001;
  const lngRange = maxLng - minLng || 0.0001;

  const project = (lat: number, lng: number) => ({
    x: PAD + ((lng - minLng) / lngRange) * (WIDTH - 2 * PAD),
    // 위도는 북쪽이 위 → y축 반전
    y: PAD + ((maxLat - lat) / latRange) * (HEIGHT - 2 * PAD),
  });

  const target = project(recommended.lat, recommended.lng);

  return (
    <div className={cn("px-4", className)}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full overflow-hidden rounded-xl border border-border"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`${recommended.name} 주변 추천 위치와 출발지`}
      >
        <rect width={WIDTH} height={HEIGHT} className="fill-muted" />

        {origins.map((origin) => {
          const p = project(origin.lat, origin.lng);
          return (
            <g key={origin.stationId}>
              <line
                x1={p.x}
                y1={p.y}
                x2={target.x}
                y2={target.y}
                className="stroke-border"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              <circle cx={p.x} cy={p.y} r={5} className="fill-muted-foreground" />
              <text
                x={p.x}
                y={p.y - 9}
                textAnchor="middle"
                className="fill-muted-foreground text-[11px]"
              >
                {origin.label}
              </text>
            </g>
          );
        })}

        <circle cx={target.x} cy={target.y} r={9} className="fill-primary" />
        <text
          x={target.x}
          y={target.y - 14}
          textAnchor="middle"
          className="fill-primary text-xs font-semibold"
        >
          {recommended.name}
        </text>
      </svg>
    </div>
  );
}
