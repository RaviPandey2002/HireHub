import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" })
        .transform((val) => val.toLowerCase().trim()),
    password: z.string()
        .min(1, { message: "Password is required" }),
})

export const RegisterSchema = z.object({
    name: z.string()
        .min(1, { message: "Name is required" })
        .trim(),
    email: z.string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please enter a valid email address" })
        .transform((val) => val.toLowerCase().trim()),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters" }),
})
