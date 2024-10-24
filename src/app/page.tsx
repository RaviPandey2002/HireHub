import { getUser } from "actions/getUser";
import { redirect } from "next/navigation";
import { LandingPage } from "./components/landingPage";



const Home = async () => {
  const user = await getUser();
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
