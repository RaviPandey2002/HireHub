import { getUser } from "actions/getUser";
import { LandingPage } from "./components/landingPage";

// Middleware redirects OnBoarding-role users to /onboard before this page renders.
const Home = async () => {
  const user = await getUser();
  return (
    <div className="w-full px-3 sm:px-5">
      <LandingPage user={user} profileInfo={user?.role} />
    </div>
  );
};

export default Home;
