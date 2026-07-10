import { apiClient, getApiErrorMessage } from "@/lib/api/client";
import type { SearchSuggestion } from "../types";

interface AutocompleteResponse {
  suggestions: SearchSuggestion[];
}

export async function getPlaceSuggestions(
  query: string,
): Promise<SearchSuggestion[]> {
  try {
    const { data } = await apiClient.get<AutocompleteResponse>(
      "/places/autocomplete",
      { params: { q: query } },
    );
    return data.suggestions;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "검색어 자동완성을 불러오지 못했습니다."),
    );
  }
}
