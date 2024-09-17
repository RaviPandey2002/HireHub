import { CandidateActivity } from "@/components/dash-components/candidate-activity";
import { getUser } from "actions/getUser";
import { fetchJobApplicationsForCandidate, fetchJobsForCandidate } from "data/user";

async function Activity() {
    const user = await getUser();
    const jobList = await fetchJobsForCandidate();
    console.log("activity jobList",jobList)
    const jobApplicants = await fetchJobApplicationsForCandidate(user?.id);
        return (
        <CandidateActivity jobList={jobList} jobApplicants={jobApplicants} />
    )
}

export default Activity;