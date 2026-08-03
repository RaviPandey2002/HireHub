import Link from "next/link";
import { RegisterForm } from "./register-form";
import { OtherProviders } from "./other-providers";

export const RegisterPage = () => {
  return (
    <div className="min-h-[90vh] flex justify-center lg:items-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <RegisterForm />
        <OtherProviders />
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
