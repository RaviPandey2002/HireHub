/**
 * Edge-safe auth config — no Node.js-only APIs.
 * Used by middleware.ts via auth.edge.ts (Edge Runtime).
 * OAuth providers only — Credentials authorize() runs in auth.ts (Node.js).
 */
import type { NextAuthConfig } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";

const edgeConfig = {
    providers: [
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

export default edgeConfig
