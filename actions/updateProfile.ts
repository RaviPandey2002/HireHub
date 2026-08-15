"use server";

import { auth } from "auth";
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
  if (user?.id !== session.user.id) {
    return { success: false, message: "Unauthorised" };
  }

  const updateData: Prisma.UserUpdateInput =
    user?.role === "Candidate"
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
