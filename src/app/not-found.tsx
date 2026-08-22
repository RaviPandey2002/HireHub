import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        404
      </p>
      <h1 className="mt-4 text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-8xl">
        Page not found
      </h1>
      <p className="mt-6 max-w-md text-base text-gray-500 dark:text-gray-400">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
        have been moved or deleted.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
      >
        ← Back to home
      </Link>
    </div>
  );
};

export default NotFound;
