"use server"

import { db } from "lib/db";

export const getCandidateDetailsByIDAction = async (candidateId: string) => {
    const user = await db.user.findUnique({ where: { id: candidateId } })
    return JSON.parse(JSON.stringify(user));
}