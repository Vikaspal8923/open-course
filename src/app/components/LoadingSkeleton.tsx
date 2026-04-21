export function LoadingSkeleton({ count = 3, variant = 'card' }: { count?: number; variant?: 'card' | 'item' }) {
  if (variant === 'item') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg bg-white p-4 dark:bg-gray-900">
            <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="mb-3 h-3 w-full rounded bg-gray-100 dark:bg-gray-800"></div>
            <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-800"></div>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-start gap-3">
            <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex-1">
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-800"></div>
            </div>
          </div>
          <div className="mt-4 h-10 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      ))}
    </>
  );
}
