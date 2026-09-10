"use server";

import { auth } from "auth";
import { db } from "lib/db";
import { revalidatePath } from "next/cache";
import { ToggleJobStatusSchema } from "schema";

export async function toggleJobStatusAction(payload: unknown, pathToRevalidate: string = "/jobs") {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "Recruiter") {
      return { error: "Unauthorised" };
    }

    const parsed = ToggleJobStatusSchema.safeParse(payload);
    if (!parsed.success) {
      return { error: "Invalid request payload", issues: parsed.error.flatten().fieldErrors };
    }

    const job = await db.jobs.findUnique({
      where: { id: parsed.data.jobId },
      select: { id: true, recruiterId: true, status: true },
    });

    if (!job) {
      return { error: "Job opening not found" };
    }

    if (job.recruiterId !== session.user.id) {
      return { error: "You are not authorized to modify this job" };
    }

    await db.jobs.update({
      where: { id: parsed.data.jobId },
      data: { status: parsed.data.status },
    });

    revalidatePath(pathToRevalidate);
    revalidatePath("/dashboard");
    revalidatePath("/companies");
    revalidatePath("/");

    return { success: true, status: parsed.data.status };
  } catch (error) {
    console.error("Error toggling job status:", error);
    return { error: "Failed to update job status. Please try again." };
  }
}
