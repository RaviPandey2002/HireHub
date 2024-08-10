"use client";

import { signIn, useSession, signOut } from "next-auth/react";
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
      {session ? (
        <>
          <h1>Welcome Back</h1>
          <h3 className="text-green-600">{session?.user.name}</h3>
          <button
            onClick={() => signOut({ callbackUrl: `/` })}
            className="border border-black rounder-lg bg-red-500 px-5 py-1 rounded-lg"
          >
            SignOut
          </button>
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
