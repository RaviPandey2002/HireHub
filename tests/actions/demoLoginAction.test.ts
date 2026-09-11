import { describe, it, expect, vi, beforeEach } from "vitest";
import { demoLoginAction } from "actions/demoLoginAction";
import { toggleDemoPremiumAction } from "actions/toggleDemoPremiumAction";
import { auth, signIn, unstable_update } from "auth";
import { db } from "lib/db";
import { AuthError } from "next-auth";
import * as demoSandboxService from "lib/demoSandboxService";

vi.mock("auth", () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  unstable_update: vi.fn(),
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

vi.mock("lib/demoSandboxService", () => ({
  createDemoRecruiterSession: vi.fn(),
  createDemoCandidateSession: vi.fn(),
}));

describe("demoLoginAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid role with error message", async () => {
    const result = await demoLoginAction("InvalidRole" as any);
    expect(result).toEqual({ error: "Invalid demo role selected." });
  });

  it("successfully creates a recruiter sandbox and signs in", async () => {
    vi.mocked(demoSandboxService.createDemoRecruiterSession).mockResolvedValue({
      email: "demo_recruiter_123@hirehub.demo",
      password: "DemoPassword123!",
    });

    vi.mocked(signIn).mockResolvedValue({} as any);

    const result = await demoLoginAction("Recruiter");

    expect(demoSandboxService.createDemoRecruiterSession).toHaveBeenCalled();
    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "demo_recruiter_123@hirehub.demo",
      password: "DemoPassword123!",
      redirect: false,
    });
    expect(result).toEqual({
      success: "Welcome to the Recruiter demo!",
      role: "Recruiter",
      email: "demo_recruiter_123@hirehub.demo",
    });
  });

  it("successfully creates a candidate sandbox and signs in", async () => {
    vi.mocked(demoSandboxService.createDemoCandidateSession).mockResolvedValue({
      email: "demo_candidate_123@hirehub.demo",
      password: "DemoPassword123!",
    });

    vi.mocked(signIn).mockResolvedValue({} as any);

    const result = await demoLoginAction("Candidate");

    expect(demoSandboxService.createDemoCandidateSession).toHaveBeenCalled();
    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "demo_candidate_123@hirehub.demo",
      password: "DemoPassword123!",
      redirect: false,
    });
    expect(result).toEqual({
      success: "Welcome to the Candidate demo!",
      role: "Candidate",
      email: "demo_candidate_123@hirehub.demo",
    });
  });

  it("handles AuthError when signIn fails", async () => {
    vi.mocked(demoSandboxService.createDemoRecruiterSession).mockResolvedValue({
      email: "demo_recruiter_123@hirehub.demo",
      password: "DemoPassword123!",
    });

    const error = new AuthError("CredentialsSignin");
    vi.mocked(signIn).mockRejectedValue(error);

    const result = await demoLoginAction("Recruiter");
    expect(result).toEqual({ error: "Failed to sign into demo session." });
  });

  it("handles unexpected errors during sandbox creation", async () => {
    vi.mocked(demoSandboxService.createDemoRecruiterSession).mockRejectedValue(
      new Error("Database connection timeout")
    );

    const result = await demoLoginAction("Recruiter");
    expect(result).toEqual({
      error: "Failed to initialize demo sandbox. Please try again.",
    });
  });
});

describe("toggleDemoPremiumAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns Unauthorised when user is not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const result = await toggleDemoPremiumAction();
    expect(result).toEqual({ error: "Unauthorised" });
  });

  it("returns error when authenticated user is not a demo account", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: {
        id: "usr_real",
        email: "real_user@example.com",
        isPremiumUser: false,
      },
      expires: "1",
    } as any);

    const result = await toggleDemoPremiumAction();
    expect(result).toEqual({
      error: "Demo premium toggle is only available for demo sessions.",
    });
  });

  it("upgrades demo user to enterprise tier when currently free tier", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: {
        id: "demo_rec_1",
        email: "demo_recruiter_abc@hirehub.demo",
        isPremiumUser: false,
        memberShipType: null,
      },
      expires: "1",
    } as any);

    vi.mocked(db.user.findUnique).mockResolvedValue({ isPremiumUser: false } as any);
    vi.mocked(db.user.update).mockResolvedValue({} as any);

    const result = await toggleDemoPremiumAction();

    expect(db.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "demo_rec_1" },
        data: expect.objectContaining({
          isPremiumUser: true,
          memberShipType: "enterprise",
        }),
      })
    );

    expect(unstable_update).toHaveBeenCalledWith({
      user: expect.objectContaining({
        id: "demo_rec_1",
        isPremiumUser: true,
        memberShipType: "enterprise",
      }),
    });

    expect(result).toEqual({
      success: true,
      isPremiumUser: true,
      message: "Unlocked Enterprise Tier! Unlimited job postings & applications active.",
    });
  });

  it("reverts demo user to free tier when currently enterprise tier", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: {
        id: "demo_rec_1",
        email: "demo_recruiter_abc@hirehub.demo",
        isPremiumUser: true,
        memberShipType: "enterprise",
      },
      expires: "1",
    } as any);

    vi.mocked(db.user.findUnique).mockResolvedValue({ isPremiumUser: true } as any);
    vi.mocked(db.user.update).mockResolvedValue({} as any);

    const result = await toggleDemoPremiumAction();

    expect(db.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "demo_rec_1" },
        data: expect.objectContaining({
          isPremiumUser: false,
          memberShipType: null,
        }),
      })
    );

    expect(unstable_update).toHaveBeenCalledWith({
      user: expect.objectContaining({
        id: "demo_rec_1",
        isPremiumUser: false,
        memberShipType: undefined,
      }),
    });

    expect(result).toEqual({
      success: true,
      isPremiumUser: false,
      message: "Reverted to Free Tier. Standard quota limits (max 2) are now active.",
    });
  });
});
