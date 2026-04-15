export function PropertyCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-card-border bg-card">
      <div className="aspect-[4/3] w-full animate-pulse bg-card-border" />
      <div className="flex flex-1 flex-col p-4">
        <div className="h-12 animate-pulse rounded-lg bg-card-border" />
        <div className="mt-3 h-10 animate-pulse rounded-lg bg-card-border/80" />
        <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-card-border" />
        <div className="mt-4 h-10 animate-pulse rounded-xl bg-card-border" />
      </div>
    </div>
  );
}
