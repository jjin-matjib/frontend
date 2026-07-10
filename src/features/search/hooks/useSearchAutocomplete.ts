"use client";

import { useEffect, useState } from "react";

export interface SearchSuggestion {
  placeId: string;
  text: string;
  mainText: string;
  secondaryText: string;
}

export function useSearchAutocomplete(input: string, disabled = false) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  useEffect(() => {
    if (disabled || input.length < 2) return;

    const timer = setTimeout(() => {
      fetch(`/api/places/autocomplete?q=${encodeURIComponent(input)}`)
        .then((response) => response.json())
        .then((data) => setSuggestions(data.suggestions ?? []))
        .catch(() => setSuggestions([]));
    }, 300);

    return () => clearTimeout(timer);
  }, [disabled, input]);

  return disabled || input.length < 2 ? [] : suggestions;
}
