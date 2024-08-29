import { Dashboard } from "@/components/dash-components/dashboard"
import OnBoardingPage from "./onboard/page";
import LandingPage from "./landing-page/landingPage";
import { getUser } from "actions/getUser";

const Home = async () => {
  const user = await getUser();
  return (
    <>
      {user ? (
        user?.role === "OnBoarding" ? (
          <OnBoardingPage />
        ) : (
          <Dashboard />
        )
      ) : (
        <LandingPage />
      )}
    </>
  );
};

export default Home;
