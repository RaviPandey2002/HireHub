"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import { Eye, EyeOff, Briefcase, Sparkles, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormError } from "@/components/helper/form-error"
import { login } from "actions/login"
import { demoLoginAction } from "actions/demoLoginAction"
import { LoginSchema } from "schema"

export function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const [demoLoadingRole, setDemoLoadingRole] = useState<"Recruiter" | "Candidate" | null>(null)
  const [error, setError] = useState<string | undefined>("")
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  })

  const { update } = useSession()

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("")
    startTransition(async () => {
      const response = await login(values)
      if (response?.error) {
        setError(response.error)
      } else if (response?.success) {
        await update() // sync client-side session token first
        window.location.href = "/"
      }
    })
  }

  const handleDemoLogin = (role: "Recruiter" | "Candidate") => {
    setError("")
    setDemoLoadingRole(role)
    startTransition(async () => {
      try {
        const res = await demoLoginAction(role)
        if (res?.error) {
          setError(res.error)
          setDemoLoadingRole(null)
        } else if (res?.success) {
          await update() // sync client-side session token first
          window.location.href = "/"
        }
      } catch {
        setError("An unexpected error occurred while launching demo sandbox. Please try again.")
        setDemoLoadingRole(null)
      }
    })
  }

  const isAnyLoading = isPending || !!demoLoadingRole

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isAnyLoading}
                    placeholder="johndoe@example.com"
                    type="email"
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      disabled={isAnyLoading}
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormError message={error} />

        <Button
          disabled={isAnyLoading}
          type="submit"
          className="w-full flex items-center justify-center gap-2"
        >
          {isPending && !demoLoadingRole ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Sign in"
          )}
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 dark:text-slate-400 font-medium">
              Or explore instantly
            </span>
          </div>
        </div>

        {/* 1-Click Demo Sandbox Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isAnyLoading}
            onClick={() => handleDemoLogin("Recruiter")}
            className="w-full relative py-5 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-indigo-900/60 dark:hover:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium flex items-center justify-center gap-2 group transition-all"
          >
            {demoLoadingRole === "Recruiter" ? (
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400" />
            ) : (
              <>
                <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>Demo Recruiter</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={isAnyLoading}
            onClick={() => handleDemoLogin("Candidate")}
            className="w-full relative py-5 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 dark:border-emerald-900/60 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium flex items-center justify-center gap-2 group transition-all"
          >
            {demoLoadingRole === "Candidate" ? (
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600 dark:text-emerald-400" />
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Demo Candidate</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
