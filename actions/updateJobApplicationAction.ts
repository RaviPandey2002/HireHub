"use server"

import { auth } from "auth";
import { db } from "lib/db";
import { revalidatePath } from "next/cache";
import { UpdateJobApplicationSchema } from "schema";
import { sendApplicationStatusEmail } from "lib/email";

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
        select: {
            recruiterId: true,
            candidateId: true,
            jobId: true,
            email: true,
            name: true,
            status: true,
        },
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

    // Send status update notification email to candidate (non-blocking for DB flow)
    try {
        const newStatus = parsed.data.status.includes("Selected")
            ? "Selected"
            : parsed.data.status.includes("Rejected")
            ? "Rejected"
            : null;

        if (newStatus && !application.status.includes(newStatus) && application.email) {
            const job = await db.jobs.findUnique({
                where: { id: application.jobId },
                select: { title: true, companyName: true },
            });

            if (job) {
                await sendApplicationStatusEmail({
                    candidateEmail: application.email,
                    candidateName: application.name,
                    jobTitle: job.title,
                    companyName: job.companyName,
                    status: newStatus,
                });
            }
        }
    } catch (emailErr) {
        console.error("Error sending application status email:", emailErr);
    }

    revalidatePath(pathToRevalidate);
    return { success: true };
}
