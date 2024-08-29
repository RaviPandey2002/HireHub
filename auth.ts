import NextAuth from "node_modules/next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "auth.config"
import { db } from "lib/db"
import { getUserById } from "data/user"
import { UserRole } from "@prisma/client"


export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
     async session({ token, session, user }) {
      if(token.sub && session.user )
      {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;

      }
      if (token.user && session.user) {
        //@ts-ignore
        session.user = {...token.user};
      }
      // console.log("auth session",session?.user);
      return session;
    },

    async jwt({ token, trigger, session, user }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token;
      token.role = existingUser.role;
      token.user = existingUser;
      user = token.user;

      // console.log("token:: ",token);
      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig
});

