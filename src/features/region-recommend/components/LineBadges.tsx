import { findLine } from "../constants/subway-lines";

interface Props {
  lines: string[];
}

/**
 * 노선 배지. 색상은 운영기관 공식 노선색이라 디자인 토큰이 아닌 데이터이며,
 * 임의의 hex를 클래스로 만들 수 없어 inline style로 칠한다.
 */
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
            style={{ backgroundColor: line.color }}
            className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold text-white"
          >
            {line.short}
          </span>
        );
      })}
    </span>
  );
}
