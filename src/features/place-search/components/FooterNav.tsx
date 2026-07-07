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
    <nav className="flex-shrink-0 flex border-t border-border bg-white">
      {TABS.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          className={cn(
            'flex flex-1 flex-col items-center gap-1 pt-2 pb-3 text-xs font-medium transition-colors',
            key === activeTab
              ? 'text-place-primary border-t-2 border-place-primary -mt-px'
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
