import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  isDemoEmail,
  sendWelcomeEmail,
  sendApplicationSubmittedEmail,
  sendApplicationStatusEmail,
} from "lib/email";
import nodemailer from "nodemailer";

vi.mock("lib/env", () => ({
  env: {
    GMAIL_USER: "hirehub.system@gmail.com",
    GMAIL_APP_PASSWORD: "app-password-123",
    NEXTAUTH_URL: "http://localhost:3000",
  },
}));

vi.mock("nodemailer", () => {
  const sendMailMock = vi.fn().mockResolvedValue({ messageId: "test-msg-id" });
  return {
    default: {
      createTransport: vi.fn().mockReturnValue({
        sendMail: sendMailMock,
      }),
    },
  };
});

describe("isDemoEmail utility", () => {
  it("identifies @hirehub.demo emails as demo", () => {
    expect(isDemoEmail("demo_candidate_123_abc@hirehub.demo")).toBe(true);
    expect(isDemoEmail("demo_recruiter_456_xyz@hirehub.demo")).toBe(true);
    expect(isDemoEmail("user@hirehub.demo")).toBe(true);
  });

  it("identifies @demo.local emails as demo", () => {
    expect(isDemoEmail("candidate@demo.local")).toBe(true);
  });

  it("identifies system recruiter email as demo", () => {
    expect(isDemoEmail("system.recruiter@hirehub.io")).toBe(true);
  });

  it("identifies .test and .demo and @test.com domains as demo", () => {
    expect(isDemoEmail("candidate@test.com")).toBe(true);
    expect(isDemoEmail("recruiter@test.com")).toBe(true);
    expect(isDemoEmail("test@example.com")).toBe(true);
    expect(isDemoEmail("someone@company.test")).toBe(true);
  });

  it("identifies null, undefined, or empty email as demo to be safe", () => {
    expect(isDemoEmail(null)).toBe(true);
    expect(isDemoEmail(undefined)).toBe(true);
    expect(isDemoEmail("")).toBe(true);
  });

  it("identifies valid real-world corporate and personal emails as real (non-demo)", () => {
    expect(isDemoEmail("sarah.connor@google.com")).toBe(false);
    expect(isDemoEmail("alex@startup.io")).toBe(false);
    expect(isDemoEmail("engineer@stripe.com")).toBe(false);
    expect(isDemoEmail("user@gmail.com")).toBe(false);
  });
});

describe("Email suppression for demo accounts", () => {
  let sendMailMock: any;

  beforeEach(() => {
    vi.clearAllMocks();
    const transport = nodemailer.createTransport({} as any);
    sendMailMock = transport.sendMail;
  });

  it("skips sendWelcomeEmail when given a demo email address", async () => {
    await sendWelcomeEmail("Alex Candidate", "demo_candidate_123@hirehub.demo");
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("sends sendWelcomeEmail when given a real user email address", async () => {
    await sendWelcomeEmail("Jane Doe", "jane.doe@company.com");
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "jane.doe@company.com",
        subject: "Welcome to HireHub 🎉",
      })
    );
  });

  it("skips candidate confirmation email in sendApplicationSubmittedEmail if candidate is demo", async () => {
    await sendApplicationSubmittedEmail({
      candidateEmail: "demo_candidate_123@hirehub.demo",
      candidateName: "Demo Candidate",
      recruiterEmail: "recruiter.real@company.com",
      recruiterName: "Real Recruiter",
      jobTitle: "Senior Engineer",
      companyName: "Acme Corp",
    });

    // Should only call sendMail once for the recruiter, skipping candidate
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "recruiter.real@company.com",
      })
    );
  });

  it("skips recruiter notification email in sendApplicationSubmittedEmail if recruiter is demo", async () => {
    await sendApplicationSubmittedEmail({
      candidateEmail: "candidate.real@gmail.com",
      candidateName: "Real Candidate",
      recruiterEmail: "demo_recruiter_999@hirehub.demo",
      recruiterName: "Demo Recruiter",
      jobTitle: "Staff Engineer",
      companyName: "Stripe",
    });

    // Should only call sendMail once for the candidate, skipping demo recruiter
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "candidate.real@gmail.com",
      })
    );
  });

  it("skips all emails in sendApplicationSubmittedEmail if both are demo accounts", async () => {
    await sendApplicationSubmittedEmail({
      candidateEmail: "demo_candidate_123@hirehub.demo",
      candidateName: "Demo Candidate",
      recruiterEmail: "demo_recruiter_999@hirehub.demo",
      recruiterName: "Demo Recruiter",
      jobTitle: "Frontend Lead",
      companyName: "HireHub Demo",
    });

    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("skips sendApplicationStatusEmail when candidate is a demo email", async () => {
    await sendApplicationStatusEmail({
      candidateEmail: "demo_mock_123@hirehub.demo",
      candidateName: "Mock Candidate",
      jobTitle: "DevOps Engineer",
      companyName: "CloudTech",
      status: "Selected",
    });

    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("sends sendApplicationStatusEmail when candidate has a real email", async () => {
    await sendApplicationStatusEmail({
      candidateEmail: "candidate.real@gmail.com",
      candidateName: "Real Candidate",
      jobTitle: "DevOps Engineer",
      companyName: "CloudTech",
      status: "Selected",
    });

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "candidate.real@gmail.com",
        subject: expect.stringContaining("Congratulations!"),
      })
    );
  });
});

