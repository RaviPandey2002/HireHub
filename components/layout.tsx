import Header from "./header"
import { Button } from "./ui/button"

import { signOut, auth } from "../auth"
async function CommonLayout({ children }) {
  const session = JSON.stringify(await auth());
  // console.log("session:", session);

  return (
    <div className="mx-auto max-w-7xl p-6 lg:px-8">
      {/* Header Component */}
      <Header userSession={session} />
      {/* Header Component */}

      {/* Main Content */}
      <main>{children}</main>


      <form action={async () => {
        "use server"
        await signOut();
        console.log("LogOut successfully!!")
        return Response.redirect(new URL("./"));
          }}>
        <Button
          className="bg-black text-white h-10 w-30">
          SignOut
        </Button>
      </form>
      {/* Main Content */}
    </div>
  )
}

export default CommonLayout;