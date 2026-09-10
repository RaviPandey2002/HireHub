import { describe, it, expect, vi, beforeEach } from "vitest";
import CreateJobApplicationAction from "actions/createJobApplicationAction";
import { auth } from "auth";
import { db } from "lib/db";
import { revalidatePath } from "next/cache";
import { sendApplicationSubmittedEmail } from "lib/email";

vi.mock("auth", () => ({
  auth: vi.fn(),
}));

vi.mock("lib/db", () => ({
  db: {
    user: {
      findUnique: vi.fn(),
    },
    jobs: {
      findUnique: vi.fn(),
    },
    application: {
      findFirst: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("lib/email", () => ({
  sendApplicationSubmittedEmail: vi.fn(),
}));

describe("createJobApplicationAction", () => {
  const candidateUser = {
    id: "user_cand_1",
    name: "Jane Doe",
    email: "jane@test.com",
    role: "Candidate",
  };

  const validPayload = {
    recruiterId: "user_rec_1",
    name: "Jane Doe",
    email: "jane@test.com",
    candidateId: "user_cand_1",
    status: ["Applied"],
    jobId: "job_123",
    jobApplicationDate: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns Unauthorised when user is not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const result = await CreateJobApplicationAction(validPayload, "/jobs");
    expect(result).toEqual({ error: "Unauthorised" });
  });

  it("returns Unauthorised when user role is not Candidate", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "rec_1", role: "Recruiter" },
      expires: "1",
    } as any);

    const result = await CreateJobApplicationAction(validPayload, "/jobs");
    expect(result).toEqual({ error: "Unauthorised" });
  });

  it("returns Unauthorised when payload candidateId doesn't match authenticated user", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: candidateUser,
      expires: "1",
    } as any);

    const spoofedPayload = { ...validPayload, candidateId: "attacker_id" };
    const result = await CreateJobApplicationAction(spoofedPayload, "/jobs");
    expect(result).toEqual({ error: "Unauthorised" });
  });

  it("prevents duplicate applications for the same job", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: candidateUser,
      expires: "1",
    } as any);

    vi.mocked(db.application.findFirst).mockResolvedValue({
      id: "existing_app",
      candidateId: candidateUser.id,
      jobId: validPayload.jobId,
    } as any);

    const result = await CreateJobApplicationAction(validPayload, "/jobs");
    expect(result).toEqual({ error: "You have already applied for this position." });
    expect(db.application.create).not.toHaveBeenCalled();
  });

  it("enforces freemium quota: restricts non-premium user when count >= 2", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: candidateUser,
      expires: "1",
    } as any);

    vi.mocked(db.application.findFirst).mockResolvedValue(null);
    vi.mocked(db.user.findUnique).mockResolvedValue({ isPremiumUser: false } as any);
    vi.mocked(db.application.count).mockResolvedValue(2);

    const result = await CreateJobApplicationAction(validPayload, "/jobs");
    expect(result.error).toContain("Free accounts can apply to max 2 jobs");
    expect(db.application.create).not.toHaveBeenCalled();
  });

  it("allows premium candidate to apply beyond 2 applications", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: candidateUser,
      expires: "1",
    } as any);

    vi.mocked(db.application.findFirst).mockResolvedValue(null);
    vi.mocked(db.user.findUnique).mockResolvedValue({ isPremiumUser: true } as any);
    vi.mocked(db.application.create).mockResolvedValue({ id: "new_app" } as any);
    vi.mocked(db.jobs.findUnique).mockResolvedValue({
      title: "Senior Engineer",
      companyName: "Acme Corp",
    } as any);

    const result = await CreateJobApplicationAction(validPayload, "/jobs");
    expect(result).toEqual({ success: true });
    expect(db.application.create).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/jobs");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(revalidatePath).toHaveBeenCalledWith("/activity");
  });
});

