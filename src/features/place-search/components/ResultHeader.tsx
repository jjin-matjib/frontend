import { XCircle } from 'lucide-react';

interface Props {
  count: number;
}

export function ResultHeader({ count }: Props) {
  return (
    <div className="flex items-center justify-between px-4 pt-3 pb-1">
      <p className="text-sm font-semibold text-foreground">검색 결과 {count}</p>
      <button
        type="button"
        className="flex items-center gap-1 text-xs text-place-primary"
      >
        <XCircle className="w-3.5 h-3.5" />
        모든 필터 해제
      </button>
    </div>
  );
}
