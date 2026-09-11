"use server";

import { signIn } from "auth";
import { AuthError } from "next-auth";
import {
  createDemoRecruiterSession,
  createDemoCandidateSession,
} from "lib/demoSandboxService";

export async function demoLoginAction(role: "Recruiter" | "Candidate") {
  if (role !== "Recruiter" && role !== "Candidate") {
    return { error: "Invalid demo role selected." };
  }

  try {
    const sessionConfig =
      role === "Recruiter"
        ? await createDemoRecruiterSession()
        : await createDemoCandidateSession();

    const response = await signIn("credentials", {
      email: sessionConfig.email,
      password: sessionConfig.password,
      redirect: false,
    });

    if (!response) {
      return { error: "Failed to authenticate demo session." };
    }

    return {
      success: `Welcome to the ${role} demo!`,
      role,
      email: sessionConfig.email,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Failed to sign into demo session." };
    }
    console.error("demoLoginAction error:", error);
    return { error: "Failed to initialize demo sandbox. Please try again." };
  }
}
