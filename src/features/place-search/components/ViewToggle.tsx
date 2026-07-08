'use client';

import { List, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ViewTab } from '../types';

interface Props {
  tab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
}

export function ViewToggle({ tab, onTabChange }: Props) {
  return (
    <div className="flex rounded-lg border border-border overflow-hidden text-sm">
        <button
          type="button"
          onClick={() => onTabChange('list')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 font-medium transition-colors',
            tab === 'list'
              ? 'bg-place-primary text-place-primary-fg'
              : 'bg-place-surface text-muted-foreground hover:bg-muted',
          )}
        >
          <List className="w-4 h-4" />
          리스트
        </button>
        <button
          type="button"
          onClick={() => onTabChange('map')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 font-medium transition-colors',
            tab === 'map'
              ? 'bg-place-primary text-place-primary-fg'
              : 'bg-place-surface text-muted-foreground hover:bg-muted',
          )}
        >
          <Map className="w-4 h-4" />
          지도
        </button>
    </div>
  );
}
