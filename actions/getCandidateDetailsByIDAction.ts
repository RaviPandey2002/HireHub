"use server";

import { auth } from "auth";
import { db } from "lib/db";

export const getCandidateDetailsByIDAction = async (candidateId: string) => {
  try {
    const session = await auth();
    if (!session?.user) {
      return null;
    }
    // Only a logged-in Recruiter or candidate themselves may fetch details
    if (session.user.role !== "Recruiter" && session.user.id !== candidateId) {
      return null;
    }

    const user = await db.user.findUnique({ where: { id: candidateId } });
    if (!user) return null;
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("getCandidateDetailsByIDAction error:", error);
    return null;
  }
};