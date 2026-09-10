import { describe, it, expect, vi, beforeEach } from "vitest";
import { withdrawApplicationAction } from "actions/withdrawApplicationAction";
import { auth } from "auth";
import { db } from "lib/db";
import { revalidatePath } from "next/cache";

vi.mock("auth", () => ({
  auth: vi.fn(),
}));

vi.mock("lib/db", () => ({
  db: {
    application: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("withdrawApplicationAction", () => {
  const candidateUser = {
    id: "cand_owner_1",
    name: "Candidate Owner",
    email: "candidate@hirehub.io",
    role: "Candidate",
  };

  const payload = {
    applicationId: "app_withdraw_123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns Unauthorised when user is not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const result = await withdrawApplicationAction(payload);
    expect(result).toEqual({ error: "Unauthorised" });
  });

  it("returns Unauthorised when user is a Recruiter", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "rec_1", role: "Recruiter" },
      expires: "1",
    } as any);

    const result = await withdrawApplicationAction(payload);
    expect(result).toEqual({ error: "Unauthorised" });
  });

  it("returns error on invalid application identifier payload", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: candidateUser,
      expires: "1",
    } as any);

    const result = await withdrawApplicationAction({ applicationId: "" });
    expect(result.error).toBe("Invalid application identifier");
    expect(db.application.delete).not.toHaveBeenCalled();
  });

  it("returns error if application not found", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: candidateUser,
      expires: "1",
    } as any);

    vi.mocked(db.application.findUnique).mockResolvedValue(null);

    const result = await withdrawApplicationAction(payload);
    expect(result).toEqual({ error: "Application not found or already withdrawn." });
    expect(db.application.delete).not.toHaveBeenCalled();
  });

  it("prevents candidate from withdrawing another candidate's application", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: candidateUser,
      expires: "1",
    } as any);

    vi.mocked(db.application.findUnique).mockResolvedValue({
      id: payload.applicationId,
      candidateId: "different_candidate_id",
      jobId: "job_123",
    } as any);

    const result = await withdrawApplicationAction(payload);
    expect(result).toEqual({ error: "You can only withdraw your own applications." });
    expect(db.application.delete).not.toHaveBeenCalled();
  });

  it("successfully withdraws own application and revalidates relevant paths", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: candidateUser,
      expires: "1",
    } as any);

    vi.mocked(db.application.findUnique).mockResolvedValue({
      id: payload.applicationId,
      candidateId: candidateUser.id,
      jobId: "job_123",
    } as any);

    vi.mocked(db.application.delete).mockResolvedValue({ id: payload.applicationId } as any);

    const result = await withdrawApplicationAction(payload);
    expect(result).toEqual({ success: true });
    expect(db.application.delete).toHaveBeenCalledWith({
      where: { id: payload.applicationId },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/activity");
    expect(revalidatePath).toHaveBeenCalledWith("/jobs");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(revalidatePath).toHaveBeenCalledWith("/applicants");
  });

  it("handles unexpected database error gracefully", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: candidateUser,
      expires: "1",
    } as any);

    vi.mocked(db.application.findUnique).mockRejectedValue(new Error("DB timeout"));

    const result = await withdrawApplicationAction(payload);
    expect(result).toEqual({ error: "Failed to withdraw application. Please try again." });
  });
});
