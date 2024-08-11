"use client";

import { signIn, useSession, signOut } from "next-auth/react";
import CredentialsForm from "../../../@/components/CredentialsForm/index"
import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../@/components/ui/card";

const SignInPage = () => {
  const { data: session } = useSession();
  return (
    <>
      {!session ? (
        <>
          {
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
              
              <CredentialsForm />
          
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                <div className="flex space-x-5 ">
                  <button
                    onClick={() => signIn("google")}
                    className="border border-black rounder-lg px-5 py-1 rounded-lg"
                  >
                    Sign in with google
                  </button>
                  <button
                    onClick={() => signIn("github")}
                    className="border border-black rounder-lg bg-green-500 px-5 py-1 rounded-lg"
                  >
                    Sign in with github
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          }
                   
          
          
          
          {/* <h1>Welcome Back</h1>
          <h3 className="text-green-600">{session?.user.name}</h3>
          <button
            onClick={() => signOut({ callbackUrl: `/` })}
            className="border border-black rounder-lg bg-red-500 px-5 py-1 rounded-lg"
          >
            SignOut
          </button> */}
        </>
      ) : (
        <>
          <div className="max-2-7xl mx-auto my-12 space-y-5">
            <h1 className=" text-red-500"> You are not logged IN!!</h1>
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                <button
                    onClick={() => signIn("email")}
                    className="border border-black rounder-lg px-5 py-1 rounded-lg"
                  >
                    Sign in with email
                  </button>
                </div>
                {/* <div className="flex space-x-5 ">
                  <button
                    onClick={() => signIn("google")}
                    className="border border-black rounder-lg px-5 py-1 rounded-lg"
                  >
                    Sign in with google
                  </button>
                  <button
                    onClick={() => signIn("github")}
                    className="border border-black rounder-lg bg-green-500 px-5 py-1 rounded-lg"
                  >
                    Sign in with github
                  </button>
                </div> */}
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </>
  );
};

export default SignInPage;
