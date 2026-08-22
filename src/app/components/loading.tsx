export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-start justify-center px-4 pt-16">
      <div className="w-full max-w-7xl space-y-6 animate-pulse">
        {/* Page title skeleton */}
        <div className="h-9 w-48 rounded-lg bg-gray-200 dark:bg-gray-800" />
        {/* Three card skeletons */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 space-y-4"
            >
              <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-9 w-28 rounded-md bg-gray-200 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
