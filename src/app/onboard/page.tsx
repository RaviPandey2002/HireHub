import { OnBoarding } from "@/components/onboard";
import { getUser } from "actions/getUser";
import { redirect } from "next/navigation";

const OnBoardingPage = async () => {
  const user = await getUser();
  console.log("onboard user",user);
  if(!user){
    console.log("ITs magic")
    redirect('/')
  }
  if (user?.role === "OnBoarding"){ return <>{<OnBoarding currentUser={user} />}</>;}
  console.log("onboard page redirected");
  redirect('/');
};

export default OnBoardingPage;
