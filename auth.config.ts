import type { NextAuthConfig } from "node_modules/next-auth"
import Credentials from "node_modules/next-auth/providers/credentials"
import GithubProvider from "node_modules/next-auth/providers/github"
import GoogleProvider from "node_modules/next-auth/providers/google";
import { LoginSchema } from "schema"
import { getUserByEmail } from "data/user"
import bcrypt from "bcryptjs"
import { ZodError } from "zod";


export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);
                try {
                    let user = null;
                    if (validatedFields.success) {
                        const { email, password } = validatedFields.data;
                        user = await getUserByEmail(email);
                        if (!user || !user.password) return null;
                        const passwordsMatch = await bcrypt.compare(
                            password,
                            user.password
                        );

                        if (passwordsMatch) {
                            return user;
                        }
                    }
                }
                catch (error) {
                    if (error instanceof ZodError) {
                        // Return `null` to indicate that the credentials are invalid
                        return null
                    }
                };
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),


    ]
} satisfies NextAuthConfig