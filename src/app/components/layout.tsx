import Header from "@components/common/header"
import { getUser } from "actions/getUser"
import { SignOutButton } from "./helper/signOutButton";

async function CommonLayout({ children }) {
  const user = await getUser();
  return (
    <>
      <div className="mx-auto max-w-7xl p-6 lg:px-8 ml-5">
        <Header />
        <main>{children}</main>
        <SignOutButton/>
      </div>
    </>
  )
}

export default CommonLayout;