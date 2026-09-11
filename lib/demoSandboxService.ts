import { db } from "lib/db";
import bcrypt from "bcryptjs";
import { baselineSampleJobs, mockRecruiterJobs, mockCandidatesForRecruiter } from "./sampleData";

const DEMO_PASSWORD = "demo_password_123";
const SYSTEM_RECRUITER_EMAIL = "system.recruiter@hirehub.io";
const DEMO_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const isValidObjectId = (id?: string | null): boolean =>
  typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);

let baselineJobsPromise: Promise<void> | null = null;

/**
 * Ensures a global catalog of verified engineering jobs exists.
 * If 0 jobs exist in the database, this idempotently seeds the baseline roles.
 * Includes concurrency deduplication to prevent duplicate seeding during simultaneous calls.
 */
export async function ensureGlobalBaselineJobs(force = false): Promise<void> {
  if (baselineJobsPromise && !force) {
    return baselineJobsPromise;
  }

  const execution = (async () => {
    const existingJobCount = await db.jobs.count();
    if (!force && existingJobCount >= baselineSampleJobs.length) {
      return;
    }

    // Ensure system recruiter exists to anchor baseline jobs
    const systemHashedPassword = await bcrypt.hash("system_secure_pass", 10);
    const systemRecruiter = await db.user.upsert({
      where: { email: SYSTEM_RECRUITER_EMAIL },
      update: {},
      create: {
        email: SYSTEM_RECRUITER_EMAIL,
        name: "HireHub System",
        role: "Recruiter",
        password: systemHashedPassword,
        isPremiumUser: true,
        recruiterInfo: {
          name: "HireHub Talent System",
          companyName: "HireHub Partner Network",
          companyRole: "Automated Requisitions",
        },
      },
    });

    for (const jobConfig of baselineSampleJobs) {
      const existing = await db.jobs.findFirst({
        where: {
          companyName: jobConfig.companyName,
          title: jobConfig.title,
        },
      });

      if (!existing) {
        await db.jobs.create({
          data: {
            ...jobConfig,
            recruiterId: systemRecruiter.id,
          },
        });
      }
    }
  })();

  if (!force) {
    baselineJobsPromise = execution;
  }

  try {
    await execution;
  } finally {
    if (!force) {
      baselineJobsPromise = null;
    }
  }
}

/**
 * Background garbage collection: purges demo users and their orphaned
 * jobs/applications that are older than 24 hours.
 */
export async function cleanupExpiredDemoAccounts(): Promise<void> {
  try {
    const demoUsers = await db.user.findMany({
      where: {
        email: { contains: "@hirehub.demo" },
      },
      select: { id: true, email: true },
    });

    const now = Date.now();
    const expiredUserIds: string[] = [];

    for (const user of demoUsers) {
      if (!user.email) continue;
      // Extract timestamp from pattern: demo_[role]_[timestamp]_[uuid]@hirehub.demo
      const parts = user.email.split("@")[0].split("_");
      const timestamp = Number(parts[2]);
      if (!isNaN(timestamp) && now - timestamp > DEMO_TTL_MS) {
        expiredUserIds.push(user.id);
      }
    }

    if (expiredUserIds.length > 0) {
      // Cascade delete applications and jobs
      await db.application.deleteMany({
        where: {
          OR: [
            { recruiterId: { in: expiredUserIds } },
            { candidateId: { in: expiredUserIds } },
          ],
        },
      });
      await db.jobs.deleteMany({
        where: { recruiterId: { in: expiredUserIds } },
      });
      await db.user.deleteMany({
        where: { id: { in: expiredUserIds } },
      });
    }
  } catch (err) {
    console.error("Non-blocking demo cleanup error:", err);
  }
}

/**
 * Provisions a completely isolated sandbox for a Demo Recruiter.
 * - Private demo recruiter user (Stripe)
 * - 2 active job listings (leaves 1 quota slot open for free tier testing)
 * - 3 applicant submissions in various states (Applied, Selected, Rejected)
 */
export async function createDemoRecruiterSession(): Promise<{
  email: string;
  password: string;
}> {
  // Fire background cleanup without blocking the user
  cleanupExpiredDemoAccounts().catch(() => {});

  const uuid = Math.random().toString(36).substring(2, 9);
  const timestamp = Date.now();
  const email = `demo_recruiter_${timestamp}_${uuid}@hirehub.demo`;
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  const demoRecruiter = await db.user.create({
    data: {
      name: "Sarah Recruiter",
      email,
      password: hashedPassword,
      role: "Recruiter",
      isPremiumUser: false, // Start on Free Tier to test quotas
      recruiterInfo: {
        name: "Sarah Recruiter",
        companyName: "Stripe",
        companyRole: "Head of Tech Recruiting",
      },
    },
  });

  // Create private jobs for this demo recruiter
  const createdJobs = [];
  for (const jobConfig of mockRecruiterJobs) {
    const job = await db.jobs.create({
      data: {
        ...jobConfig,
        recruiterId: demoRecruiter.id,
      },
    });
    createdJobs.push(job);
  }

  // Create mock applicants and applications attached to this recruiter's jobs
  for (let i = 0; i < mockCandidatesForRecruiter.length; i++) {
    const candidateData = mockCandidatesForRecruiter[i];
    const targetJob = createdJobs[i % createdJobs.length];

    // Ephemeral mock candidate profile (timestamped for 24h garbage collection)
    const mockCandidate = await db.user.create({
      data: {
        name: candidateData.name,
        email: `demo_mock_${timestamp}_${uuid}_${i}@hirehub.demo`,
        role: "Candidate",
        candidateInfo: {
          name: candidateData.name,
          currentCompany: candidateData.company,
          skills: candidateData.skills,
          totalExperience: candidateData.experience,
          collage: candidateData.college,
          resume: candidateData.resume,
        },
      },
    });

    await db.application.create({
      data: {
        recruiterId: demoRecruiter.id,
        candidateId: mockCandidate.id,
        jobId: targetJob.id,
        name: candidateData.name,
        email: candidateData.email,
        status: candidateData.status,
        jobApplicationDate: new Date(Date.now() - (i + 1) * 3600000), // recent hours
      },
    });
  }

  // Ensure baseline jobs exist for talent directory / companies view
  await ensureGlobalBaselineJobs().catch(() => {});

  return { email, password: DEMO_PASSWORD };
}

/**
 * Provisions a completely isolated sandbox for a Demo Candidate.
 * - Private candidate user with verified skills & resume
 * - Pre-seeded with 1 application (leaving 1 quota slot open on free tier)
 * - Pre-seeded with 1 bookmarked role
 */
export async function createDemoCandidateSession(): Promise<{
  email: string;
  password: string;
}> {
  cleanupExpiredDemoAccounts().catch(() => {});
  await ensureGlobalBaselineJobs().catch(() => {});

  const uuid = Math.random().toString(36).substring(2, 9);
  const timestamp = Date.now();
  const email = `demo_candidate_${timestamp}_${uuid}@hirehub.demo`;
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

  // Fetch 2 baseline jobs to link initial application & bookmark
  const baselineJobs = await db.jobs.findMany({
    take: 2,
    orderBy: { id: "desc" },
  });

  const savedJobId = baselineJobs[1]?.id ? [baselineJobs[1].id] : [];

  const demoCandidate = await db.user.create({
    data: {
      name: "Alex Candidate",
      email,
      password: hashedPassword,
      role: "Candidate",
      isPremiumUser: false, // Free tier: 2 application limit
      candidateInfo: {
        name: "Alex Candidate",
        currentCompany: "TechCorp Inc.",
        currentJobLocation: "San Francisco, CA",
        preferedJobLocation: "Remote / San Francisco",
        currentSalary: "12 LPA",
        noticePeriod: "30 days",
        skills: "React, TypeScript, Next.js, Node.js, Tailwind CSS, PostgreSQL",
        previousCompanies: "StartupXYZ, WebAgency",
        totalExperience: "3 years",
        collage: "UC Berkeley",
        collageLocation: "Berkeley, CA",
        graduatedYear: "2022",
        linkedinProfile: "https://linkedin.com/in/alexcandidate",
        githubProfile: "https://github.com/alexcandidate",
        resume: "public/demo_resume.pdf",
        savedJobs: savedJobId,
      },
    },
  });

  // Seed 1 active application (leaving 1 quota slot free!)
  const targetJob = baselineJobs[0];
  if (targetJob && isValidObjectId(targetJob.recruiterId)) {
    await db.application.create({
      data: {
        candidateId: demoCandidate.id,
        recruiterId: targetJob.recruiterId,
        jobId: targetJob.id,
        name: "Alex Candidate",
        email: demoCandidate.email!,
        status: ["Applied"],
        jobApplicationDate: new Date(),
      },
    });
  }

  return { email, password: DEMO_PASSWORD };
}
