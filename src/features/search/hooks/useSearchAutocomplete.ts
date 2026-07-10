"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getPlaceSuggestions } from "../api/getPlaceSuggestions";
import { searchKeys } from "../constants/queryKeys";

export function useSearchAutocomplete(input: string) {
  const { data } = useSuspenseQuery({
    queryKey: searchKeys.autocomplete(input).queryKey,
    queryFn: () => getPlaceSuggestions(input),
    staleTime: 5 * 60 * 1000,
  });

  return data;
}
