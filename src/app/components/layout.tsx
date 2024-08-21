import Header from "@components/helper/header"
import { getUser } from "actions/getUser"


async function CommonLayout({ children }) {
  const user = await getUser();
  console.log("USSSER", user);
  const userRole = "Candidate";
  return (
    <>
      <div className="mx-auto max-w-7xl p-6 lg:px-8 ml-5">
        <Header />
        <main>{children}</main>
      </div>
    </>
  )
}

export default CommonLayout;