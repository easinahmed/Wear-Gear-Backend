export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-100">
      <Skeleton className="aspect-[3/4] rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-1 pt-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2 w-16" />
          </div>
          <Skeleton className="h-5 w-20 rounded" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
