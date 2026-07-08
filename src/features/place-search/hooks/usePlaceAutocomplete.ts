'use client';

import { useEffect, useState } from 'react';

export interface AutocompleteSuggestion {
  placeId: string;
  text: string;
  mainText: string;
  secondaryText: string;
}

export function usePlaceAutocomplete(input: string, disabled = false) {
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);

  useEffect(() => {
    if (disabled || input.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/places/autocomplete?q=${encodeURIComponent(input)}`)
        .then((r) => r.json())
        .then((data) => setSuggestions(data.suggestions ?? []))
        .catch(() => setSuggestions([]));
    }, 300);

    return () => clearTimeout(timer);
  }, [input, disabled]);

  return suggestions;
}
