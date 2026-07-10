export function RecommendSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-4" aria-busy="true">
      <div className="h-40 animate-pulse rounded-xl bg-muted" />
      <div className="h-11 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
