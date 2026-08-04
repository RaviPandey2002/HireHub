"use server"

import { auth } from "auth";
import { db } from "lib/db";

export const getCandidateDetailsByIDAction = async (candidateId: string) => {
    const session = await auth();
    // Only a logged-in Recruiter may fetch candidate details
    if (!session?.user || session.user.role !== "Recruiter") {
        return null;
    }

    const user = await db.user.findUnique({ where: { id: candidateId } });
    return JSON.parse(JSON.stringify(user));
}