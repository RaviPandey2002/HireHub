"use server"

import * as z from 'zod';
import { LoginSchema } from '../schema';
import { AuthError } from 'node_modules/next-auth'
import { signIn } from '../auth';
import { onBoardingRoute } from "../routes"
import { getUserByEmail } from '../data/user'

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFeilds = LoginSchema.safeParse(values);

    if (!validatedFeilds) {
        return { error: "Invalid fields" };
    }

    const { email, password } = validatedFeilds.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "Email is not registered!!" }
    }
    
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: onBoardingRoute,
        })
    }
    catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid Credentials" }
                default:
                    return { error: "Something went wrong!" };

            }
        }
        throw error;
    }

    return { success: "Email Sent!" };
};