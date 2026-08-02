"use server"
import { auth } from "auth";
import { getUserById } from "data/user";

export const getUser = async () => {
    const session = await auth();
    if (!session?.user) return null;

    // Always read fresh from DB so role changes (e.g. after onboarding) are
    // reflected immediately without waiting for the JWT token to be rotated.
    const userId = session.user.id ?? (session as any).user?.sub;
    if (!userId) return null;

    const freshUser = await getUserById(userId);
    if (!freshUser) return null;

    return JSON.parse(JSON.stringify(freshUser));
}
