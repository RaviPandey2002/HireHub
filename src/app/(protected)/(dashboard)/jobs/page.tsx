import { JobsListing } from "@/components/dash-components/jobs-listing";
import { fetchJobsForRecruiterAction } from "actions/fetchJobs";
import { getUser } from "actions/getUser";


async function JobsPage() {
    const user = await getUser();
    let profileInfo;
    user?.role === "Recruiter" ? profileInfo=user?.recruiterInfo : profileInfo=user?.candidateInfo;
    const jobList = await fetchJobsForRecruiterAction(user?.id);
    return (<>
    <JobsListing user={user} jobList={jobList}/>
    </>);
}

export default JobsPage;