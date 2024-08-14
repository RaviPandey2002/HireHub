// import { fetchProfileAction } from "@/actions";
import { OnBoardingPage } from "../../../../components/on-board";

// import { currentUser } from "@clerk/nextjs";

import { redirect } from "next/navigation";

function OnBoardPage() {
  return <OnBoardingPage />;
  // //get the auth user from clerk
  // const user = await currentUser();

  // //fetch the profile info -> either user is candidate / user is recruiter
  // const profileInfo = await fetchProfileAction(user?.id);

  // if (profileInfo?._id) {
  //   if (profileInfo?.role === "recruiter" && !profileInfo.isPremiumUser)
  //     redirect("/membership");
  //   else redirect("/");
  // } else return <OnBoard />;
}

export default OnBoardPage;
