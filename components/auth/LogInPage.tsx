"use client";

import { signIn, useSession, signOut } from "next-auth/react";
import React from "react";
import Link from "next/link"
import { LoginForm } from "./login-form"
import { OtherProviders } from './other-providers'

export const LogInPage = () => {
  const { data: session } = useSession();
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <div className="mt-6">
            <LoginForm/>
            <OtherProviders/>
            </div>
              <span>
                Don&apos;t have an account click
                <Link href="/register" className="text-blue-500">
                  . Here
                </Link>
              </span>
          </div>
        </div>
    </>
  );
};
{/* <Link className='text-blue-700 font-bold' href="/login">Log In</Link> */ }


// export default LogInPage;

{/* <div className="flex space-x-5 ">
          <button
            onClick={() => signIn("google")}
            className="border border-black rounded-md p-[15px] [250px]"
          >
            Sign in with google
          </button>
          <button
            onClick={() => signIn("github")}
            className="border border-black rounded-md p-[15px] [250px]"
          >
            Sign in with github
          </button>
        </div> */}