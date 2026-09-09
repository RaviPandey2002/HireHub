import { getUser } from "actions/getUser";
import { LandingPage } from "./components/landingPage";
import { db } from "lib/db";
import { redirect } from "next/navigation";

const Home = async () => {
  const user = await getUser();

  // If user is authenticated, route them to their workspace
  if (user) {
    if (user.role === "OnBoarding") {
      redirect("/onboard");
    }
    redirect("/dashboard");
  }

  // Guest visitor: Fetch live featured jobs and total count for marketing view
  const [featuredJobs, totalJobsCount] = await Promise.all([
    db.jobs.findMany({
      take: 6,
      orderBy: { id: "desc" },
    }),
    db.jobs.count(),
  ]);

  return (
    <LandingPage
      user={null}
      profileInfo={undefined}
      featuredJobs={JSON.parse(JSON.stringify(featuredJobs))}
      totalJobsCount={totalJobsCount}
      candidateStats={null}
      recruiterStats={null}
    />
  );
};

export default Home;
