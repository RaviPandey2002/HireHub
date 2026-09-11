import { describe, it, expect, vi, beforeEach } from "vitest";
import { getResumeUrlAction } from "actions/getResumeUrlAction";
import { auth } from "auth";
import { db } from "lib/db";
import supabaseClient from "lib/supabaseClient";

vi.mock("auth", () => ({
  auth: vi.fn(),
}));

vi.mock("lib/db", () => ({
  db: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("lib/supabaseClient", () => ({
  default: {
    storage: {
      from: vi.fn(() => ({
        createSignedUrl: vi.fn(),
      })),
    },
  },
}));

describe("getResumeUrlAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://validproject.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "valid-anon-key-123";
  });

  it("returns error when user is unauthenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const result = await getResumeUrlAction("cand_123");
    expect(result).toEqual({ error: "You must be signed in to access resumes." });
  });

  it("returns error when target candidate is not found", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "rec_1", role: "Recruiter", email: "recruiter@test.com" },
      expires: "1",
    } as any);

    vi.mocked(db.user.findUnique).mockResolvedValue(null);

    const result = await getResumeUrlAction("cand_missing");
    expect(result).toEqual({ error: "Candidate not found." });
  });

  it("returns Unauthorized when another candidate attempts to view the resume", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "cand_other", role: "Candidate", email: "other@test.com" },
      expires: "1",
    } as any);

    vi.mocked(db.user.findUnique).mockResolvedValue({
      id: "cand_target",
      email: "target@test.com",
      candidateInfo: { resume: "public/resumes/my_resume.pdf" },
    } as any);

    const result = await getResumeUrlAction("cand_target");
    expect(result).toEqual({ error: "Unauthorized to access this resume." });
  });

  it("seamlessly provides dynamic preview URL for demo recruiter sessions", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: {
        id: "demo_rec_1",
        role: "Recruiter",
        email: "demo_recruiter_123@hirehub.demo",
      },
      expires: "1",
    } as any);

    vi.mocked(db.user.findUnique).mockResolvedValue({
      id: "demo_cand_1",
      email: "demo_candidate_123@hirehub.demo",
      candidateInfo: {
        name: "Alex Candidate",
        resume: "public/demo_resume.pdf",
      },
    } as any);

    const result = await getResumeUrlAction("demo_cand_1");
    expect(result).toEqual({
      success: true,
      url: "/api/resume/preview?candidateId=demo_cand_1",
    });
  });

  it("gracefully falls back to dynamic preview when Supabase returns object not found", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "rec_1", role: "Recruiter", email: "recruiter@real.com" },
      expires: "1",
    } as any);

    vi.mocked(db.user.findUnique).mockResolvedValue({
      id: "cand_real",
      email: "candidate@real.com",
      candidateInfo: {
        name: "John Doe",
        resume: "public/cand_real/resume.pdf",
      },
    } as any);

    const createSignedUrlMock = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Object not found" },
    });

    vi.mocked(supabaseClient.storage.from).mockReturnValue({
      createSignedUrl: createSignedUrlMock,
    } as any);

    const result = await getResumeUrlAction("cand_real");
    expect(result).toEqual({
      success: true,
      url: "/api/resume/preview?candidateId=cand_real",
    });
  });

  it("returns Supabase signed URL when file exists in Supabase storage", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "rec_1", role: "Recruiter", email: "recruiter@real.com" },
      expires: "1",
    } as any);

    vi.mocked(db.user.findUnique).mockResolvedValue({
      id: "cand_real",
      email: "candidate@real.com",
      candidateInfo: {
        name: "John Doe",
        resume: "public/cand_real/resume.pdf",
      },
    } as any);

    const createSignedUrlMock = vi.fn().mockResolvedValue({
      data: { signedUrl: "https://validproject.supabase.co/signed/resume.pdf" },
      error: null,
    });

    vi.mocked(supabaseClient.storage.from).mockReturnValue({
      createSignedUrl: createSignedUrlMock,
    } as any);

    const result = await getResumeUrlAction("cand_real");
    expect(result).toEqual({
      success: true,
      url: "https://validproject.supabase.co/signed/resume.pdf",
    });
  });
});

