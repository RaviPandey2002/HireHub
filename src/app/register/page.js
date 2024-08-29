"use client";

import { useSession } from "next-auth/react";
import React from "react";
import { RegisterPage } from "@/components/auth/RegisterPage";

const Register = () => {
  const { data: session } = useSession();
  return <>{!session ? <RegisterPage /> : null}</>;
};

export default Register;

