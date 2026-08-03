/**
 * Edge-only auth instance — used exclusively by middleware.ts.
 *
 * This instance has NO providers and NO jwt callback.
 * It only reads the JWT cookie that was written by auth.ts (the Node.js
 * instance that handles /api/auth/* routes). Both instances share the same
 * AUTH_SECRET so the JWT is compatible.
 *
 * The session callback maps token claims → session.user so middleware can
 * read req.auth.user.role for routing decisions.
 */
import NextAuth from "next-auth"

export const { auth } = NextAuth({
  providers: [],           // no providers — auth.ts owns the OAuth flow
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token }) {
      // Pass the token through unchanged.
      // auth.ts is responsible for writing all claims (role, sub, etc.)
      // during sign-in and session update(). We just carry them forward.
      return token;
    },
    async session({ token, session }) {
      // Map token claims into session.user so middleware can read them.
      if (token.sub && session.user) {
        session.user.id     = token.sub;
        session.user.email  = token.email  as string;
        // @ts-ignore — role is a custom claim
        session.user.role   = token.role;
      }
      return session;
    },
  },
})
