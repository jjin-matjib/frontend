'use client';

import { useRef, useState } from 'react';
import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { useQueryState } from 'nuqs';
import type { AutocompleteSuggestion } from '../hooks/usePlaceAutocomplete';
import { usePlaceAutocomplete } from '../hooks/usePlaceAutocomplete';

interface Props {
  mockSuggestions?: AutocompleteSuggestion[];
}

export function SearchBar({ mockSuggestions }: Props) {
  const [query, setQuery] = useQueryState('q');
  const [input, setInput] = useState(query ?? '');
  const [open, setOpen] = useState(false);
  const apiSuggestions = usePlaceAutocomplete(input, !!mockSuggestions);
  const suggestions = mockSuggestions
    ? mockSuggestions.filter((s) =>
        s.mainText.toLowerCase().includes(input.toLowerCase()),
      )
    : apiSuggestions;
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (value: string) => {
    const trimmed = value.trim();
    setInput(trimmed);
    setQuery(trimmed || null);
    setOpen(false);
  };

  const reset = () => {
    setInput('');
    setQuery(null);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="shrink-0 px-4 py-3 flex items-center gap-2 relative">
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-border px-3 h-11 bg-place-bg min-w-0">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit(input);
            if (e.key === 'Escape') setOpen(false);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="가게명, 지역, 지하철역 검색"
          className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground min-w-0"
        />
      </div>

      <button
        type="button"
        className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl border border-border bg-place-bg hover:bg-muted transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
      </button>

      <button
        type="button"
        onClick={reset}
        className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl border border-border bg-place-bg text-muted-foreground hover:bg-muted transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {open && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-place-bg border-x border-b border-border rounded-b-xl shadow-md z-50 overflow-hidden">
          {suggestions.map((s) => (
            <li key={s.placeId}>
              <button
                type="button"
                className="w-full flex flex-col px-4 py-2.5 text-left hover:bg-place-surface"
                onMouseDown={(e) => {
                  e.preventDefault();
                  submit(s.mainText || s.text);
                }}
              >
                <span className="text-sm text-foreground font-medium truncate">{s.mainText}</span>
                {s.secondaryText && (
                  <span className="text-xs text-muted-foreground truncate">{s.secondaryText}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
