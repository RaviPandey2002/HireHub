import { getUser } from "actions/getUser";
import { redirect } from "next/navigation";
import LandingPage from "./landing-page/landingPage";

const Home = async () => {
  const user = await getUser();
  console.log("page user",user);
  return (
    <div className="ml-5 mr-5">
      {
        user && user?.role === "OnBoarding" 
        ? redirect('/onboard') 
        : <LandingPage user={user} profileInfo={user?.role} />
      }
    </div >
  );
};

export default Home;
