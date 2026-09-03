"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { DEFAULT_LOGIN_REDIRECT } from "routes"

export const OtherProviders = () => {
  const [pendingProvider, setPendingProvider] = useState<"google" | "github" | null>(null)

  const handleSignIn = (provider: "google" | "github") => {
    if (pendingProvider) return
    setPendingProvider(provider)
    signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Divider — self-contained so it doesn't overlay the buttons */}
      <div className="relative flex items-center">
        <span className="flex-1 border-t border-gray-200 dark:border-gray-800" />
        <span className="mx-3 text-xs uppercase text-gray-400 dark:text-gray-500 whitespace-nowrap">
          or continue with
        </span>
        <span className="flex-1 border-t border-gray-200 dark:border-gray-800" />
      </div>

      {/* Social buttons */}
      <div className="flex items-center gap-x-2">
        <button
          type="button"
          onClick={() => handleSignIn("google")}
          disabled={!!pendingProvider}
          aria-label="Sign in with Google"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FcGoogle className="h-5 w-5 shrink-0" />
          <span>Google</span>
        </button>
        <button
          type="button"
          onClick={() => handleSignIn("github")}
          disabled={!!pendingProvider}
          aria-label="Sign in with GitHub"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaGithub className="h-5 w-5 shrink-0" />
          <span>GitHub</span>
        </button>
      </div>
    </div>
  )
}
