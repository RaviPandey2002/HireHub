import { UserRole } from "@prisma/client"
import NextAuth, { type DefaultSession } from "node_modules/next-auth"

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole;
};

declare module "node_modules/next-auth"{
    interface Session{
        user:ExtendedUser;
    }
}