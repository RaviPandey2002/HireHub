"use client";

import Link from "next/link";
import { NewLoginForm } from "./new-login-form";
import { OtherProviders } from './other-providers';
import { logout } from "actions/logout";
import { Button } from "../ui/button";


export const LogInPage = () => {
  
  return (
    <>

      <div className="min-h-screen flex items-center justify-center bg-gray-50">
       
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <div className="mt-6">
            <NewLoginForm />
            <OtherProviders />
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