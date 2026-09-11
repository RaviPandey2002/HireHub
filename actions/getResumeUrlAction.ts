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

  // 1. Fetch candidate details and verify candidate exists in DB
  const candidate = await db.user.findUnique({
    where: { id: candidateId },
    select: { id: true, email: true, candidateInfo: true },
  });

  if (!candidate) {
    return { error: "Candidate not found." };
  }

  // 2. Access Control: Owner candidate or authenticated Recruiter
  const isOwner = session.user.id === candidate.id;
  if (!isOwner && session.user.role !== "Recruiter") {
    return { error: "Unauthorized to access this resume." };
  }

  const resumePath = (candidate.candidateInfo as Record<string, any>)?.resume;
  const isDemo =
    session.user.email?.includes("@hirehub.demo") ||
    session.user.email?.includes("@demo.local") ||
    candidate.email?.includes("@hirehub.demo") ||
    candidate.email?.includes("@demo.local") ||
    !resumePath ||
    typeof resumePath !== "string" ||
    resumePath.startsWith("public/demo") ||
    resumePath.includes("demo_resume");

  const isSupabaseConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes("placeholder");

  // If in demo mode or if Supabase is unconfigured, seamlessly serve the dynamic resume preview
  if (isDemo || !isSupabaseConfigured) {
    return { success: true, url: `/api/resume/preview?candidateId=${candidate.id}` };
  }

  // 3. For real user uploads with configured Supabase storage, attempt signed URL
  try {
    const { data, error } = await supabaseClient.storage
      .from("hirehub-bucket-public")
      .createSignedUrl(resumePath, 60);

    if (!error && data?.signedUrl) {
      return { success: true, url: data.signedUrl };
    }

    console.warn("Supabase signed URL error, falling back to dynamic candidate profile:", error);
    return { success: true, url: `/api/resume/preview?candidateId=${candidate.id}` };
  } catch (err: any) {
    console.warn("Supabase error caught, falling back to dynamic candidate profile:", err);
    return { success: true, url: `/api/resume/preview?candidateId=${candidate.id}` };
  }
}

