"use server"

import { db } from "lib/db";
import { revalidatePath } from "next/cache";

export async function updateJobApplicationAction(jobApplicantsToUpdate, pathToRevalidate) {
    try {
        await db.application.update({
            where: {
                id: jobApplicantsToUpdate.id
            },
            data: {
                ...jobApplicantsToUpdate
            }
        })
    }
    catch (err) {
        console.error("Error updating JobApplication- ", err)
    }
    revalidatePath(pathToRevalidate);
}