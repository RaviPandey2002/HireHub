import { getUser } from "actions/getUser";
import { LandingPage } from "./components/landingPage";
import { db } from "lib/db";
import { fetchCandidateDashboardStats, fetchRecruiterDashboardStats } from "data/user";

// Middleware redirects OnBoarding-role users to /onboard before this page renders.
const Home = async () => {
  const user = await getUser();

  // 1. Fetch live featured jobs and total count for all visitors
  const [featuredJobs, totalJobsCount] = await Promise.all([
    db.jobs.findMany({
      take: 6,
      orderBy: { id: "desc" },
    }),
    db.jobs.count(),
  ]);

  // 2. Fetch role-specific metrics if authenticated
  let candidateStats = null;
  let recruiterStats = null;

  if (user?.role === "Candidate") {
    candidateStats = await fetchCandidateDashboardStats(user.id);
  } else if (user?.role === "Recruiter") {
    recruiterStats = await fetchRecruiterDashboardStats(user.id);
  }

  return (
    <LandingPage
      user={user}
      profileInfo={user?.role}
      featuredJobs={JSON.parse(JSON.stringify(featuredJobs))}
      totalJobsCount={totalJobsCount}
      candidateStats={candidateStats}
      recruiterStats={recruiterStats}
    />
  );
};

export default Home;
