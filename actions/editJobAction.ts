"use server";

import { auth } from "auth";
import { db } from "lib/db";
import { revalidatePath } from "next/cache";
import { EditJobSchema } from "schema";

export async function editJobAction(formData: unknown, pathToRevalidate: string = "/jobs") {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "Recruiter") {
      return { error: "Unauthorised" };
    }

    const parsed = EditJobSchema.safeParse(formData);
    if (!parsed.success) {
      return { error: "Invalid job details", issues: parsed.error.flatten().fieldErrors };
    }

    const job = await db.jobs.findUnique({
      where: { id: parsed.data.id },
      select: { id: true, recruiterId: true },
    });

    if (!job) {
      return { error: "Job not found" };
    }

    if (job.recruiterId !== session.user.id) {
      return { error: "You are not authorized to edit this job posting" };
    }

    await db.jobs.update({
      where: { id: parsed.data.id },
      data: {
        companyName: parsed.data.companyName,
        title: parsed.data.title,
        type: parsed.data.type,
        location: parsed.data.location,
        experience: parsed.data.experience,
        description: parsed.data.description,
        skills: parsed.data.skills,
      },
    });

    revalidatePath(pathToRevalidate);
    revalidatePath("/dashboard");
    revalidatePath("/companies");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error editing job posting:", error);
    return { error: "Failed to update job posting. Please try again." };
  }
}
