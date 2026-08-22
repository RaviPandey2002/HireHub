import Link from "next/link";
import { RegisterForm } from "./register-form";
import { OtherProviders } from "./other-providers";

export const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      {/* Back link */}
      <Link
        href="/"
        className="mb-8 self-start sm:self-auto text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        ← Back to home
      </Link>

      {/* Brand mark */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-lg font-black">
          H
        </span>
        <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          HireHub
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create a new account
        </h2>
        <RegisterForm />
        <OtherProviders />
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-gray-900 dark:text-white hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
