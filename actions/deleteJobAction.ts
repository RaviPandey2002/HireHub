"use server"

import { auth } from "auth";
import { db } from "lib/db";
import { revalidatePath } from "next/cache";

export async function deleteJobAction(jobId: string, pathToRevalidate: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "Recruiter") {
        return { error: "Unauthorised" };
    }

    // Verify the job belongs to this recruiter before deleting
    const job = await db.jobs.findUnique({
        where: { id: jobId },
        select: { recruiterId: true },
    });

    if (!job) {
        return { error: "Job not found" };
    }

    if (job.recruiterId !== session.user.id) {
        return { error: "Unauthorised" };
    }

    // Cascade: delete all applications for this job first
    await db.application.deleteMany({ where: { jobId } });

    // Then delete the job itself
    await db.jobs.delete({ where: { id: jobId } });

    revalidatePath(pathToRevalidate);
    return { success: true };
}
