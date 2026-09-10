import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteJobAction } from "actions/deleteJobAction";
import { auth } from "auth";
import { db } from "lib/db";
import { revalidatePath } from "next/cache";

vi.mock("auth", () => ({
  auth: vi.fn(),
}));

vi.mock("lib/db", () => ({
  db: {
    jobs: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    application: {
      deleteMany: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("deleteJobAction", () => {
  const recruiterUser = {
    id: "rec_owner_1",
    name: "Recruiter Owner",
    email: "owner@hirehub.io",
    role: "Recruiter",
  };

  const jobId = "job_delete_123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns Unauthorised when user is not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const result = await deleteJobAction(jobId, "/jobs");
    expect(result).toEqual({ error: "Unauthorised" });
  });

  it("returns Unauthorised when user is a Candidate", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "cand_1", role: "Candidate" },
      expires: "1",
    } as any);

    const result = await deleteJobAction(jobId, "/jobs");
    expect(result).toEqual({ error: "Unauthorised" });
  });

  it("returns error if target job is not found", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: recruiterUser,
      expires: "1",
    } as any);

    vi.mocked(db.jobs.findUnique).mockResolvedValue(null);

    const result = await deleteJobAction(jobId, "/jobs");
    expect(result).toEqual({ error: "Job not found" });
    expect(db.jobs.delete).not.toHaveBeenCalled();
    expect(db.application.deleteMany).not.toHaveBeenCalled();
  });

  it("prevents deletion if authenticated recruiter does not own the job posting", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: recruiterUser,
      expires: "1",
    } as any);

    vi.mocked(db.jobs.findUnique).mockResolvedValue({
      id: jobId,
      recruiterId: "different_recruiter_id",
    } as any);

    const result = await deleteJobAction(jobId, "/jobs");
    expect(result).toEqual({ error: "Unauthorised" });
    expect(db.jobs.delete).not.toHaveBeenCalled();
    expect(db.application.deleteMany).not.toHaveBeenCalled();
  });

  it("cascades deletion of applications and deletes job when authorized", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: recruiterUser,
      expires: "1",
    } as any);

    vi.mocked(db.jobs.findUnique).mockResolvedValue({
      id: jobId,
      recruiterId: recruiterUser.id,
    } as any);

    vi.mocked(db.application.deleteMany).mockResolvedValue({ count: 3 } as any);
    vi.mocked(db.jobs.delete).mockResolvedValue({ id: jobId } as any);

    const result = await deleteJobAction(jobId, "/jobs");
    expect(result).toEqual({ success: true });
    expect(db.application.deleteMany).toHaveBeenCalledWith({ where: { jobId } });
    expect(db.jobs.delete).toHaveBeenCalledWith({ where: { id: jobId } });
    expect(revalidatePath).toHaveBeenCalledWith("/jobs");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(revalidatePath).toHaveBeenCalledWith("/companies");
    expect(revalidatePath).toHaveBeenCalledWith("/activity");
  });

  it("handles database error gracefully", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: recruiterUser,
      expires: "1",
    } as any);

    vi.mocked(db.jobs.findUnique).mockRejectedValue(new Error("DB connection failure"));

    const result = await deleteJobAction(jobId, "/jobs");
    expect(result).toEqual({ error: "Failed to delete job. Please try again." });
  });
});
