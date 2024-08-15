import NextAuth from "next-auth"

import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"
import { db } from "./lib/db"
import { getUserById } from "./data/user"
import { UserRole } from "@prisma/client"

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  callbacks: {
    // async signIn({ user }) {
    //   const existingUser = await getUserById(user.id);
    //   if (!existingUser || existingUser.emailVerified) {
    //     return false;
    //   }
    //   return true;
    // },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      // console.log({ sessionUser: session.user })
      return session;
    },

    async jwt({ token, trigger, session }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token;

      token.role = existingUser.role;

      // if (trigger === "update" && session?.name) {
      //   token.name = session.name
      // }

      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig
});



// export const {
//   handlers: { GET, POST },
//   auth
//  } = NextAuth({ 
//   adapter: PrismaAdapter(db),
//   session: { strategy: "jwt"},
//   ...authConfig
//   })