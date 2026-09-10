import { Suspense } from "react";
import { getUser } from "actions/getUser";
import { redirect } from "next/navigation";
import { fetchCandidatesForTalentPool, fetchJobsForRecruiter } from "data/user";
import { TalentView } from "@/components/dash-components/talent-view";
import Loading from "@/components/loading";

export const metadata = {
  title: "Talent Discovery | HireHub",
  description: "Search, filter, and screen verified tech talent open to new roles.",
};

async function TalentPage() {
  const user = await getUser();

  if (!user || user.role === "OnBoarding") {
    redirect("/onboard");
  }

  // Restrict to recruiters
  if (user.role === "Candidate") {
    redirect("/dashboard");
  }

  const [candidates, recruiterJobs] = await Promise.all([
    fetchCandidatesForTalentPool(),
    fetchJobsForRecruiter(user.id),
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <TalentView
        user={user}
        candidates={candidates || []}
        recruiterJobs={recruiterJobs || []}
      />
    </Suspense>
  );
}

export default TalentPage;

