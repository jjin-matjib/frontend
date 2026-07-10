export function PlaceDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4" aria-busy="true">
      <div className="h-7 w-2/3 animate-pulse rounded-md bg-muted" />
      <div className="h-5 w-1/3 animate-pulse rounded-md bg-muted" />
      <div className="h-48 animate-pulse rounded-xl bg-muted" />
      <div className="h-10 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
