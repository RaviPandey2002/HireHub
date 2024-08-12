"use client"
import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers";
import { LoginSchema } from "../../schema";


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

export const LoginForm = () => {
  const form =
    useForm <
    z.infer <
    typeof LoginSchema >>
      {
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
      };

  return <>
  
  </>;
};
