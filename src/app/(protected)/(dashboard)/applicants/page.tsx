import { Suspense } from "react";
import { getUser } from "actions/getUser";
import { redirect } from "next/navigation";
import { fetchEnrichedApplicantsForRecruiter, fetchJobsForRecruiter } from "data/user";
import { ApplicantsView } from "@/components/dash-components/applicants-view";
import Loading from "@/components/loading";

export const metadata = {
  title: "Candidate Pipeline | HireHub",
  description: "Track, screen, and manage all incoming applicants across your active job openings.",
};

async function ApplicantsPage() {
  const user = await getUser();

  if (!user || user.role === "OnBoarding") {
    redirect("/onboard");
  }

  // Restrict to recruiters
  if (user.role === "Candidate") {
    redirect("/dashboard");
  }

  const [enrichedApplicants, recruiterJobs] = await Promise.all([
    fetchEnrichedApplicantsForRecruiter(user.id),
    fetchJobsForRecruiter(user.id),
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <ApplicantsView
        user={user}
        initialApplicants={enrichedApplicants || []}
        jobs={recruiterJobs || []}
      />
    </Suspense>
  );
}

export default ApplicantsPage;

