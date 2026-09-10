"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AlertCircle, ArrowLeft, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "An unexpected error occurred during authentication. Please try again.";

  if (error === "Configuration") {
    errorMessage = "There is a problem with the server configuration. Please contact support if this persists.";
  } else if (error === "AccessDenied") {
    errorMessage = "Access was denied. You do not have permission to sign in or your account may be restricted.";
  } else if (error === "Verification") {
    errorMessage = "The verification token has expired or has already been used. Please request a new one.";
  } else if (error === "OAuthSignin" || error === "OAuthCallback" || error === "OAuthCreateAccount") {
    errorMessage = "Could not complete sign in with your social provider. Please try signing in with email or another provider.";
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      {/* Top-left Back to home navigation pill */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full border border-gray-200/80 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-3.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700 shadow-sm transition-all group"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to home</span>
      </Link>

      {/* Error Card */}
      <div className="w-full max-w-md rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-xl shadow-gray-200/40 dark:shadow-none space-y-6 text-center">
        {/* Icon & Brand */}
        <div className="flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 shadow-sm">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Authentication Error
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {errorMessage}
          </p>
          {error && (
            <span className="mt-3 inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs font-mono text-gray-600 dark:text-gray-400">
              Error code: {error}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-2.5">
          <Link href="/login" className="w-full">
            <Button className="w-full gap-2">
              <RotateCcw className="h-4 w-4" />
              Try signing in again
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full gap-2 border-gray-200 dark:border-gray-800">
              <Home className="h-4 w-4" />
              Return to homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const ErrorCard = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
};
