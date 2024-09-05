"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from 'next/link';
import { RegisterForm } from './register-form'
import { OtherProviders } from './other-providers'
interface CredentialsFormProps {
  csrfToken?: string;
}

export const RegisterPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const signInResponse = await signIn("credentials", {
      email: data.get("email"),
      password: data.get("password"),
      redirect: false,
    });

    if (signInResponse && !signInResponse.error) {
      console.log("HERE")
      router.push("/");
    } else {
      console.log("Else HERE")
      setError("Your Email or Password is wrong!");
    }
  };

  return (
    <>
      <div className="min-h-screen flex justify-center lg:items-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Create New Account! </h2>
          <div className="mt-6">
            <RegisterForm />
            <OtherProviders/>
            <span className="flex justify-center">
              Already Have an account? Click
              <Link href="/login" className="text-blue-500">
                . Here
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>

  );
}


