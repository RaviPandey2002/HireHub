"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, LayoutDashboard, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("Application runtime error caught by boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mx-auto max-w-md w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-sm text-center">
        {/* Error icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mb-5 ring-8 ring-rose-50/50 dark:ring-rose-950/20">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Something went wrong
        </h2>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          An unexpected error occurred while rendering this view. You can try refreshing the action or return to the main dashboard.
        </p>

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 font-semibold gap-2 shadow-xs"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>

          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto gap-2 font-semibold border-slate-200 dark:border-slate-800"
            >
              <LayoutDashboard className="h-4 w-4 text-emerald-600" />
              Dashboard
            </Button>
          </Link>
        </div>

        {/* Technical error details (Collapsible) */}
        {(error?.message || error?.digest) && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-left">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <span>Diagnostic Details</span>
              {showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {showDetails && (
              <div className="mt-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 break-words leading-relaxed max-h-36 overflow-y-auto">
                {error.digest && (
                  <p className="font-bold text-slate-500 mb-1">Digest: {error.digest}</p>
                )}
                <p>{error.message || "Unknown error details"}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
