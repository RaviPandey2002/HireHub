import { Awaitable, NextAuthOptions, RequestInternal, User } from "next-auth"

import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../lib/database";

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        EmailProvider({
            server: {
              host: process.env.EMAIL_SERVER_HOST as string,
              port: process.env.EMAIL_SERVER_PORT as string,
              auth: {
                user: process.env.EMAIL_SERVER_USER as string,
                pass: process.env.EMAIL_SERVER_PASSWORD as string
              }
            },
          }),

    ]

}


// CredentialsProvider({
        //     name: "Sign in",
        //     credentials: {
        //         email: {
        //             label: "Email",
        //             type: "email",
        //             placeholder: "example@example.com"
        //         },
        //         password: { label: "Password", type: "password" },
        //     },
        //     async authorize(credentials) {
        //         if (!credentials || !credentials.email || !credentials.password) return null;

        //         const dbUser = await prisma.user.findFirst({
        //             where: { email: credentials.email }
        //         })

        //         if (dbUser && dbUser.password === credentials.password) {
        //             const { password, createdAt, id, ...dbUserWithoutPassword } = dbUser
        //         }
        //         return null;
        //     }
        // }),