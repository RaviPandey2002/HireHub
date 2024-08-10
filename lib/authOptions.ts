import { NextAuthOptions } from "next-auth"

import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email"

const authOptions: NextAuthOptions = {
    providers:[
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        // EmailProvider({
        //     server: process.env.EMAIL_SERVER,
        //     from: process.env.EMAIL_FROM
        //   }),
        //   EmailProvider({
        //     server: {
        //       host: process.env.EMAIL_SERVER_HOST,
        //       port: process.env.EMAIL_SERVER_PORT,
        //       auth: {
        //         user: process.env.EMAIL_SERVER_USER,
        //         pass: process.env.EMAIL_SERVER_PASSWORD
        //       }
        //     },
        //     from: process.env.EMAIL_FROM
        //   }),
    ]

}

export default authOptions;