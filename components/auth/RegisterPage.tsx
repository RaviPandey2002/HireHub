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
      //Redirect to homepage (/timeline)
      router.push("/timeline");
    } else {
      console.log("Error: ", signInResponse);
      setError("Your Email or Password is wrong!");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Create New Account! </h2>
          <div className="mt-6">
            <RegisterForm />
            <OtherProviders/>
            <span className="flex justify-center">
              Already Have an account? Click
              <Link href="/register" className="text-blue-500">
                . Here
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>

  );
}


{/* <form
        onSubmit={handleSubmit}
        className='flex flex-col justify-center items-center gap-5 max-w-lg  shadow-2xl shadow-gray-900 h-screen hover:shadow-gray-300  bg-white mx-auto rounded-md text-gray-900'

      >
        <h3 className='text-2xl '>Create New Account! </h3>
        <label className="block">
          <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
            Name
          </span>
          <input required type="name" name="name" className="mt-1 px-3 py-4 w-[300px] md:w-[450px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1" placeholder="Enter your name" />
        </label>

        <label className="block">
          <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
            Email
          </span>
          <input required type="email" name="email" className="mt-1 px-3 py-4 w-[300px] md:w-[450px] bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1" placeholder="Enter your email address" />
        </label>

        <label className="block">
          <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
            Password
          </span>
          <input required type="password" name="password" className="mt-1 w-[300px] md:w-[450px] px-3 py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1" placeholder="Enter your password" />
        </label>
        <label className="block">
          <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
            Confirm Password
          </span>
          <input required type="password" name="confirmPassword" className="mt-1 w-[300px] md:w-[450px] px-3 py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md sm:text-sm focus:ring-1" placeholder="Enter your password" />
        </label>
        <span className='block w-full mr-auto ml-7'>Already have an Account? <Link className='text-blue-700 font-bold' href="/login">Log In</Link></span>
        <button className='bg-[#53c28b] text-white rounded-md p-[15px] w-[90%]' type="submit">Sign Up</button> </form>*/}