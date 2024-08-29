import { JobsListing } from "@/components/dash-components/jobs-listing";
import { getUser } from "actions/getUser";


async function JobsPage() {
    const user = await getUser();
    let profileInfo;
    user?.role === "Recruiter" ? profileInfo=user?.recruiterInfo : profileInfo=user?.candidateInfo;
    return (<>
    <JobsListing user={user}/>
    </>);
}

export default JobsPage;