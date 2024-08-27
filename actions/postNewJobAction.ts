import { revalidatePath } from "next/cache";


export async function postNewJobAction(formData, pathToRevalidate) {
    // await connectToDB();
    // await Job.create(formData);
    revalidatePath(pathToRevalidate);
}