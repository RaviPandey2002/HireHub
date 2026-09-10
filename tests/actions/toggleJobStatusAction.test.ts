import { describe, it, expect, vi, beforeEach } from "vitest";
import { toggleJobStatusAction } from "actions/toggleJobStatusAction";
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
      update: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("toggleJobStatusAction", () => {
  const recruiter = {
    id: "rec_1",
    role: "Recruiter",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns Unauthorised when user is not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const result = await toggleJobStatusAction({ jobId: "job_1", status: "Closed" });
    expect(result).toEqual({ error: "Unauthorised" });
  });

  it("returns error when job is not found", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: recruiter,
      expires: "1",
    } as any);

    vi.mocked(db.jobs.findUnique).mockResolvedValue(null);

    const result = await toggleJobStatusAction({ jobId: "job_1", status: "Closed" });
    expect(result).toEqual({ error: "Job opening not found" });
  });

  it("returns error when recruiter does not own the job", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: recruiter,
      expires: "1",
    } as any);

    vi.mocked(db.jobs.findUnique).mockResolvedValue({
      id: "job_1",
      recruiterId: "someone_else",
      status: "Active",
    } as any);

    const result = await toggleJobStatusAction({ jobId: "job_1", status: "Closed" });
    expect(result).toEqual({ error: "You are not authorized to modify this job" });
  });

  it("successfully updates job status and revalidates paths", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: recruiter,
      expires: "1",
    } as any);

    vi.mocked(db.jobs.findUnique).mockResolvedValue({
      id: "job_1",
      recruiterId: recruiter.id,
      status: "Active",
    } as any);

    vi.mocked(db.jobs.update).mockResolvedValue({ id: "job_1" } as any);

    const result = await toggleJobStatusAction({ jobId: "job_1", status: "Closed" }, "/jobs");
    expect(result).toEqual({ success: true, status: "Closed" });
    expect(db.jobs.update).toHaveBeenCalledWith({
      where: { id: "job_1" },
      data: { status: "Closed" },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/jobs");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
  });
});

