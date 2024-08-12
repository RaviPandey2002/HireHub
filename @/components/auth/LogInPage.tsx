"use client";

import { signIn, useSession, signOut } from "next-auth/react";
import CredentialsForm from "../CredentialsForm/index";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const LogInPage = () => {
  const { data: session } = useSession();
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>

          {/* <CredentialsForm /> */}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300">
                  
                </div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="flex space-x-5 mt-4">
              <button
                onClick={() => signIn("google")}
                className="border border-black rounded-md p-[10px] [150px]"
              >
                Sign in with google
              </button>
              <button
                onClick={() => signIn("github")}
                className="border border-black rounded-md p-[10px] [150px]"
              >
                Sign in with github
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};



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