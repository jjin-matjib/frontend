import { Clock, X } from 'lucide-react';
import { DUMMY_RECENT_SEARCHES } from '../constants/dummy-places';

export function RecentSearchList() {
  return (
    <div className="px-4 pt-3 pb-2">
      <p className="text-sm font-semibold text-foreground mb-2">최근 검색 기록</p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DUMMY_RECENT_SEARCHES.map((keyword) => (
          <div
            key={keyword}
            className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full border border-border bg-white text-sm text-foreground"
          >
            <Clock className="w-3.5 h-3.5 text-place-primary" />
            <span>{keyword}</span>
            <button type="button" aria-label={`${keyword} 삭제`}>
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
