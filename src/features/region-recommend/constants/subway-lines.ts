/**
 * 수도권 전철 노선색·약칭.
 *
 * 색상은 운영기관 공식 노선색(위키백과 「틀:한국 철도 노선색」 기준)이다.
 * 디자인 토큰이 아니라 **외부 브랜드 데이터**라 hex를 그대로 둔다.
 */
export interface SubwayLine {
  /** 노선 전체 이름 (예: "수인분당선") */
  name: string;
  /** 배지에 넣을 약칭 (예: "분") */
  short: string;
  color: string;
}

const LINES: Record<string, Omit<SubwayLine, "name">> = {
  "1호선": { short: "1", color: "#0052A4" },
  "2호선": { short: "2", color: "#00A84D" },
  "3호선": { short: "3", color: "#EF7C1C" },
  "4호선": { short: "4", color: "#00A5DE" },
  "5호선": { short: "5", color: "#996CAC" },
  "6호선": { short: "6", color: "#CD7C2F" },
  "7호선": { short: "7", color: "#747F00" },
  "8호선": { short: "8", color: "#E6186C" },
  "9호선": { short: "9", color: "#BDB092" },
  수인분당선: { short: "분", color: "#F5A200" },
  신분당선: { short: "신", color: "#D4003B" },
  경의중앙선: { short: "경", color: "#77C4A3" },
  경춘선: { short: "춘", color: "#0C8E72" },
  공항철도: { short: "A", color: "#0090D2" },
  우이신설선: { short: "우", color: "#B0CE18" },
  신림선: { short: "림", color: "#6789CA" },
  서해선: { short: "서", color: "#81A914" },
  경강선: { short: "강", color: "#003DA5" },
  김포골드라인: { short: "김", color: "#A17800" },
  인천1호선: { short: "인1", color: "#7CA8D5" },
  인천2호선: { short: "인2", color: "#ED8B00" },
  "GTX-A": { short: "G", color: "#9A6292" },
  의정부선: { short: "의", color: "#FDA600" },
  에버라인: { short: "에", color: "#509F22" },
};

const UNKNOWN_LINE_COLOR = "#9CA3AF";

/** 노선명으로 색·약칭을 찾는다. 목록에 없으면 중립색으로 표시한다. */
export function findLine(name: string): SubwayLine {
  const line = LINES[name];
  return line
    ? { name, ...line }
    : { name, short: name.slice(0, 1), color: UNKNOWN_LINE_COLOR };
}
