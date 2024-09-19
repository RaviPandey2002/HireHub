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