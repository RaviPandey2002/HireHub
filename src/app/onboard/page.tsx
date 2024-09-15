import { OnBoarding } from "@/components/onboard";
import { getUser } from "actions/getUser";
import { redirect } from "next/navigation";

const OnBoardingPage = async () => {
  const user = await getUser();
  if(!user){
    redirect('/')
  }
  if (user?.role === "OnBoarding"){ return <>{<OnBoarding currentUser={user} />}</>;}
};

export default OnBoardingPage;
