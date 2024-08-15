import { auth, signOut } from "../../../../auth";
import { Button } from "../../../../components/ui/button";
import { redirect } from "next/navigation"


const OnBoardingPage = async () => {
  const session = await auth();
  console.log("ONNNN: ",session);
  return (
    <>
      This is on board page !!!
      <div></div>
      {
        session.user ? JSON.stringify(session.user): null
      }
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button className="bg-black text-white h-10 w-30">SignOut</Button>
      </form>
    </>
  );
};

export default OnBoardingPage;

// import { fetchProfileAction } from "@/actions";
// import { OnBoardingPage } from "../../../../components/on-board";

// import { currentUser } from "@clerk/nextjs";

// import { redirect } from "next/navigation";

// function OnBoardPage() {
//   return <OnBoardingPage />;
// //get the auth user from clerk
// const user = await currentUser();

// //fetch the profile info -> either user is candidate / user is recruiter
// const profileInfo = await fetchProfileAction(user?.id);

// if (profileInfo?._id) {
//   if (profileInfo?.role === "recruiter" && !profileInfo.isPremiumUser)
//     redirect("/membership");
//   else redirect("/");
// } else return <OnBoard />;
// }

// export default OnBoardPage;
