import { CandidateActivity } from "@/components/dash-components/candidate-activity";
import { getUser } from "actions/getUser";
import { fetchJobApplicationsForCandidate, fetchJobsForCandidate } from "data/user";
import { redirect } from "next/navigation";

async function Activity() {
    const user = await getUser();
    if (!user || user.role === "OnBoarding") redirect("/onboard");
    if (user.role === "Recruiter") redirect("/dashboard");

    const jobList = await fetchJobsForCandidate();
    const jobApplicants = await fetchJobApplicationsForCandidate(user.id);
    return (
        <CandidateActivity jobList={jobList || []} jobApplicants={jobApplicants || []} />
    );
}

export default Activity;