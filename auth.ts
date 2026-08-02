import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import authConfig from "auth.config"
import { getUserById, getUserByEmail } from "data/user"
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
    async session({ token, session }) {
      // Populate session.user from the JWT token on every request
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as any;
        session.user.image = token.picture as string;
      }
      return session;
    },

    async jwt({ token, user, trigger }) {
      // On first sign-in, `user` is the object returned from authorize()
      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as any).role;
        token.picture = (user as any).image ?? null;
        return token;
      }
      // On session update() call (e.g. after onboarding role change), re-fetch from DB
      if (trigger === "update" && token.sub) {
        const existingUser = await getUserById(token.sub);
        if (existingUser) {
          token.role = existingUser.role;
          token.name = existingUser.name;
        }
        return token;
      }
      return token;
    }
  },
  session: { strategy: "jwt" },
});
