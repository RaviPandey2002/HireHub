import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegisterForm } from "./register-form";
import { OtherProviders } from "./other-providers";

export const RegisterPage = () => {
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

      {/* Auth Card */}
      <div className="w-full max-w-md rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-xl shadow-gray-200/40 dark:shadow-none space-y-6">
        {/* Unified Card Header */}
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm transition-transform hover:scale-105 select-none"
          >
            <span className="text-lg font-black">H</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create an account
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started with your free HireHub account
          </p>
        </div>

        <RegisterForm />
        <OtherProviders />

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-gray-900 dark:text-white underline-offset-4 hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
