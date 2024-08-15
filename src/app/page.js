import { auth } from "../../auth";
import OnBoardingPage from "./(protected)/onboard/page";
import CandidatePage from "./(protected)/candidate/page";
// import RecruiterPage from "./(protected)/recruiter/page";
// import InvalidPage from "./(protected)/Invalid";

export default function Home() {
  // const session = await auth();
  // let role = null;
  // if (session && session.user) {
  //   console.log("middleWare: ", session.user.role);
  //   redirect("../settings");
  //   role = session.user.role;
  // }
  // console.log("ROLE:", role);
  return (
    <>
      HOME Page
    </>
  );
}

// <main className="flex min-h-screen flex-col items-center justify-between p-24">
//     <div>
//       Main content
//     </div>
// </main>
