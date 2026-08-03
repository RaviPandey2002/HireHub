"use server"

import { auth } from "auth";
import { db } from "lib/db";
import { revalidatePath } from "next/cache";
import { UpdateJobApplicationSchema } from "schema";

export async function updateJobApplicationAction(
    jobApplicantsToUpdate: unknown,
    pathToRevalidate: string,
) {
    const session = await auth();
    if (!session?.user || session.user.role !== "Recruiter") {
        return { error: "Unauthorised" };
    }

    const parsed = UpdateJobApplicationSchema.safeParse(jobApplicantsToUpdate);
    if (!parsed.success) {
        return { error: "Invalid data", issues: parsed.error.flatten().fieldErrors };
    }

    // Verify the application belongs to this recruiter before updating
    const application = await db.application.findUnique({
        where: { id: parsed.data.id },
        select: { recruiterId: true },
    });

    if (!application) {
        return { error: "Application not found" };
    }

    if (application.recruiterId !== session.user.id) {
        return { error: "Unauthorised" };
    }

    await db.application.update({
        where: { id: parsed.data.id },
        data: { status: parsed.data.status },
    });

    revalidatePath(pathToRevalidate);
}
