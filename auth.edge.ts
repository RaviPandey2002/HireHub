/**
 * Edge-only NextAuth instance — used exclusively by middleware.ts.
 * Uses the same AUTH_SECRET as auth.ts so JWT cookies are compatible.
 */
import NextAuth from "next-auth"
import authConfig from "auth.config"

// Both this and auth.ts read AUTH_SECRET from env — same secret = same JWT
export const { auth } = NextAuth({
  ...authConfig,
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.email = token.email as string;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        // @ts-ignore
        token.role = (user as any).role;
      }
      return token;
    }
  },
  session: { strategy: "jwt" },
})
