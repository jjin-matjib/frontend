'use client';

import { Search, TrainFront } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { key: 'search', label: '검색', Icon: Search },
  { key: 'region', label: '권역 추천', Icon: TrainFront },
] as const;

export function FooterNav() {
  const activeTab = 'search';

  return (
    <nav className="shrink-0 h-14 flex border-t border-border bg-place-surface">
      {TABS.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
            key === activeTab
              ? 'text-place-primary border-t-2 border-place-primary'
              : 'text-muted-foreground',
          )}
        >
          <Icon className="w-5 h-5" />
          {label}
        </button>
      ))}
    </nav>
  );
}
