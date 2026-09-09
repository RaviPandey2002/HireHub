"use server";

import { auth } from "auth";
import { db } from "lib/db";
import { revalidatePath } from "next/cache";
import { WithdrawApplicationSchema } from "schema";

export async function withdrawApplicationAction(data: unknown) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "Candidate") {
            return { error: "Unauthorised" };
        }

        const parsed = WithdrawApplicationSchema.safeParse(data);
        if (!parsed.success) {
            return { error: "Invalid application identifier", issues: parsed.error.flatten().fieldErrors };
        }

        const application = await db.application.findUnique({
            where: { id: parsed.data.applicationId },
            select: {
                id: true,
                candidateId: true,
                jobId: true,
            },
        });

        if (!application) {
            return { error: "Application not found or already withdrawn." };
        }

        // Candidate can only withdraw their own application
        if (application.candidateId !== session.user.id) {
            return { error: "You can only withdraw your own applications." };
        }

        await db.application.delete({
            where: { id: parsed.data.applicationId },
        });

        revalidatePath("/activity");
        revalidatePath("/jobs");
        revalidatePath("/dashboard");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Error withdrawing application:", error);
        return { error: "Failed to withdraw application. Please try again." };
    }
}

