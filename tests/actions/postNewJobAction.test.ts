import { describe, it, expect, vi, beforeEach } from "vitest";
import { postNewJobAction } from "actions/postNewJobAction";
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
    },
    jobs: {
      count: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("postNewJobAction", () => {
  const recruiterUser = {
    id: "rec_123",
    name: "Recruiter Alice",
    email: "alice@acme.com",
    role: "Recruiter",
  };

  const validJobPayload = {
    companyName: "Acme Corp",
    title: "Senior Full-Stack Engineer",
    type: "Full-Time",
    location: "Remote",
    experience: "3-5 years",
    description: "We are seeking a senior engineer proficient in Next.js and TypeScript.",
    skills: "React, Node.js, TypeScript, PostgreSQL",
    recruiterId: "rec_123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns Unauthorised when user is not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const result = await postNewJobAction(validJobPayload, "/jobs");
    expect(result).toEqual({ error: "Unauthorised" });
  });

  it("returns Unauthorised when user role is not Recruiter", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "cand_1", role: "Candidate" },
      expires: "1",
    } as any);

    const result = await postNewJobAction(validJobPayload, "/jobs");
    expect(result).toEqual({ error: "Unauthorised" });
  });

  it("rejects when payload recruiterId does not match session user", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: recruiterUser,
      expires: "1",
    } as any);

    const spoofed = { ...validJobPayload, recruiterId: "other_recruiter" };
    const result = await postNewJobAction(spoofed, "/jobs");
    expect(result).toEqual({ error: "Unauthorised" });
  });

  it("enforces freemium quota: restricts free recruiter when job count >= 2", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: recruiterUser,
      expires: "1",
    } as any);

    vi.mocked(db.user.findUnique).mockResolvedValue({ isPremiumUser: false } as any);
    vi.mocked(db.jobs.count).mockResolvedValue(2);

    const result = await postNewJobAction(validJobPayload, "/jobs");
    expect(result.error).toContain("Free accounts are limited to 2 job postings");
    expect(db.jobs.create).not.toHaveBeenCalled();
  });

  it("allows premium recruiter to post jobs beyond quota", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: recruiterUser,
      expires: "1",
    } as any);

    vi.mocked(db.user.findUnique).mockResolvedValue({ isPremiumUser: true } as any);
    vi.mocked(db.jobs.create).mockResolvedValue({ id: "job_999" } as any);

    const result = await postNewJobAction(validJobPayload, "/jobs");
    expect(result).toEqual({ success: true });
    expect(db.jobs.create).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/jobs");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(revalidatePath).toHaveBeenCalledWith("/companies");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });
});

