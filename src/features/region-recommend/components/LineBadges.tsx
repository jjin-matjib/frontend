import { cn } from "@/lib/utils";
import { findLine } from "../constants/subway-lines";

interface Props {
  lines: string[];
}

/** 역의 노선을 공식 노선색 배지로 보여준다. 환승역은 여러 개. */
export function LineBadges({ lines }: Props) {
  if (lines.length === 0) return null;

  return (
    <span className="flex shrink-0 items-center gap-1">
      {lines.map((name) => {
        const line = findLine(name);
        return (
          <span
            key={name}
            title={line.name}
            aria-label={line.name}
            className={cn(
              "flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold text-white",
              line.colorClass,
            )}
          >
            {line.short}
          </span>
        );
      })}
    </span>
  );
}
