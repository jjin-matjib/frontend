"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPlaceSuggestions } from "../api/getPlaceSuggestions";
import { searchKeys } from "../constants/queryKeys";

export function useSearchAutocomplete(input: string, disabled = false) {
  const [debouncedInput, setDebouncedInput] = useState(input);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedInput(input), 300);

    return () => clearTimeout(timer);
  }, [input]);

  const enabled = !disabled && debouncedInput.length >= 2;
  const { data } = useQuery({
    queryKey: searchKeys.autocomplete(debouncedInput),
    queryFn: () => getPlaceSuggestions(debouncedInput),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  return enabled ? (data ?? []) : [];
}
