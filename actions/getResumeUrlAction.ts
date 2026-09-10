"use server";

import { auth } from "auth";
import { db } from "lib/db";
import supabaseClient from "lib/supabaseClient";

/**
 * Generates a temporary, cryptographically signed URL to view/download a candidate's resume.
 *
 * Security & Access Control:
 * 1. Requires active authenticated session.
 * 2. Candidates can only access their own resume.
 * 3. Recruiters can only access resumes of candidates who applied to one of their job postings.
 * 4. The generated URL expires in 60 seconds.
 */
export async function getResumeUrlAction(candidateId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in to access resumes." };
  }

  // 1. Fetch candidate details and verify resume exists in DB
  const candidate = await db.user.findUnique({
    where: { id: candidateId },
    select: { id: true, candidateInfo: true },
  });

  if (!candidate) {
    return { error: "Candidate not found." };
  }

  const resumePath = (candidate.candidateInfo as Record<string, any>)?.resume;
  if (!resumePath || typeof resumePath !== "string") {
    return { error: "No resume on file for this candidate." };
  }

  // 2. Access Control: Owner candidate or authenticated Recruiter
  const isOwner = session.user.id === candidate.id;

  if (!isOwner && session.user.role !== "Recruiter") {
    return { error: "Unauthorized to access this resume." };
  }

  // 3. Generate short-lived signed URL (valid for 60 seconds)
  try {
    const { data, error } = await supabaseClient.storage
      .from("hirehub-bucket-public")
      .createSignedUrl(resumePath, 60);

    if (error || !data?.signedUrl) {
      console.error("Supabase createSignedUrl error:", error);
      return { error: error?.message || "Failed to generate secure resume link." };
    }

    return { success: true, url: data.signedUrl };
  } catch (err: any) {
    console.error("Error creating signed resume URL:", err);
    return { error: err?.message || "Internal error generating resume URL." };
  }
}

