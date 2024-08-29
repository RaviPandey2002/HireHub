"use server"

import { signIn } from 'auth';
import { AuthError } from 'node_modules/next-auth';
import * as z from 'zod';
import { getUserByEmail } from '../data/user';
import { LoginSchema } from '../schema';

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFeilds = LoginSchema.safeParse(values);

    if (!validatedFeilds.success) {
        return { error: "Invalid fields" };
    }

    const { email, password } = validatedFeilds.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "Email is not registered!!" }
    }

    try {
        const response = await signIn("credentials", {
            redirect: false,
            email,
            password,
            // redirectTo: "/onboard"
        })
        if (!response) {
            return { error: "Invalid Credentials" };
        }
        return { success: "Logged in successfully!" };
    }

    catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid Credentials" }
                default:
                    return { error: " Something went wrong!" };

            }
        }
        throw error;
    }


};