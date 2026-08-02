import { UserRole } from "@prisma/client"
import { type DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
    id: string;
    role: UserRole;
    email: string;
    name?: string | null;
    image?: string | null;
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }

    interface User {
        id: string;
        role: UserRole;
        email: string;
        name?: string | null;
        image?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        sub: string;
        role: UserRole;
        name?: string | null;
        email?: string | null;
        picture?: string | null;
    }
}

export type AppUser = {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    role: UserRole;
    image?: string | null;
};
