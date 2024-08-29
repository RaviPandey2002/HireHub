"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})
//----------------------
import { FormError } from "@/components/helper/form-error"
import { FormSuccess } from "@/components/helper/form-success"
import { login } from "actions/login"
import { useSession } from "next-auth/react"
import { revalidatePath } from "next/cache"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { LoginSchema } from 'schema'
import { DEFAULT_LOGIN_REDIRECT } from "routes"



export function NewLoginForm() {
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
  const { update } = useSession();

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const response = await login(values);
      if (response && response.error) {
        setError(response.error);
      } else if (response && response.success) {
        setSuccess(response.success);
        // router.push('/login');
        // update();

        revalidatePath('/')
        console.log("new login updated",response);
        router.push('/')
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