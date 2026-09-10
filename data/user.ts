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


import { Prisma } from "@prisma/client";

export interface JobQueryFilter {
    recruiterId?: string;
    search?: string;
    location?: string;
    type?: string;
    company?: string;
    page?: number;
    limit?: number;
}

export async function fetchPaginatedJobs(filter: JobQueryFilter = {}) {
    try {
        const where: Prisma.JobsWhereInput = {};

        if (filter.recruiterId) {
            where.recruiterId = filter.recruiterId;
        }

        if (filter.company) {
            where.companyName = { equals: filter.company, mode: "insensitive" };
        }

        if (filter.type) {
            where.type = { equals: filter.type, mode: "insensitive" };
        }

        if (filter.location) {
            where.location = { contains: filter.location, mode: "insensitive" };
        }

        if (filter.search && filter.search.trim() !== "") {
            const term = filter.search.trim();
            where.OR = [
                { title: { contains: term, mode: "insensitive" } },
                { companyName: { contains: term, mode: "insensitive" } },
                { skills: { contains: term, mode: "insensitive" } },
                { location: { contains: term, mode: "insensitive" } },
                { description: { contains: term, mode: "insensitive" } },
            ];
        }

        const page = Math.max(1, filter.page || 1);
        const limit = Math.min(50, Math.max(1, filter.limit || 12));
        const skip = (page - 1) * limit;

        const [jobs, totalCount] = await Promise.all([
            db.jobs.findMany({
                where,
                skip,
                take: limit,
                orderBy: { id: "desc" },
            }),
            db.jobs.count({ where }),
        ]);

        const totalPages = Math.ceil(totalCount / limit) || 1;

        return JSON.parse(JSON.stringify({
            jobs,
            totalCount,
            totalPages,
            currentPage: page,
            limit,
        }));
    } catch (err) {
        console.error("Error fetching paginated jobs:", err);
        return { jobs: [], totalCount: 0, totalPages: 1, currentPage: 1, limit: 12 };
    }
}

export async function fetchJobsForRecruiter(recruiterId: string, filter?: Omit<JobQueryFilter, "recruiterId">) {
    try {
        if (filter && (filter.search || filter.location || filter.type || filter.company || filter.page)) {
            const result = await fetchPaginatedJobs({ ...filter, recruiterId });
            return result.jobs;
        }
        const result = await db.jobs.findMany({
            where: { recruiterId },
            orderBy: { id: "desc" },
        });
        return JSON.parse(JSON.stringify(result));
    }
    catch {
        return null;
    }
}

export async function fetchJobsForCandidate(filter?: JobQueryFilter) {
    try {
        if (filter && (filter.search || filter.location || filter.type || filter.company || filter.page)) {
            const result = await fetchPaginatedJobs(filter);
            return result.jobs;
        }
        const result = await db.jobs.findMany({
            orderBy: { id: "desc" },
        });
        return JSON.parse(JSON.stringify(result));
    }
    catch {
        return null;
    }
}

export async function fetchJobApplicationsForCandidate(candidateId: string) {
    const result = await db.application.findMany({ where: { candidateId } });
    return JSON.parse(JSON.stringify(result));
}

export async function fetchJobApplicationsForRecruiter(recruiterID: string) {
    const result = await db.application.findMany({ where: { recruiterId: recruiterID } });
    return JSON.parse(JSON.stringify(result));
}

export async function createFilterCategoriesAction (){
    const result = await db.jobs.findMany({});
    return JSON.parse(JSON.stringify(result));
}

export async function fetchRecruiterDashboardStats(recruiterId: string) {
    try {
        const [jobs, allApplications] = await Promise.all([
            db.jobs.findMany({ where: { recruiterId }, orderBy: { id: "desc" } }),
            db.application.findMany({
                where: { recruiterId },
                orderBy: { jobApplicationDate: "desc" },
            }),
        ]);

        const jobMap = new Map(jobs.map((j) => [j.id, j]));
        const enrichedApplications = allApplications.slice(0, 10).map((app) => ({
            ...app,
            job: jobMap.get(app.jobId) || null,
        }));

        const jobApplicantCounts = new Map<string, number>();
        allApplications.forEach((a) => {
            jobApplicantCounts.set(a.jobId, (jobApplicantCounts.get(a.jobId) || 0) + 1);
        });

        const postedJobs = jobs.slice(0, 4).map((j) => ({
            ...j,
            applicantCount: jobApplicantCounts.get(j.id) || 0,
        }));

        const totalJobs = jobs.length;
        const totalApplications = allApplications.length;
        const selected = allApplications.filter(a => a.status.includes("Selected")).length;
        const rejected = allApplications.filter(a => a.status.includes("Rejected")).length;
        const pending  = allApplications.filter(
            a => !a.status.includes("Selected") && !a.status.includes("Rejected")
        ).length;

        return JSON.parse(JSON.stringify({
            totalJobs,
            totalApplications,
            selected,
            rejected,
            pending,
            recentApplications: enrichedApplications,
            postedJobs,
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

        const jobIds = [...new Set(applications.map((a) => a.jobId))];
        const jobs = await db.jobs.findMany({
            where: { id: { in: jobIds } },
            select: {
                id: true,
                title: true,
                companyName: true,
                location: true,
                type: true,
            },
        });
        const jobMap = new Map(jobs.map((j) => [j.id, j]));

        const enrichedApplications = applications.map((app) => ({
            ...app,
            job: jobMap.get(app.jobId) || null,
        }));

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
            recentApplications: enrichedApplications,
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

export async function fetchEnrichedApplicantsForRecruiter(recruiterId: string) {
    try {
        const [applications, jobs] = await Promise.all([
            db.application.findMany({
                where: { recruiterId },
                orderBy: { jobApplicationDate: "desc" },
            }),
            db.jobs.findMany({
                where: { recruiterId },
                select: { id: true, title: true, companyName: true, location: true, type: true },
            }),
        ]);

        const candidateIds = [...new Set(applications.map((a) => a.candidateId))];
        const candidates = await db.user.findMany({
            where: { id: { in: candidateIds } },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                candidateInfo: true,
            },
        });

        const jobMap = new Map(jobs.map((j) => [j.id, j]));
        const candidateMap = new Map(candidates.map((c) => [c.id, c]));

        const enriched = applications.map((app) => {
            const job = jobMap.get(app.jobId) || null;
            const candidate = candidateMap.get(app.candidateId) || null;
            return {
                ...app,
                job,
                candidate,
            };
        });

        return JSON.parse(JSON.stringify(enriched));
    } catch (err) {
        console.error("Error fetching enriched applicants:", err);
        return [];
    }
}

export async function fetchCandidatesForTalentPool() {
    try {
        const users = await db.user.findMany({
            where: { role: "Candidate" },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                candidateInfo: true,
            },
            orderBy: { id: "desc" },
        });

        const candidates = users.filter(
            (u) => u.candidateInfo !== null && typeof u.candidateInfo === "object"
        );

        return JSON.parse(JSON.stringify(candidates));
    } catch (err) {
        console.error("Error fetching talent pool candidates:", err);
        return [];
    }
}