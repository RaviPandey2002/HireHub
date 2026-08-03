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

    await db.application.create({ data: parsed.data as Required<typeof parsed.data> });
    revalidatePath(pathToRevalidate);
}

export default CreateJobApplicationAction;
