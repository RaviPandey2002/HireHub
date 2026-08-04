import { db } from "lib/db";
export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({ where: { email } })
        return user;
    }
    catch {
        return null;
    }
}

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({ where: { id } })
        return user;
    }
    catch {
        return null;
    }
}


export async function fetchJobsForRecruiter(recruiterId) {
    try {
        const result = await db.jobs.findMany({ where: { recruiterId } })
        return JSON.parse(JSON.stringify(result));
    }
    catch {
        return null;
    }
}

export async function fetchJobsForCandidate() {
    try {
        const result = await db.jobs.findMany({})
        return JSON.parse(JSON.stringify(result));
    }
    catch {
        return null;
    }
}

export async function fetchJobApplicationsForCandidate(candidateId) {
    const result = await db.application.findMany({ where: { candidateId } });
    return JSON.parse(JSON.stringify(result));
}

export async function fetchJobApplicationsForRecruiter(recruiterID) {
    const result = await db.application.findMany({ where: { recruiterId: recruiterID } });
    return JSON.parse(JSON.stringify(result));
}

export async function createFilterCategoriesAction (){
    const result = await db.jobs.findMany({});
    return JSON.parse(JSON.stringify(result));
}

export async function fetchRecruiterDashboardStats(recruiterId: string) {
    try {
        const [jobs, applications] = await Promise.all([
            db.jobs.findMany({ where: { recruiterId } }),
            db.application.findMany({
                where: { recruiterId },
                orderBy: { jobApplicationDate: "desc" },
                take: 10,
            }),
        ]);

        const totalJobs = jobs.length;
        const totalApplications = applications.length;
        const selected = applications.filter(a => a.status.includes("Selected")).length;
        const rejected = applications.filter(a => a.status.includes("Rejected")).length;
        const pending  = applications.filter(
            a => !a.status.includes("Selected") && !a.status.includes("Rejected")
        ).length;

        return JSON.parse(JSON.stringify({
            totalJobs,
            totalApplications,
            selected,
            rejected,
            pending,
            recentApplications: applications,
        }));
    } catch {
        return null;
    }
}

export async function fetchCandidateDashboardStats(candidateId: string) {
    try {
        const applications = await db.application.findMany({
            where: { candidateId },
            orderBy: { jobApplicationDate: "desc" },
        });

        const total    = applications.length;
        const selected = applications.filter(a => a.status.includes("Selected")).length;
        const rejected = applications.filter(a => a.status.includes("Rejected")).length;
        const applied  = applications.filter(
            a => !a.status.includes("Selected") && !a.status.includes("Rejected")
        ).length;

        return JSON.parse(JSON.stringify({
            total,
            selected,
            rejected,
            applied,
            recentApplications: applications,
        }));
    } catch {
        return null;
    }
}

export async function fetchDistinctCompanies() {
    try {
        const jobs = await db.jobs.findMany({
            select: { companyName: true, recruiterId: true, location: true },
        });
        // Deduplicate by companyName, keep location of first occurrence
        const seen = new Map<string, { companyName: string; recruiterId: string; location: string; jobCount: number }>();

        for (const job of jobs) {
            if (!seen.has(job.companyName)) {
                seen.set(job.companyName, { ...job, jobCount: 1 });
            } else {
                seen.get(job.companyName)!.jobCount++;
            }
        }
        
        return JSON.parse(JSON.stringify(Array.from(seen.values())));
    } catch {
        return [];
    }
}