interface Props {
  count: number;
}

export function ResultHeader({ count }: Props) {
  return (
    <div className="px-4 pt-3 pb-1">
      <p className="text-sm font-semibold text-foreground">검색 결과 {count}</p>
    </div>
  );
}
