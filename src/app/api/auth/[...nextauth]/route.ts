
import { handlers } from "../../../../../auth"
export const { GET, POST } = handlers;


// export { GET, POST } from "../../../../../auth"

// import NextAuth  from "next-auth/next";
// import { authOptions }  from '../../../../../lib/authOptions'

// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prisma } from "../../../../../lib/db"

// const handler = NextAuth( authOptions );

// export { handler as GET, handler as POST};


// export const {
//     auth,
//     signIn,
//     signOut
//   } = NextAuth({
//     callbacks: {
//       async session({ token, session }) {
//         console.log("Session Token", token);
  
//         return session;
//       },
//       async jwt({ token }) {
//         console.log("JWT Token", token);
//         return token;
//       },
//     },
//     adapter: PrismaAdapter(prisma),
//     session: {
//       strategy: "jwt",
//     }
//   });