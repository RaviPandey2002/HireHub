import { JobsListing } from "@/components/dash-components/jobs-listing";
import { getUser } from "actions/getUser";
import { fetchJobApplicationsForCandidate, fetchJobApplicationsForRecruiter, fetchJobsForCandidate, fetchJobsForRecruiter } from "data/user";


async function JobsPage() {
    const user = await getUser();
    let profileInfo;
    user?.role === "Recruiter"
        ? profileInfo = user?.recruiterInfo
        : profileInfo = user?.candidateInfo;
        
    const jobList = user?.role === "Recruiter"
        ? await fetchJobsForRecruiter(user?.id)
        : await fetchJobsForCandidate();

    const jobApplications = user?.role === "Recruiter"
        ? await fetchJobApplicationsForRecruiter(user?.id)
        : await fetchJobApplicationsForCandidate(user?.id)

    return (<>
        <JobsListing user={user} jobList={jobList} jobApplications={jobApplications} />
    </>);
}
export default JobsPage;