"use client"

import { signIn, useSession } from "next-auth/react";
import React from "react";

const SignIN = () => {
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <>
          <h1>Welcome Back</h1>
        </>
      ) : (
        <>
            <h1> You are not logged IN!!</h1>
            <button onClick={()=> signIn("google") } className="border border-black rounder-lg" >Sign in with google</button>
        </>
      )}
    </>
  );
};

export default SignIN;
