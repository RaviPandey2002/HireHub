"use server"

import { auth } from "auth";
import { db } from "lib/db";
import { revalidatePath } from "next/cache";
import { PostNewJobSchema } from "schema";

export async function postNewJobAction(formData: unknown, pathToRevalidate: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== "Recruiter") {
        return { error: "Unauthorised" };
    }

    const parsed = PostNewJobSchema.safeParse(formData);
    if (!parsed.success) {
        return { error: "Invalid job data", issues: parsed.error.flatten().fieldErrors };
    }

    // Ensure the recruiterId in the payload matches the signed-in user
    if (parsed.data.recruiterId !== session.user.id) {
        return { error: "Unauthorised" };
    }

    await db.jobs.create({ data: parsed.data as Required<typeof parsed.data> });
    revalidatePath(pathToRevalidate);
}
