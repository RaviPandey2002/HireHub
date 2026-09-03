"use server"

import { auth, unstable_update } from "auth";
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

    const userId = session.user.id ?? (session as any).user?.sub;
    if (!userId) {
        return { success: false, message: "Unauthorised: Missing user session" };
    }

    if (currentTab === "recruiter") {
        const parsed = RecruiterProfileSchema.safeParse(formData.recruiterInfo);
        if (!parsed.success) {
            const errorDetails = Object.values(parsed.error.flatten().fieldErrors).flat().join(", ");
            return { success: false, message: `Invalid recruiter profile: ${errorDetails}` };
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

            await unstable_update({
                user: {
                    ...session.user,
                    role: "Recruiter",
                },
            });

            revalidatePath("/");
            return { success: true, message: "Profile updated successfully" };
        } catch (err: any) {
            console.error("Error updating recruiter profile:", err);
            return { success: false, message: err?.message || "Something went wrong" };
        }
    } else {
        const parsed = CandidateProfileSchema.safeParse(formData.candidateInfo);
        if (!parsed.success) {
            const errorDetails = Object.values(parsed.error.flatten().fieldErrors).flat().join(", ");
            return { success: false, message: `Invalid candidate profile: ${errorDetails}` };
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

            await unstable_update({
                user: {
                    ...session.user,
                    role: "Candidate",
                },
            });

            revalidatePath("/");
            return { success: true, message: "Candidate Profile updated successfully" };
        } catch (err: any) {
            console.error("Error updating candidate profile:", err);
            return { success: false, message: err?.message || "Something went wrong" };
        }
    }
};
