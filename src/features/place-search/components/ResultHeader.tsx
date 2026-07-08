interface Props {
  count: number;
}

export function ResultHeader({ count }: Props) {
  return (
    <p className="text-sm font-semibold text-foreground">검색 결과 {count}</p>
  );
}
