import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import authConfig from "auth.config"
import { getUserById, getUserByEmail } from "data/user"
import { db } from "lib/db"
import { LoginSchema } from "schema"
import bcrypt from "bcryptjs"
import { ZodError } from "zod"

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const validatedFields = LoginSchema.safeParse(credentials);
          if (!validatedFields.success) return null;
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
          return null;
        } catch (error) {
          if (error instanceof ZodError) return null;
          throw error;
        }
      }
    }),
    ...authConfig.providers,
  ],
  callbacks: {
    // Redirect after sign-in based on role in the token.
    // This fires after jwt() so token.role is already set correctly.
    async signIn() {
      // Allow the sign-in — the redirect target is controlled by middleware
      // reading req.auth.user.role from the JWT we write in jwt() below.
      return true;
    },

    async redirect({ url, baseUrl }) {
      // Always redirect to "/" after sign-in; middleware will then forward
      // OnBoarding-role users to /onboard automatically.
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as any;
        session.user.image = token.picture as string;
      }
      return session;
    },

    async jwt({ token, user, account, profile, trigger }) {
      // ── Credentials sign-in ──────────────────────────────────────────────
      // `user` is the object returned by authorize() — already a DB record.
      if (user && account?.provider === "credentials") {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as any).role;
        token.picture = (user as any).image ?? null;
        return token;
      }

      // ── OAuth sign-in (Google / GitHub) ──────────────────────────────────
      // `user` is the OAuth profile. We must look up or create the DB record
      // so that `role` is always populated (new users get "OnBoarding").
      if (user && account?.provider !== "credentials") {
        const email = user.email ?? (profile as any)?.email;
        if (email) {
          let dbUser = await getUserByEmail(email);

          if (!dbUser) {
            // First time this OAuth account is used — create a DB record.
            dbUser = await db.user.create({
              data: {
                name: user.name ?? (profile as any)?.name ?? "",
                email,
                image: user.image ?? (profile as any)?.picture ?? null,
                // password is null — OAuth-only account
              },
            });
          }

          token.sub = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.role = dbUser.role;          // "OnBoarding" for new users
          token.picture = dbUser.image ?? null;
        }
        return token;
      }

      // ── Session update() trigger ─────────────────────────────────────────
      // Re-fetch from DB so role changes (e.g. after onboarding) are reflected.
      if (trigger === "update" && token.sub) {
        const existingUser = await getUserById(token.sub);
        if (existingUser) {
          token.role = existingUser.role;
          token.name = existingUser.name;
        }
        return token;
      }

      return token;
    },
  },
  session: { strategy: "jwt" },
});
