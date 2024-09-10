import { Dashboard } from "@/components/dash-components/dashboard"
import OnBoardingPage from "./onboard/page";
import LandingPage from "./landing-page/landingPage";
import { getUser } from "actions/getUser";
import { redirect } from "next/navigation";

const Home = async () => {
  const user = await getUser();
  return (
    <div className="ml-5 mr-5">
      {user ? (
        user?.role === "OnBoarding" ? (
          <OnBoardingPage />
        ) : (
          <LandingPage user={user} profileInfo={user?.role} />
        )
      ) : redirect("/login")}
    </div >
  );
};

export default Home;
