"use server"

import { auth } from "auth";
import { db } from "lib/db";
import { revalidatePath } from "next/cache";
import { CandidateProfileSchema, RecruiterProfileSchema } from "schema";

export const createProfileAction = async (currentTab: string, formData: {
    id?: string;
    email?: string;
    role: string;
    isPremiumUser: boolean;
    recruiterInfo?: unknown;
    candidateInfo?: unknown;
}) => {
    const session = await auth();
    if (!session?.user) {
        return { success: false, message: "Unauthorised" };
    }

    // Only allow users to update their own profile
    const userId = formData.id ?? session.user.id;
    if (userId !== session.user.id) {
        return { success: false, message: "Unauthorised" };
    }

    if (currentTab === "recruiter") {
        const parsed = RecruiterProfileSchema.safeParse(formData.recruiterInfo);
        if (!parsed.success) {
            return { success: false, message: "Invalid recruiter profile data" };
        }
        try {
            await db.user.update({
                where: { id: userId },
                data: {
                    recruiterInfo: parsed.data,
                    role: "Recruiter",
                    isPremiumUser: false,
                },
            });
            revalidatePath("/");
            return { success: true, message: "Profile updated successfully" };
        } catch {
            return { success: false, message: "Something went wrong" };
        }
    } else {
        const parsed = CandidateProfileSchema.safeParse(formData.candidateInfo);
        if (!parsed.success) {
            return { success: false, message: "Invalid candidate profile data" };
        }
        try {
            await db.user.update({
                where: { id: userId },
                data: {
                    candidateInfo: parsed.data,
                    role: "Candidate",
                    isPremiumUser: false,
                },
            });
            revalidatePath("/");
            return { success: true, message: "Candidate Profile updated successfully" };
        } catch {
            return { success: false, message: "Something went wrong" };
        }
    }
};
