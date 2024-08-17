import { DisplayData } from "./helper/display-data";
import Header from "@components/helper/header"
import { getUser } from "../../../actions/getUser"
import CandidatePage from "src/app/(protected)/candidate/page"
import RecruiterPage from "../(protected)/recruiter/page"

async function CommonLayout({ children }) {
  const user = await getUser();
  const userRole = "Candidate";
  return (
    <div className="mx-auto max-w-7xl p-6 lg:px-8">
      <Header />
      <main>{children}</main>
      {
        (userRole === "Candidate") ? <CandidatePage /> : <RecruiterPage />
      }
      <DisplayData />
    </div>
  )
}

export default CommonLayout;