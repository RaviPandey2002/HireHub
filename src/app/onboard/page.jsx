import { OnBoarding } from "@/components/onboard";
import { getUser } from "actions/getUser";
import { redirect } from "next/navigation";

const OnBoardingPage = async () => {
  const user = await getUser();
  // console.log("onboard user",user);
  if(!user) redirect('/')
  return <>{<OnBoarding currentUser={user} />}</>;
};

export default OnBoardingPage;
