import { OnBoarding } from "@/components/onboard";
import { getUser } from "actions/getUser";

const OnBoardingPage = async () => {
  const currentUser = await getUser();
  
  return (
    <>
      {
        <OnBoarding/>   
      }
     
    </>
  );
};

export default OnBoardingPage;
