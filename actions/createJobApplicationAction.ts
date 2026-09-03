"use server"

import { auth } from "auth";
import { db } from "lib/db";
import { revalidatePath } from "next/cache";
import { CreateJobApplicationSchema } from "schema";

async function CreateJobApplicationAction(data: unknown, pathToRevalidate: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "Candidate") {
        return { error: "Unauthorised" };
    }

    const parsed = CreateJobApplicationSchema.safeParse(data);
    if (!parsed.success) {
        return { error: "Invalid application data", issues: parsed.error.flatten().fieldErrors };
    }

    // Ensure the candidateId in the payload matches the signed-in user
    if (parsed.data.candidateId !== session.user.id) {
        return { error: "Unauthorised" };
    }

    // Prevent duplicate applications for the same job
    const existingApplication = await db.application.findFirst({
        where: {
            candidateId: session.user.id,
            jobId: parsed.data.jobId,
        },
    });

    if (existingApplication) {
        return { error: "You have already applied for this position." };
    }

    // Server-side freemium quota enforcement: max 2 applications on free tier
    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { isPremiumUser: true },
    });

    if (!user?.isPremiumUser) {
        const applicationCount = await db.application.count({
            where: { candidateId: session.user.id },
        });
        if (applicationCount >= 2) {
            return {
                error: "Free accounts can apply to max 2 jobs. Please upgrade your membership to apply to more.",
            };
        }
    }

    await db.application.create({ data: parsed.data as Required<typeof parsed.data> });
    revalidatePath(pathToRevalidate);
    return { success: true };
}

export default CreateJobApplicationAction;
