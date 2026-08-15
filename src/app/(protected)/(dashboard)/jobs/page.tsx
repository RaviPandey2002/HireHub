import { Suspense } from "react";
import { JobsListing } from "@/components/dash-components/jobs-listing";
import { getUser } from "actions/getUser";
import {
  fetchJobApplicationsForCandidate,
  fetchJobApplicationsForRecruiter,
  fetchJobsForCandidate,
  fetchJobsForRecruiter,
} from "data/user";
import Loading from "@/components/loading";

async function JobsPage() {
  const user = await getUser();

  const allJobs =
    user?.role === "Recruiter"
      ? await fetchJobsForRecruiter(user?.id)
      : await fetchJobsForCandidate();

  const jobApplications =
    user?.role === "Recruiter"
      ? await fetchJobApplicationsForRecruiter(user?.id)
      : await fetchJobApplicationsForCandidate(user?.id);

  return (
    <Suspense fallback={<Loading />}>
      <JobsListing user={user} allJobs={allJobs} jobApplications={jobApplications} />
    </Suspense>
  );
}

export default JobsPage;
