import { describe, it, expect, vi, beforeEach } from "vitest";
import { toggleSaveJobAction } from "actions/toggleSaveJobAction";
import { auth } from "auth";
import { db } from "lib/db";
import { revalidatePath } from "next/cache";

vi.mock("auth", () => ({
  auth: vi.fn(),
}));

vi.mock("lib/db", () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("toggleSaveJobAction", () => {
  const candidateUser = {
    id: "cand_user_1",
    role: "Candidate",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns Unauthorised when user is not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const result = await toggleSaveJobAction("job_1");
    expect(result).toEqual({ error: "Unauthorised" });
  });

  it("returns Unauthorised when user is a Recruiter", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "rec_1", role: "Recruiter" },
      expires: "1",
    } as any);

    const result = await toggleSaveJobAction("job_1");
    expect(result).toEqual({ error: "Unauthorised" });
  });

  it("returns error for invalid jobId", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: candidateUser,
      expires: "1",
    } as any);

    const result = await toggleSaveJobAction("");
    expect(result).toEqual({ error: "Invalid job ID" });
  });

  it("returns error when candidate profile is not found in database", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: candidateUser,
      expires: "1",
    } as any);

    vi.mocked(db.user.findUnique).mockResolvedValue(null);

    const result = await toggleSaveJobAction("job_1");
    expect(result).toEqual({ error: "User profile not found" });
    expect(db.user.update).not.toHaveBeenCalled();
  });

  it("saves an unbookmarked job and adds to candidate savedJobs array while preserving other candidateInfo fields", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: candidateUser,
      expires: "1",
    } as any);

    vi.mocked(db.user.findUnique).mockResolvedValue({
      id: candidateUser.id,
      candidateInfo: { skills: "React, Node", savedJobs: [] },
    } as any);

    vi.mocked(db.user.update).mockResolvedValue({ id: candidateUser.id } as any);

    const result = await toggleSaveJobAction("job_99");
    expect(result).toEqual({
      success: true,
      isSaved: true,
      savedCount: 1,
    });
    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: candidateUser.id },
      data: {
        candidateInfo: {
          skills: "React, Node",
          savedJobs: ["job_99"],
        },
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/jobs");
    expect(revalidatePath).toHaveBeenCalledWith("/activity");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
  });

  it("unsaves a bookmarked job when already present in savedJobs", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: candidateUser,
      expires: "1",
    } as any);

    vi.mocked(db.user.findUnique).mockResolvedValue({
      id: candidateUser.id,
      candidateInfo: { savedJobs: ["job_99", "job_100"] },
    } as any);

    vi.mocked(db.user.update).mockResolvedValue({ id: candidateUser.id } as any);

    const result = await toggleSaveJobAction("job_99");
    expect(result).toEqual({
      success: true,
      isSaved: false,
      savedCount: 1,
    });
    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: candidateUser.id },
      data: {
        candidateInfo: {
          savedJobs: ["job_100"],
        },
      },
    });
  });
});

