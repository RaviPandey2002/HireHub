"use server"

import { db } from "lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfile(user, profileInfo, pathToRevalidate) {
    console.log("updateProfile ", profileInfo);
    var { candidateData, recruiterData } = user;
    if(user?.role === "Candidate")
    {
        candidateData = profileInfo;
    }
    else{
        recruiterData = profileInfo;
    }
    try { 
        await db.user.update({
            where: {
                id: user?.id
            },
            data: {
                candidateInfo: candidateData,
                recruiterInfo: recruiterData
            }
        })
    }
    catch (err) {
        console.error("Error updating User Profile- ", err)
    }
    revalidatePath(pathToRevalidate);
}