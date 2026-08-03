"use server"

import { signIn } from 'auth';
import { AuthError } from 'next-auth';
import * as z from 'zod';
import { LoginSchema } from '../schema';

export const login = async (values: z.input<typeof LoginSchema>) => {
    const validatedFeilds = LoginSchema.safeParse(values);

    if (!validatedFeilds.success) {
        return { error: "Invalid fields" };
    }

    const { email, password } = validatedFeilds.data;

    try {
        const response = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });
        if (!response) {
            return { error: "Invalid credentials" };
        }
        return { success: "Logged in successfully!" };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                default:
                    return { error: "Something went wrong" };
            }
        }
        throw error;
    }
};
