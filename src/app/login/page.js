"use client";

import { useSession } from "next-auth/react";
import React from "react";
import { LogInPage } from "../components/auth/LogInPage";

const LoginPage = () => {
  const { data: session, update } = useSession();
  if (update === "authenticated") {
    console.log("AUTH_SES: ", session);
  } else {
    console.log("UN+AUTH_SES: ", session);
  }


  return <>{!session ? <LogInPage /> : null}</>;
};

export default LoginPage;

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
