"use server"

import { db } from "lib/db";
import { revalidatePath } from "next/cache";

async function CreateJobApplicationAction(data, pathToRevalidate) {
    await db.application.create({
        data: data,
    });
    revalidatePath(pathToRevalidate);

}

export default CreateJobApplicationAction;