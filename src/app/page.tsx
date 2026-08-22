import { getUser } from "actions/getUser";
import { LandingPage } from "./components/landingPage";

// Middleware redirects OnBoarding-role users to /onboard before this page renders.
const Home = async () => {
  const user = await getUser();
  return <LandingPage user={user} profileInfo={user?.role} />;
};

export default Home;
