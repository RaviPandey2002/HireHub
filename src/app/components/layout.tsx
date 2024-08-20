import Header from "@components/helper/header"
import { getUser } from "actions/getUser"
// import CandidatePage from "src/app/(protected)/candidate/page"
// import RecruiterPage from "../(protected)/recruiter/page"
import OnBoardingPage from "../(protected)/onboard/page";



async function CommonLayout() {
  const user = await getUser();
  console.log("USSSER", user);
  const userRole = "Candidate";
  return (
    <>
      <div className="mx-auto max-w-7xl p-6 lg:px-8">
        <Header />
        {
          (user) ? <OnBoardingPage /> : null
        }
      </div>
    </>
  )
}

export default CommonLayout;