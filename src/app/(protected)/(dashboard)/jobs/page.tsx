import { JobsListing } from "@/components/dash-components/jobs-listing";
import { getUser } from "actions/getUser";


async function JobsPage() {
    const user = await getUser();
    console.log("JobPage user ",user)
    return (<>
    <JobsListing user/>
    </>);
}

export default JobsPage;