import Header from "@components/helper/header"
import { getUser } from "actions/getUser"
// import CandidatePage from "src/app/(protected)/candidate/page"
// import RecruiterPage from "../(protected)/recruiter/page"
import OnBoardingPage from "../(protected)/onboard/page";

async function CommonLayout({ children }) {
  const user = await getUser();
  console.log("USSSER", user);
  const userRole = "Candidate";
  return (
    <>
      <div className="mx-auto max-w-7xl p-6 lg:px-8">
        <Header />
        HEADER
        <main>{children}</main>
        {/* {
          (user) ? <OnBoardingPage /> : null
        } */}
      </div>
    </>
  )
}

export default CommonLayout;