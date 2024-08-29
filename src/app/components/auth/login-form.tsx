"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from 'schema';
import { Input } from '../ui/input';
import { Button } from '../ui/button'
import { FormError } from '../helper/form-error'
import { FormSuccess } from '../helper/form-success'
import { login } from 'actions/login'
import { useTransition, useState } from 'react'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { useRouter } from "next/navigation";
import { getSession, useSession } from "next-auth/react";

export const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const response = await login(values);
      if (response && response.error) {
        setError(response.error);
        console.log("loginForm errorResponse",response)
      } else if (response && response.success) {
        setSuccess(response.success);
        console.log("loginForm ",session?.user);

        const updatedSession = await getSession();
        console.log("Updated session:", updatedSession);
        router.push('/dashboard');
      }

    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>

                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Johndoe@example.com"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="********"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button disabled={isPending} type="submit" className="w-full bg-black text-white border rounded-lg " >
          Login
        </Button>
      </form>
    </Form>
  );
};
