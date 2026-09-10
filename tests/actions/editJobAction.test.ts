import { describe, it, expect, vi, beforeEach } from "vitest";
import { editJobAction } from "actions/editJobAction";
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

describe("editJobAction", () => {
  const recruiterUser = {
    id: "rec_owner_1",
    name: "Recruiter Owner",
    email: "owner@hirehub.io",
    role: "Recruiter",
  };

  const editPayload = {
    id: "job_edit_123",
    companyName: "Acme Corp Revised",
    title: "Staff Platform Engineer",
    type: "Full-Time",
    location: "Hybrid (NYC)",
    experience: "5+ years",
    description: "Leading cloud platform and developer productivity initiatives.",
    skills: "Kubernetes, Go, TypeScript, Next.js",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns Unauthorised when user is not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const result = await editJobAction(editPayload, "/jobs");
    expect(result).toEqual({ error: "Unauthorised" });
  });

  it("returns Unauthorised when user is a Candidate", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "cand_1", role: "Candidate" },
      expires: "1",
    } as any);

    const result = await editJobAction(editPayload, "/jobs");
    expect(result).toEqual({ error: "Unauthorised" });
  });

  it("returns error if target job is not found", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: recruiterUser,
      expires: "1",
    } as any);

    vi.mocked(db.jobs.findUnique).mockResolvedValue(null);

    const result = await editJobAction(editPayload, "/jobs");
    expect(result).toEqual({ error: "Job not found" });
    expect(db.jobs.update).not.toHaveBeenCalled();
  });

  it("prevents editing if authenticated recruiter does not own the job posting", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: recruiterUser,
      expires: "1",
    } as any);

    vi.mocked(db.jobs.findUnique).mockResolvedValue({
      id: editPayload.id,
      recruiterId: "different_recruiter_id",
    } as any);

    const result = await editJobAction(editPayload, "/jobs");
    expect(result).toEqual({ error: "You are not authorized to edit this job posting" });
    expect(db.jobs.update).not.toHaveBeenCalled();
  });

  it("successfully updates job details when called by the authorized owner", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: recruiterUser,
      expires: "1",
    } as any);

    vi.mocked(db.jobs.findUnique).mockResolvedValue({
      id: editPayload.id,
      recruiterId: recruiterUser.id,
    } as any);

    vi.mocked(db.jobs.update).mockResolvedValue({ id: editPayload.id } as any);

    const result = await editJobAction(editPayload, "/jobs");
    expect(result).toEqual({ success: true });
    expect(db.jobs.update).toHaveBeenCalledWith({
      where: { id: editPayload.id },
      data: {
        companyName: editPayload.companyName,
        title: editPayload.title,
        type: editPayload.type,
        location: editPayload.location,
        experience: editPayload.experience,
        description: editPayload.description,
        skills: editPayload.skills,
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/jobs");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(revalidatePath).toHaveBeenCalledWith("/companies");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });
});

