"use server";

import { auth } from "auth";
import { db } from "lib/db";
import { revalidatePath } from "next/cache";

export async function toggleSaveJobAction(jobId: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "Candidate") {
      return { error: "Unauthorised" };
    }

    if (!jobId || typeof jobId !== "string") {
      return { error: "Invalid job ID" };
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, candidateInfo: true },
    });

    if (!user) {
      return { error: "User profile not found" };
    }

    const candidateInfo = (user.candidateInfo as Record<string, any>) || {};
    const currentSaved: string[] = Array.isArray(candidateInfo.savedJobs) ? candidateInfo.savedJobs : [];

    const isAlreadySaved = currentSaved.includes(jobId);
    const updatedSaved = isAlreadySaved
      ? currentSaved.filter((id) => id !== jobId)
      : [...currentSaved, jobId];

    await db.user.update({
      where: { id: user.id },
      data: {
        candidateInfo: {
          ...candidateInfo,
          savedJobs: updatedSaved,
        },
      },
    });

    revalidatePath("/jobs");
    revalidatePath("/activity");
    revalidatePath("/dashboard");

    return {
      success: true,
      isSaved: !isAlreadySaved,
      savedCount: updatedSaved.length,
    };
  } catch (error) {
    console.error("Error toggling saved job:", error);
    return { error: "Failed to update saved job. Please try again." };
  }
}
