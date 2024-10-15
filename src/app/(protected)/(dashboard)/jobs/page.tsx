import { JobsListing } from "@/components/dash-components/jobs-listing";
import { getUser } from "actions/getUser";
import { createFilterCategoriesAction, fetchJobApplicationsForCandidate, fetchJobApplicationsForRecruiter, fetchJobsForCandidate, fetchJobsForRecruiter } from "data/user";


async function JobsPage() {
    const user = await getUser();
    let profileInfo;
    user?.role === "Recruiter"
        ? profileInfo = user?.recruiterInfo
        : profileInfo = user?.candidateInfo;

    const allJobs = user?.role === "Recruiter"
        ? await fetchJobsForRecruiter(user?.id)
        : await fetchJobsForCandidate();

    const jobApplications = user?.role === "Recruiter"
        ? await fetchJobApplicationsForRecruiter(user?.id)
        : await fetchJobApplicationsForCandidate(user?.id)

    // const allJobs = await createFilterCategoriesAction();

    return (
        <JobsListing user={user} allJobs={allJobs} jobApplications={jobApplications} />
    );
}
export default JobsPage;