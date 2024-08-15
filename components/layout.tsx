import Header from "./header"
import { Button } from "./ui/button"

import { signOut, auth } from "../auth"
async function CommonLayout({ children }) {
  const session = await auth();
  if(session && session.user){
    console.log("session:", session);
    const user = session.user;
  }
  return (
    <div className="mx-auto max-w-7xl p-6 lg:px-8">
      {/* Header Component */}
      <Header userSession={session} />
      {/* Header Component */}

      {/* Main Content */}
      <main>{children}</main>

      {/* Main Content */}
    </div>
  )
}

export default CommonLayout;