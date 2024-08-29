import { db } from '../lib/db'
import { revalidatePath } from "next/cache";


export async function postNewJobAction(formData, pathToRevalidate) {
    await db.jobs.create({
        data: formData,
    });
    revalidatePath(pathToRevalidate);

}