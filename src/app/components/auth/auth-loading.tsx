export function AuthLoading() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      {/* Top-left Back to home navigation pill skeleton */}
      <div className="absolute top-6 left-6 h-8 w-32 rounded-full border border-gray-200/80 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 animate-pulse" />

      {/* Auth Card Skeleton */}
      <div className="w-full max-w-md rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-xl shadow-gray-200/40 dark:shadow-none space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="mb-1 h-11 w-11 rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-7 w-48 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-56 rounded bg-gray-100 dark:bg-gray-800/60" />
        </div>

        {/* Input Fields Skeleton */}
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="h-4 w-14 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-10 w-full rounded-md bg-gray-100 dark:bg-gray-800/60" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-18 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-10 w-full rounded-md bg-gray-100 dark:bg-gray-800/60" />
          </div>
        </div>

        {/* Primary Action Button Skeleton */}
        <div className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-800" />

        {/* Divider Skeleton */}
        <div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800/40" />

        {/* 1-Click Sandbox / Social Skeleton */}
        <div className="grid grid-cols-2 gap-3">
          <div className="h-11 rounded-lg bg-gray-100 dark:bg-gray-800/60" />
          <div className="h-11 rounded-lg bg-gray-100 dark:bg-gray-800/60" />
        </div>

        {/* Footer Link Skeleton */}
        <div className="flex justify-center pt-2">
          <div className="h-4 w-48 rounded bg-gray-100 dark:bg-gray-800/60" />
        </div>
      </div>
    </div>
  );
}

