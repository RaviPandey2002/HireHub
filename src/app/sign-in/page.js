"use client";

import { useSession } from "next-auth/react";
import React from "react";
import { LogInPage }  from "../../../@/components/auth/LogInPage";
import CredentialsForm from "../../../@/components/CredentialsForm/index";
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
  console.log(session);
  return (
    <>
      {
        !session ? (<LogInPage/>) : null
      }
    </>
);
};

export default SignInPage;

/* {

{
  /* <h1>Welcome Back</h1>
          <h3 className="text-green-600">{session?.user.name}</h3>
          <button
            onClick={() => signOut({ callbackUrl: `/` })}
            className="border border-black rounder-lg bg-red-500 px-5 py-1 rounded-lg"
          >
            SignOut
          </button> */
// }
