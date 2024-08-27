import Dashboard from "./(protected)/(dashboard)/page";
import OnBoardingPage from "./(protected)/onboard/page";
import LandingPage from "./landing-page/landingPage";
import { getUser } from "actions/getUser";

const Home = async () => {
  const currentUser = await getUser();
  return (
    <>
      {
        (currentUser) ? (currentUser?.role === "OnBoarding" ?  <OnBoardingPage currentUser={currentUser}/> : <Dashboard/>) : <LandingPage/> 
      }
    </>
  )
}

export default Home;