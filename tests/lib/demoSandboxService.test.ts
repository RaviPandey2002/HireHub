import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ensureGlobalBaselineJobs,
  cleanupExpiredDemoAccounts,
  createDemoRecruiterSession,
  createDemoCandidateSession,
} from "lib/demoSandboxService";
import { db } from "lib/db";
import bcrypt from "bcryptjs";

vi.mock("lib/db", () => ({
  db: {
    jobs: {
      count: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    user: {
      upsert: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    application: {
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_secret_123"),
  },
}));

describe("demoSandboxService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ensureGlobalBaselineJobs", () => {
    it("skips seeding if baseline jobs already exist in the database", async () => {
      vi.mocked(db.jobs.count).mockResolvedValue(12);

      await ensureGlobalBaselineJobs();

      expect(db.jobs.count).toHaveBeenCalled();
      expect(db.user.upsert).not.toHaveBeenCalled();
      expect(db.jobs.create).not.toHaveBeenCalled();
    });

    it("seeds missing baseline jobs when database job count is below threshold", async () => {
      vi.mocked(db.jobs.count).mockResolvedValue(0);
      vi.mocked(db.user.upsert).mockResolvedValue({
        id: "sys_rec_1",
        email: "system.recruiter@hirehub.io",
      } as any);
      vi.mocked(db.jobs.findFirst).mockResolvedValue(null);
      vi.mocked(db.jobs.create).mockResolvedValue({ id: "job_created" } as any);

      await ensureGlobalBaselineJobs();

      expect(db.jobs.count).toHaveBeenCalled();
      expect(db.user.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: "system.recruiter@hirehub.io" },
        })
      );
      expect(db.jobs.create).toHaveBeenCalled();
    });
  });

  describe("cleanupExpiredDemoAccounts", () => {
    it("deletes demo accounts older than 24 hours and cascades related records", async () => {
      const now = Date.now();
      const expiredTimestamp = now - 25 * 60 * 60 * 1000; // 25 hours ago
      const recentTimestamp = now - 1 * 60 * 60 * 1000; // 1 hour ago

      vi.mocked(db.user.findMany).mockResolvedValue([
        {
          id: "exp_1",
          email: `demo_recruiter_${expiredTimestamp}_abc123@hirehub.demo`,
        },
        {
          id: "active_1",
          email: `demo_candidate_${recentTimestamp}_xyz789@hirehub.demo`,
        },
      ] as any);

      vi.mocked(db.application.deleteMany).mockResolvedValue({ count: 2 } as any);
      vi.mocked(db.jobs.deleteMany).mockResolvedValue({ count: 1 } as any);
      vi.mocked(db.user.deleteMany).mockResolvedValue({ count: 1 } as any);

      await cleanupExpiredDemoAccounts();

      expect(db.application.deleteMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { recruiterId: { in: ["exp_1"] } },
            { candidateId: { in: ["exp_1"] } },
          ],
        },
      });
      expect(db.jobs.deleteMany).toHaveBeenCalledWith({
        where: { recruiterId: { in: ["exp_1"] } },
      });
      expect(db.user.deleteMany).toHaveBeenCalledWith({
        where: { id: { in: ["exp_1"] } },
      });
    });

    it("does nothing when no demo accounts are expired", async () => {
      const now = Date.now();
      const recentTimestamp = now - 2 * 60 * 60 * 1000;

      vi.mocked(db.user.findMany).mockResolvedValue([
        {
          id: "active_1",
          email: `demo_recruiter_${recentTimestamp}_xyz@hirehub.demo`,
        },
      ] as any);

      await cleanupExpiredDemoAccounts();

      expect(db.application.deleteMany).not.toHaveBeenCalled();
      expect(db.jobs.deleteMany).not.toHaveBeenCalled();
      expect(db.user.deleteMany).not.toHaveBeenCalled();
    });
  });

  describe("createDemoRecruiterSession", () => {
    it("provisions an isolated recruiter sandbox with private jobs and applicants", async () => {
      vi.mocked(db.user.findMany).mockResolvedValue([]);
      vi.mocked(db.jobs.count).mockResolvedValue(12);

      (db.user.create as any).mockImplementation(async ({ data }: any) => {
        return {
          id: `usr_${Math.random().toString(36).substring(7)}`,
          ...data,
        };
      });

      (db.jobs.create as any).mockImplementation(async ({ data }: any) => {
        return {
          id: `job_${Math.random().toString(36).substring(7)}`,
          ...data,
        };
      });

      vi.mocked(db.application.create).mockResolvedValue({ id: "app_1" } as any);

      const session = await createDemoRecruiterSession();

      expect(session.email).toMatch(/^demo_recruiter_\d+_[a-z0-9]+@hirehub\.demo$/);
      expect(session.password).toBe("demo_password_123");
      expect(db.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            role: "Recruiter",
            isPremiumUser: false,
          }),
        })
      );
      expect(db.jobs.create).toHaveBeenCalled();
      expect(db.application.create).toHaveBeenCalled();
    });
  });

  describe("createDemoCandidateSession", () => {
    it("provisions an isolated candidate sandbox with profile, 1 application, and 1 saved job", async () => {
      vi.mocked(db.user.findMany).mockResolvedValue([]);
      vi.mocked(db.jobs.count).mockResolvedValue(12);

      const validRecruiterId = "507f1f77bcf86cd799439011";
      vi.mocked(db.jobs.findMany).mockResolvedValue([
        { id: "job_base_1", recruiterId: validRecruiterId },
        { id: "job_base_2", recruiterId: validRecruiterId },
      ] as any);

      (db.user.create as any).mockImplementation(async ({ data }: any) => {
        return {
          id: `cand_${Math.random().toString(36).substring(7)}`,
          ...data,
        };
      });

      vi.mocked(db.application.create).mockResolvedValue({ id: "app_cand_1" } as any);

      const session = await createDemoCandidateSession();

      expect(session.email).toMatch(/^demo_candidate_\d+_[a-z0-9]+@hirehub\.demo$/);
      expect(session.password).toBe("demo_password_123");
      expect(db.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            role: "Candidate",
            isPremiumUser: false,
          }),
        })
      );
      expect(db.application.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            jobId: "job_base_1",
            recruiterId: validRecruiterId,
          }),
        })
      );
    });
  });
});
