/**
 * 수도권 전철 노선 약칭과 색상 클래스.
 *
 * 색상값 자체는 `globals.css`의 `--color-line-*` 디자인 토큰에 있고,
 * 여기서는 Tailwind 유틸리티 클래스만 참조한다(하드코딩·inline style 금지).
 * 클래스명은 Tailwind가 소스에서 스캔할 수 있도록 리터럴 문자열로 둔다.
 */
export interface SubwayLine {
  /** 노선 전체 이름 (예: "수인분당선") */
  name: string;
  /** 배지에 넣을 약칭 (예: "분") */
  short: string;
  /** 배경색 유틸리티 클래스 (예: "bg-line-2") */
  colorClass: string;
}

const LINES: Record<string, Omit<SubwayLine, "name">> = {
  "1호선": { short: "1", colorClass: "bg-line-1" },
  "2호선": { short: "2", colorClass: "bg-line-2" },
  "3호선": { short: "3", colorClass: "bg-line-3" },
  "4호선": { short: "4", colorClass: "bg-line-4" },
  "5호선": { short: "5", colorClass: "bg-line-5" },
  "6호선": { short: "6", colorClass: "bg-line-6" },
  "7호선": { short: "7", colorClass: "bg-line-7" },
  "8호선": { short: "8", colorClass: "bg-line-8" },
  "9호선": { short: "9", colorClass: "bg-line-9" },
  수인분당선: { short: "분", colorClass: "bg-line-suinbundang" },
  신분당선: { short: "신", colorClass: "bg-line-sinbundang" },
  경의중앙선: { short: "경", colorClass: "bg-line-gyeongui" },
  경춘선: { short: "춘", colorClass: "bg-line-gyeongchun" },
  공항철도: { short: "A", colorClass: "bg-line-airport" },
  우이신설선: { short: "우", colorClass: "bg-line-uisinseol" },
  신림선: { short: "림", colorClass: "bg-line-sillim" },
  서해선: { short: "서", colorClass: "bg-line-seohae" },
  경강선: { short: "강", colorClass: "bg-line-gyeonggang" },
  김포골드라인: { short: "김", colorClass: "bg-line-gimpo" },
  인천1호선: { short: "인1", colorClass: "bg-line-incheon1" },
  인천2호선: { short: "인2", colorClass: "bg-line-incheon2" },
  "GTX-A": { short: "G", colorClass: "bg-line-gtxa" },
  의정부선: { short: "의", colorClass: "bg-line-uijeongbu" },
  에버라인: { short: "에", colorClass: "bg-line-everline" },
};

/** 노선명으로 약칭·색 클래스를 찾는다. 목록에 없으면 중립색으로 표시한다. */
export function findLine(name: string): SubwayLine {
  const line = LINES[name];
  return line
    ? { name, ...line }
    : { name, short: name.slice(0, 1), colorClass: "bg-line-unknown" };
}
