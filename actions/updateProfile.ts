"use server";

import { auth, unstable_update } from "auth";
import { db } from "lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface UserRef {
  id: string;
  role: string;
}

export async function updateProfile(
  user: UserRef,
  profileInfo: Prisma.JsonObject,
  pathToRevalidate: string
) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, message: "Unauthorised" };
  }

  const sessionUserId = session.user.id ?? (session as any).user?.sub;
  if (user?.id !== sessionUserId) {
    return { success: false, message: "Unauthorised" };
  }

  const updateData: Prisma.UserUpdateInput =
    user?.role === "Candidate"
      ? { candidateInfo: profileInfo }
      : { recruiterInfo: profileInfo };

  const newName = (profileInfo as any)?.name;
  if (newName && typeof newName === "string") {
    updateData.name = newName;
  }

  try {
    await db.user.update({
      where: { id: sessionUserId },
      data: updateData,
    });

    if (newName && newName !== session.user.name) {
      await unstable_update({
        user: {
          ...session.user,
          name: newName,
        },
      });
    }
  } catch (err: any) {
    console.error("Error updating User Profile:", err);
    return { success: false, message: err?.message || "Something went wrong" };
  }

  revalidatePath(pathToRevalidate);
  return { success: true, message: "Profile updated successfully" };
}
