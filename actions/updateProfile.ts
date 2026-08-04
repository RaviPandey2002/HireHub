"use server"

import { auth } from "auth";
import { db } from "lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfile(user, profileInfo, pathToRevalidate) {
    const session = await auth();
    if (!session?.user) {
        return { success: false, message: "Unauthorised" };
    }
    // Only allow users to update their own profile
    if (user?.id !== session.user.id) {
        return { success: false, message: "Unauthorised" };
    }

    const updateData = user?.role === "Candidate"
        ? { candidateInfo: profileInfo }
        : { recruiterInfo: profileInfo };

    try {
        await db.user.update({
            where: { id: user?.id },
            data: updateData,
        });
    } catch (err) {
        console.error("Error updating User Profile:", err);
        return { success: false, message: "Something went wrong" };
    }
    revalidatePath(pathToRevalidate);
    return { success: true };
}