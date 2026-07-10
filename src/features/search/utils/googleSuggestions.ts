import type { SearchSuggestion } from "../types";

/** Google autocomplete 응답을 도메인 SearchSuggestion 목록으로 변환한다. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toSuggestions(rawSuggestions: any[]): SearchSuggestion[] {
  return rawSuggestions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((s: any) => s.placePrediction)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((s: any) => ({
      placeId: s.placePrediction.placeId ?? "",
      text: s.placePrediction.text?.text ?? "",
      mainText: s.placePrediction.structuredFormat?.mainText?.text ?? "",
      secondaryText: s.placePrediction.structuredFormat?.secondaryText?.text ?? "",
    }));
}
