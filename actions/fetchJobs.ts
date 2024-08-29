"use server"
import { db } from "lib/db";

export async function fetchJobsForRecruiterAction(recruiterId) {
    try {
        const result = await db.jobs.findMany({ where: { recruiterId } })
        return JSON.parse(JSON.stringify(result));
    }
    catch {
        return null;
    }
}
