import Header from "@/components/common/header"
import { SignOutButton } from "./helper/signOutButton";
import { auth } from "auth";
import { getUser } from "actions/getUser"


async function CommonLayout({ children }) {
  const session = await auth();
  const user = session?.user;
  // console.log("header user session:",session)

  return (
    <>
      <div className="mx-auto max-w-7xl p-6 lg:px-8 ml-5">
        <Header user profileInfo={user?.role} />
        <main>{children}</main>
        <SignOutButton />
      </div>
    </>
  )
}

export default CommonLayout;