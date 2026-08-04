import { FeedView } from "@/components/dash-components/feed-view";
import { getUser } from "actions/getUser";
import {
  fetchJobApplicationsForRecruiter,
  fetchJobsForCandidate,
} from "data/user";

async function FeedPage() {
  const user = await getUser();

  const data =
    user?.role === "Recruiter"
      ? await fetchJobApplicationsForRecruiter(user?.id)
      : await fetchJobsForCandidate();

  return <FeedView user={user} data={data} />;
}

export default FeedPage;
